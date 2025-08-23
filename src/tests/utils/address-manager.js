import fs from "fs";
import path from "path";
import { chromium } from "playwright";

const ADDRESS_FILE = path.join(
  process.cwd(),
  "src/tests/data/real-addresses-db.json",
);
const ADDRESSES_DIR = path.join(process.cwd(), "src/tests/data");

// Ensure data directory exists
if (!fs.existsSync(ADDRESSES_DIR)) {
  fs.mkdirSync(ADDRESSES_DIR, { recursive: true });
}

class AddressManager {
  constructor() {
    this.addresses = this.loadAddresses();
  }

  loadAddresses() {
    if (fs.existsSync(ADDRESS_FILE)) {
      try {
        const data = JSON.parse(fs.readFileSync(ADDRESS_FILE, "utf8"));
        console.log(
          `📁 Loaded ${data.addresses?.length || 0} addresses from database`,
        );
        return data;
      } catch (error) {
        console.log("⚠️ Error loading address database, starting fresh");
        return { addresses: [], lastUpdated: null, testSessions: [] };
      }
    }
    return { addresses: [], lastUpdated: null, testSessions: [] };
  }

  saveAddresses() {
    fs.writeFileSync(ADDRESS_FILE, JSON.stringify(this.addresses, null, 2));
    console.log(
      `💾 Saved ${this.addresses.addresses.length} addresses to database`,
    );
  }

  async scrapeNewAddresses(targetCount = 20) {
    console.log(`🕷️ Scraping ${targetCount} new real addresses from Redfin...`);

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    });
    const page = await context.newPage();

    try {
      await page.goto("https://www.redfin.com/city/8903/TX/Houston", {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });

      await page.waitForTimeout(5000);

      const newAddresses = await page.evaluate((targetCount) => {
        const results = [];
        const seenAddresses = new Set();
        const pageText =
          document.body.innerText || document.body.textContent || "";

        const addressPatterns = [
          /\d+\s+[A-Za-z\s]+(?:St|Street|Ave|Avenue|Blvd|Boulevard|Dr|Drive|Rd|Road|Way|Ln|Lane|Ct|Court|Pl|Place)\s*,?\s*Houston/gi,
          /\d+\s+[A-Za-z\s]+(?:St|Street|Ave|Avenue|Blvd|Boulevard|Dr|Drive|Rd|Road|Way|Ln|Lane|Ct|Court|Pl|Place)\s*,?\s*TX/gi,
          /\d{3,6}\s+[A-Za-z\s]{3,30}(?:St|Street|Ave|Avenue|Blvd|Boulevard|Dr|Drive|Rd|Road|Way|Ln|Lane|Ct|Court|Pl|Place)/gi,
        ];

        addressPatterns.forEach((pattern, patternIndex) => {
          const matches = pageText.match(pattern) || [];
          matches.forEach((match) => {
            const cleanAddress = match.replace(/\s+/g, " ").trim();
            if (
              !seenAddresses.has(cleanAddress) &&
              results.length < targetCount
            ) {
              seenAddresses.add(cleanAddress);
              const houseNumberMatch = cleanAddress.match(/^(\d+)/);
              const houseNumber = houseNumberMatch ? houseNumberMatch[1] : "";

              if (houseNumber && houseNumber.length >= 3) {
                results.push({
                  id: `${houseNumber}-${Date.now()}-${results.length}`,
                  address:
                    cleanAddress +
                    (cleanAddress.includes("Houston") ? "" : ", Houston, TX"),
                  houseNumber,
                  source: "Redfin",
                  scrapedAt: new Date().toISOString(),
                  method: `pattern-${patternIndex + 1}`,
                  tested: false,
                  testResults: [],
                });
              }
            }
          });
        });

        return results;
      }, targetCount);

      console.log(`✅ Scraped ${newAddresses.length} new addresses`);
      return newAddresses;
    } catch (error) {
      console.error("❌ Scraping failed:", error.message);
      return [];
    } finally {
      await browser.close();
    }
  }

  async ensureAddresses(minCount = 10) {
    const existingCount = this.addresses.addresses?.length || 0;
    const untestedCount = this.getUntestedAddresses().length;

    console.log(
      `📊 Address inventory: ${existingCount} total, ${untestedCount} untested`,
    );

    if (untestedCount >= minCount) {
      console.log(
        `✅ Sufficient untested addresses available (${untestedCount})`,
      );
      return this.addresses.addresses;
    }

    console.log(
      `🔄 Need more addresses. Scraping ${minCount - untestedCount + 5} new ones...`,
    );
    const newAddresses = await this.scrapeNewAddresses(
      minCount - untestedCount + 5,
    );

    if (newAddresses.length > 0) {
      if (!this.addresses.addresses) {
        this.addresses.addresses = [];
      }

      // Add new addresses, avoiding duplicates
      const existingHouseNumbers = new Set(
        this.addresses.addresses.map((a) => a.houseNumber),
      );
      const uniqueNewAddresses = newAddresses.filter(
        (addr) => !existingHouseNumbers.has(addr.houseNumber),
      );

      this.addresses.addresses.push(...uniqueNewAddresses);
      this.addresses.lastUpdated = new Date().toISOString();
      this.saveAddresses();

      console.log(`➕ Added ${uniqueNewAddresses.length} unique new addresses`);
    }

    return this.addresses.addresses;
  }

  getUntestedAddresses(count = null) {
    const untested = (this.addresses.addresses || []).filter(
      (addr) => !addr.tested,
    );
    return count ? untested.slice(0, count) : untested;
  }

  getTestedAddresses() {
    return (this.addresses.addresses || []).filter((addr) => addr.tested);
  }

  markAddressTested(addressId, testResult) {
    const address = this.addresses.addresses.find(
      (addr) => addr.id === addressId,
    );
    if (address) {
      address.tested = true;
      address.testedAt = new Date().toISOString();
      if (!address.testResults) {
        address.testResults = [];
      }
      address.testResults.push(testResult);
      this.saveAddresses();
      console.log(`✅ Marked address ${address.houseNumber} as tested`);
    }
  }

  recordTestSession(sessionData) {
    if (!this.addresses.testSessions) {
      this.addresses.testSessions = [];
    }
    this.addresses.testSessions.push(sessionData);
    this.saveAddresses();
  }

  getStats() {
    const total = this.addresses.addresses?.length || 0;
    const tested = this.getTestedAddresses().length;
    const untested = this.getUntestedAddresses().length;
    const sessions = this.addresses.testSessions?.length || 0;

    return {
      total,
      tested,
      untested,
      sessions,
      successRate:
        tested > 0
          ? (
              (this.getTestedAddresses().filter((a) =>
                a.testResults.some((r) => r.status === "FULL_SUCCESS"),
              ).length /
                tested) *
              100
            ).toFixed(1) + "%"
          : "N/A",
    };
  }

  printStats() {
    const stats = this.getStats();
    console.log("\n📊 ADDRESS DATABASE STATS:");
    console.log(`   🏠 Total Addresses: ${stats.total}`);
    console.log(`   ✅ Tested: ${stats.tested}`);
    console.log(`   ⏳ Untested: ${stats.untested}`);
    console.log(`   🧪 Test Sessions: ${stats.sessions}`);
    console.log(`   🎯 Success Rate: ${stats.successRate}`);
  }
}

export default AddressManager;

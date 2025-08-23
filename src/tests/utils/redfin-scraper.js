import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function scrapeRedfinHouston() {
  console.log("🚀 Starting Redfin scraper for Houston, TX...");

  const browser = await chromium.launch({
    headless: false,
    timeout: 60000,
    args: ["--disable-http2", "--no-sandbox"],
  });

  try {
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    });

    const page = await context.newPage();

    // Navigate to Redfin Houston search
    console.log("🔍 Loading Redfin Houston properties...");
    await page.goto("https://www.redfin.com/city/8903/TX/Houston", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    // Wait for page to load
    await page.waitForTimeout(5000);

    console.log("📄 Analyzing Redfin page content...");

    // Take a screenshot to see what we're working with
    await page.screenshot({
      path: "houston-redfin-debug.png",
      fullPage: false,
    });

    // Extract property data from Redfin
    const addresses = await page.evaluate(() => {
      const results = [];
      const seenAddresses = new Set();

      // Try multiple Redfin-specific selectors
      const selectors = [
        ".HomeCard",
        ".home-card",
        ".SearchResultsList .result",
        '[data-rf-test-name="home-card"]',
        ".result-item",
        ".listing-card",
      ];

      let foundElements = [];

      // Try each selector
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          console.log(
            `Found ${elements.length} elements with selector: ${selector}`,
          );
          foundElements = Array.from(elements);
          break;
        }
      }

      if (foundElements.length === 0) {
        // Fallback: look for any elements that might contain address info
        console.log("Using fallback method...");
        foundElements = Array.from(document.querySelectorAll("*")).filter(
          (el) => {
            const text = el.textContent || "";
            return text.match(
              /\d+\s+[A-Za-z\s]+(?:St|Street|Ave|Avenue|Blvd|Boulevard|Dr|Drive|Rd|Road|Way|Ln|Lane|Ct|Court)/i,
            );
          },
        );
      }

      console.log(`Processing ${foundElements.length} elements...`);

      foundElements.forEach((element) => {
        if (results.length >= 15) return; // Limit to 15 properties

        try {
          let address = "";
          let price = "";

          // Look for address in various ways
          const addressSelectors = [
            ".address",
            ".street-address",
            ".listing-address",
            '[data-rf-test-name="address"]',
            ".home-address",
          ];

          // Try specific address selectors
          for (const addrSel of addressSelectors) {
            const addrElement = element.querySelector(addrSel);
            if (addrElement && addrElement.textContent.trim()) {
              address = addrElement.textContent.trim();
              break;
            }
          }

          // If no specific selector worked, look in text content
          if (!address) {
            const text = element.textContent || "";
            const addressMatch = text.match(
              /\d+\s+[A-Za-z\s]+(?:St|Street|Ave|Avenue|Blvd|Boulevard|Dr|Drive|Rd|Road|Way|Ln|Lane|Ct|Court)[^,]*/i,
            );
            if (addressMatch) {
              address = addressMatch[0];
            }
          }

          // Look for price
          const priceSelectors = [
            ".price",
            ".listing-price",
            ".home-price",
            '[data-rf-test-name="price"]',
            ".sold-price",
          ];

          for (const priceSel of priceSelectors) {
            const priceElement = element.querySelector(priceSel);
            if (priceElement && priceElement.textContent.trim()) {
              price = priceElement.textContent.trim();
              break;
            }
          }

          // If no specific price selector, look for price patterns
          if (!price) {
            const text = element.textContent || "";
            const priceMatch = text.match(/\$[\d,]+/);
            if (priceMatch) {
              price = priceMatch[0];
            }
          }

          // Clean up address and price
          address = address.replace(/\s+/g, " ").trim();
          price = price.replace(/\s+/g, " ").trim();

          if (address && !seenAddresses.has(address)) {
            seenAddresses.add(address);

            const houseNumberMatch = address.match(/^(\d+)/);
            const houseNumber = houseNumberMatch ? houseNumberMatch[1] : "";

            if (houseNumber) {
              results.push({
                address:
                  address +
                  (address.includes("Houston") ? "" : ", Houston, TX"),
                houseNumber,
                price: price || "N/A",
                source: "Redfin",
                scrapedAt: new Date().toISOString(),
                method: "redfin-scraper",
              });
            }
          }
        } catch (e) {
          console.log("Error extracting property:", e.message);
        }
      });

      return results;
    });

    console.log(`✅ Found ${addresses.length} addresses from Redfin`);

    // If we didn't get enough addresses, try text extraction fallback
    if (addresses.length < 5) {
      console.log("🔄 Trying text extraction fallback...");

      const fallbackAddresses = await page.evaluate(() => {
        const results = [];
        const seenAddresses = new Set();

        // Get all text content from the page
        const pageText =
          document.body.innerText || document.body.textContent || "";

        // Look for Houston address patterns
        const addressPatterns = [
          /\d+\s+[A-Za-z\s]+(?:St|Street|Ave|Avenue|Blvd|Boulevard|Dr|Drive|Rd|Road|Way|Ln|Lane|Ct|Court|Pl|Place)\s*,?\s*Houston/gi,
          /\d+\s+[A-Za-z\s]+(?:St|Street|Ave|Avenue|Blvd|Boulevard|Dr|Drive|Rd|Road|Way|Ln|Lane|Ct|Court|Pl|Place)\s*,?\s*TX/gi,
          /\d{3,6}\s+[A-Za-z\s]{3,30}(?:St|Street|Ave|Avenue|Blvd|Boulevard|Dr|Drive|Rd|Road|Way|Ln|Lane|Ct|Court|Pl|Place)/gi,
        ];

        addressPatterns.forEach((pattern, patternIndex) => {
          const matches = pageText.match(pattern) || [];
          console.log(
            `Pattern ${patternIndex + 1} found ${matches.length} matches`,
          );

          matches.forEach((match) => {
            const cleanAddress = match.replace(/\s+/g, " ").trim();

            if (!seenAddresses.has(cleanAddress) && results.length < 10) {
              seenAddresses.add(cleanAddress);

              const houseNumberMatch = cleanAddress.match(/^(\d+)/);
              const houseNumber = houseNumberMatch ? houseNumberMatch[1] : "";

              if (houseNumber) {
                results.push({
                  address:
                    cleanAddress +
                    (cleanAddress.includes("Houston") ? "" : ", Houston, TX"),
                  houseNumber,
                  price: "N/A",
                  source: "Redfin (text extraction)",
                  scrapedAt: new Date().toISOString(),
                  method: `text-pattern-${patternIndex + 1}`,
                });
              }
            }
          });
        });

        return results;
      });

      addresses.push(...fallbackAddresses);
      console.log(`✅ Total addresses after fallback: ${addresses.length}`);
    }

    // Save addresses
    const outputDir = path.join(__dirname, "../../data/real-addresses");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputData = {
      meta: {
        scrapedAt: new Date().toISOString(),
        source: "Redfin Live Scraping",
        totalAddresses: addresses.length,
        method: "Playwright Web Scraping",
        disclaimer: "Real addresses scraped from live Redfin listings",
      },
      addresses: addresses.map((addr) => ({
        houseNumber: addr.houseNumber,
        fullAddress: addr.address,
        streetName: addr.address
          .substring(addr.address.indexOf(" ") + 1)
          .split(",")[0],
        city: "Houston",
        state: "TX",
        price: addr.price || "N/A",
        beds: "N/A",
        baths: "N/A",
        sqft: "N/A",
        propertyUrl: "",
        source: addr.source,
        marketType: "live-listing",
        confidence: "VERIFIED_REAL",
        extractionMethod: addr.method,
      })),
    };

    const outputFile = path.join(outputDir, "redfin-scraped-addresses.json");
    fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2));

    console.log(
      `💾 Saved ${addresses.length} real addresses to: ${outputFile}`,
    );

    if (addresses.length > 0) {
      console.log("\n🏠 Sample addresses found:");
      addresses.slice(0, 5).forEach((addr, i) => {
        console.log(
          `   ${i + 1}. ${addr.houseNumber} - ${addr.address} (${addr.price})`,
        );
      });
    } else {
      console.log("❌ No addresses found");

      // Take a screenshot for debugging
      await page.screenshot({
        path: "houston-redfin-failed.png",
        fullPage: true,
      });
      console.log("📸 Saved debug screenshot as houston-redfin-failed.png");
    }

    return outputData;
  } catch (error) {
    console.error("❌ Error scraping Redfin:", error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run if called directly (ES module check)
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("🚀 Starting Redfin scraper for Houston, TX...");
  scrapeRedfinHouston()
    .then((result) => {
      if (result && result.addresses && result.addresses.length > 0) {
        console.log("\n✅ Redfin scraping completed successfully!");
        console.log(
          `📊 Found ${result.addresses.length} real Houston addresses`,
        );
        process.exit(0);
      } else {
        console.log("\n❌ Redfin scraping failed - no addresses found");
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("❌ Redfin scraping error:", error.message);
      console.error("Full error:", error);
      process.exit(1);
    });
}

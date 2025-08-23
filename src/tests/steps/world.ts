import { setWorldConstructor, IWorldOptions } from "@cucumber/cucumber";
import { firefox, Browser, Page } from "@playwright/test";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class CustomWorld {
  browser: Browser | undefined;
  page: Page | undefined;

  constructor(options: IWorldOptions) {
    // No super call needed
  }

  async openBrowser() {
    const headless = process.env.HEADLESS === "true";
    const browserType = process.env.BROWSER_TYPE || "firefox";

    console.log(
      `CustomWorld: launching browser (${browserType}, headless: ${headless})...`,
    );
    this.browser = await firefox.launch({ headless });
    console.log("CustomWorld: browser launched.");
    this.page = await this.browser.newPage();
    console.log("CustomWorld: new page opened.");
    // Small wait to ensure page is ready
    await delay(1000);
  }

  async closeBrowser() {
    if (this.page && !this.page.isClosed()) {
      await this.page.close();
      console.log("CustomWorld: page closed.");
    }
    if (this.browser) {
      await this.browser.close();
      console.log("CustomWorld: browser closed.");
    }
  }

  async validatePropertyContent() {
    if (!this.page) {
      throw new Error("Page not available for property validation");
    }

    console.log("🔍 Validating property content quality...");

    const metrics = {
      hasImage: false,
      hasPrice: false,
      hasDescription: false,
      hasBedrooms: false,
      hasBathrooms: false,
      hasSquareFootage: false,
      hasPropertyType: false,
      hasLotSize: false,
      hasYearBuilt: false,
      hasAddress: false,
    };

    // Wait for page to fully load
    await this.page.waitForTimeout(2000);

    // Check for property image
    const imageSelectors = [
      'img[src*="property"]',
      'img[alt*="property"]',
      'img[alt*="house"]',
      'img[alt*="home"]',
      ".property-image img",
      ".property-photo img",
      ".listing-image img",
      '[data-testid="property-image"]',
      ".image-container img",
      ".photo-container img",
    ];

    for (const selector of imageSelectors) {
      try {
        const imageElement = this.page.locator(selector).first();
        if (await imageElement.isVisible()) {
          metrics.hasImage = true;
          console.log(`✅ Property image found with selector: ${selector}`);
          break;
        }
      } catch (e) {
        // Try next selector
      }
    }

    // Check for price
    const priceSelectors = [
      "text=/\\$[\\d,]+/",
      ".price",
      ".property-price",
      ".listing-price",
      '[data-testid="price"]',
      ".cost",
      ".amount",
    ];

    for (const selector of priceSelectors) {
      try {
        const priceElement = this.page.locator(selector).first();
        if (await priceElement.isVisible()) {
          const priceText = await priceElement.textContent();
          if (priceText && priceText.includes("$")) {
            metrics.hasPrice = true;
            console.log(`✅ Property price found: ${priceText.trim()}`);
            break;
          }
        }
      } catch (e) {
        // Try next selector
      }
    }

    // Check for description/details
    const descriptionSelectors = [
      ".property-description",
      ".listing-description",
      ".property-details",
      ".description",
      '[data-testid="description"]',
      ".property-info",
      ".details-section",
    ];

    for (const selector of descriptionSelectors) {
      try {
        const descElement = this.page.locator(selector).first();
        if (await descElement.isVisible()) {
          const descText = await descElement.textContent();
          if (descText && descText.trim().length > 50) {
            metrics.hasDescription = true;
            console.log(
              `✅ Property description found (${descText.trim().length} characters)`,
            );
            break;
          }
        }
      } catch (e) {
        // Try next selector
      }
    }

    // Check for bedrooms
    const bedroomPatterns = [
      "text=/\\d+\\s*bed/i",
      "text=/\\d+\\s*br/i",
      "text=/bedroom/i",
    ];

    for (const pattern of bedroomPatterns) {
      try {
        const bedElement = this.page.locator(pattern).first();
        if (await bedElement.isVisible()) {
          metrics.hasBedrooms = true;
          const bedText = await bedElement.textContent();
          console.log(`✅ Bedroom info found: ${bedText?.trim()}`);
          break;
        }
      } catch (e) {
        // Try next pattern
      }
    }

    // Check for bathrooms
    const bathroomPatterns = [
      "text=/\\d+\\s*bath/i",
      "text=/\\d+\\s*ba/i",
      "text=/bathroom/i",
    ];

    for (const pattern of bathroomPatterns) {
      try {
        const bathElement = this.page.locator(pattern).first();
        if (await bathElement.isVisible()) {
          metrics.hasBathrooms = true;
          const bathText = await bathElement.textContent();
          console.log(`✅ Bathroom info found: ${bathText?.trim()}`);
          break;
        }
      } catch (e) {
        // Try next pattern
      }
    }

    // Check for square footage
    const sqftPatterns = [
      "text=/\\d+[,\\d]*\\s*sq\\s*ft/i",
      "text=/\\d+[,\\d]*\\s*sqft/i",
      "text=/\\d+[,\\d]*\\s*square\\s*feet/i",
    ];

    for (const pattern of sqftPatterns) {
      try {
        const sqftElement = this.page.locator(pattern).first();
        if (await sqftElement.isVisible()) {
          metrics.hasSquareFootage = true;
          const sqftText = await sqftElement.textContent();
          console.log(`✅ Square footage found: ${sqftText?.trim()}`);
          break;
        }
      } catch (e) {
        // Try next pattern
      }
    }

    // Check for address
    const addressPatterns = [
      "text=/\\d+\\s+[A-Za-z\\s]+(?:St|Street|Ave|Avenue|Blvd|Boulevard|Dr|Drive|Rd|Road|Way|Ln|Lane|Ct|Court)/i",
      ".address",
      ".property-address",
      '[data-testid="address"]',
    ];

    for (const pattern of addressPatterns) {
      try {
        const addressElement = this.page.locator(pattern).first();
        if (await addressElement.isVisible()) {
          metrics.hasAddress = true;
          const addressText = await addressElement.textContent();
          console.log(`✅ Address found: ${addressText?.trim()}`);
          break;
        }
      } catch (e) {
        // Try next pattern
      }
    }

    // Store metrics for later use
    (this as any).propertyMetrics = metrics;

    // Log comprehensive results
    console.log("\n📊 Property Content Quality Report:");
    console.log(`   🖼️  Has Image: ${metrics.hasImage ? "✅" : "❌"}`);
    console.log(`   💰 Has Price: ${metrics.hasPrice ? "✅" : "❌"}`);
    console.log(
      `   📝 Has Description: ${metrics.hasDescription ? "✅" : "❌"}`,
    );
    console.log(`   🛏️  Has Bedrooms: ${metrics.hasBedrooms ? "✅" : "❌"}`);
    console.log(`   🚿 Has Bathrooms: ${metrics.hasBathrooms ? "✅" : "❌"}`);
    console.log(
      `   📐 Has Square Footage: ${metrics.hasSquareFootage ? "✅" : "❌"}`,
    );
    console.log(`   🏠 Has Address: ${metrics.hasAddress ? "✅" : "❌"}`);

    const totalChecks = Object.keys(metrics).length;
    const passedChecks = Object.values(metrics).filter(Boolean).length;
    const contentQualityScore = Math.round((passedChecks / totalChecks) * 100);

    console.log(
      `\n🎯 Content Quality Score: ${contentQualityScore}% (${passedChecks}/${totalChecks})`,
    );

    return metrics;
  }
}

setWorldConstructor(CustomWorld);

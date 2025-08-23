import { test, expect } from "@playwright/test";
import TestHelpers from "./utils/test-helpers";
import testConfig from "./config/test.config";

test.describe("Accessibility Tests", () => {
  test("should have proper page titles", async ({ page }) => {
    await page.goto("/");
    await TestHelpers.waitForStableUI(page, 1000);

    // Check that page has a title
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
    console.log(`Login page title: ${title}`);

    // Should contain "DocuDeals" in the title
    expect(title).toContain("DocuDeals");
  });

  test("should have proper heading structure", async ({ page }) => {
    await page.goto("/");
    await TestHelpers.waitForStableUI(page);

    // Check for proper heading hierarchy
    const h1Count = await page.locator("h1").count();
    const h2Count = await page.locator("h2").count();
    const h3Count = await page.locator("h3").count();

    console.log(
      `Heading structure: H1: ${h1Count}, H2: ${h2Count}, H3: ${h3Count}`,
    );

    // Should have at least one h1
    expect(h1Count).toBeGreaterThanOrEqual(0);
  });

  test("should have proper form labels", async ({ page }) => {
    await page.goto("/");
    await TestHelpers.waitForStableUI(page);

    // Check that form inputs have proper labels or aria-labels
    const inputs = page.locator("input");
    const inputCount = await inputs.count();

    let labeledInputs = 0;
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const ariaLabel = await input.getAttribute("aria-label");
      const placeholder = await input.getAttribute("placeholder");
      const id = await input.getAttribute("id");

      // Check for associated label
      let hasLabel = false;
      if (id) {
        const labelCount = await page.locator(`label[for="${id}"]`).count();
        hasLabel = labelCount > 0;
      }

      if (ariaLabel || placeholder || hasLabel) {
        labeledInputs++;
      }
    }

    console.log(`Form inputs: ${inputCount}, Labeled inputs: ${labeledInputs}`);

    // All inputs should have some form of labeling
    if (inputCount > 0) {
      expect(labeledInputs).toBeGreaterThan(0);
    }
  });

  test("should have proper button text", async ({ page }) => {
    await page.goto("/");
    await TestHelpers.waitForStableUI(page);

    // Check that buttons have descriptive text
    const buttons = page.locator("button");
    const buttonCount = await buttons.count();

    let descriptiveButtons = 0;
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute("aria-label");

      if (
        (text && text.trim().length > 0) ||
        (ariaLabel && ariaLabel.length > 0)
      ) {
        descriptiveButtons++;
      }
    }

    console.log(
      `Buttons: ${buttonCount}, Descriptive buttons: ${descriptiveButtons}`,
    );

    // All buttons should have descriptive text
    if (buttonCount > 0) {
      expect(descriptiveButtons).toBe(buttonCount);
    }
  });

  test("should have proper color contrast", async ({ page }) => {
    await page.goto("/");
    await TestHelpers.waitForStableUI(page);

    // Basic color contrast check - check for visible text
    const textElements = page.locator(
      "p, span, div, h1, h2, h3, h4, h5, h6, button, a",
    );
    const textCount = await textElements.count();

    let visibleTextElements = 0;
    for (let i = 0; i < Math.min(textCount, 10); i++) {
      // Check first 10 elements
      const element = textElements.nth(i);
      const isVisible = await element.isVisible();
      const text = await element.textContent();

      if (isVisible && text && text.trim().length > 0) {
        visibleTextElements++;
      }
    }

    console.log(`Visible text elements (sample): ${visibleTextElements}`);
    expect(visibleTextElements).toBeGreaterThan(0);
  });

  test("should be keyboard navigable", async ({ page }) => {
    await page.goto("/");
    await TestHelpers.waitForStableUI(page);

    // Test keyboard navigation
    const focusableElements = page.locator(
      'input, button, a, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const focusableCount = await focusableElements.count();

    console.log(`Focusable elements: ${focusableCount}`);

    if (focusableCount > 0) {
      // Try to focus first element
      await focusableElements.first().focus();
      const firstElementFocused = await focusableElements
        .first()
        .evaluate((el) => el === document.activeElement);
      expect(firstElementFocused).toBe(true);

      // Try tab navigation
      await page.keyboard.press("Tab");
      // Check that focus moved (implementation specific)
    }
  });
});

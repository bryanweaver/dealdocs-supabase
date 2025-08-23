import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

// Test scenarios for PropertyData UI improvements

Given("I am viewing a property with no price information", async function () {
  // Navigate to a property page with mock data that has no price
  await this.page.goto("/property-data?mock=noprice");
  await this.page.waitForSelector('[data-testid="property-details"]', {
    timeout: 10000,
  });
});

Given("I am viewing a property with status information", async function () {
  // Navigate to a property page with status data
  await this.page.goto("/property-data?mock=withstatus");
  await this.page.waitForSelector('[data-testid="property-details"]', {
    timeout: 10000,
  });
});

Given("I am viewing a property with both transaction types", async function () {
  // Navigate to a property page with both recorded transactions and transaction history
  await this.page.goto("/property-data?mock=fulltransactions");
  await this.page.waitForSelector('[data-testid="property-details"]', {
    timeout: 10000,
  });
});

Given(
  "I am viewing a property with duplicate status entries",
  async function () {
    // Navigate to a property page with duplicate status data
    await this.page.goto("/property-data?mock=duplicates");
    await this.page.waitForSelector('[data-testid="property-details"]', {
      timeout: 10000,
    });
  },
);

Given("I am viewing a property with transaction data", async function () {
  // Navigate to a property page with transaction data (some with/without names)
  await this.page.goto("/property-data?mock=transactions");
  await this.page.waitForSelector('[data-testid="property-details"]', {
    timeout: 10000,
  });
});

Given(
  "I am viewing a property with multiple status entries",
  async function () {
    // Navigate to a property page with multiple status entries for sorting test
    await this.page.goto("/property-data?mock=multiplestatuses");
    await this.page.waitForSelector('[data-testid="property-details"]', {
      timeout: 10000,
    });
  },
);

Given("I am viewing property details", async function () {
  // Navigate to a property page with standard data
  await this.page.goto("/property-data");
  await this.page.waitForSelector('[data-testid="property-details"]', {
    timeout: 10000,
  });
});

When("I look at the price display area", async function () {
  this.priceDisplay = await this.page.locator(".text-2xl.font-bold").first();
});

When("I look at the status pills", async function () {
  this.statusPills = await this.page.locator(
    ".rounded-full.inline-flex.items-center",
  );
});

When("I scroll down to the history sections", async function () {
  await this.page
    .locator('h3:has-text("Recorded Transactions")')
    .scrollIntoViewIfNeeded();
  this.recordedTransactionsSection = this.page.locator(
    'h3:has-text("Recorded Transactions")',
  );
  this.transactionHistorySection = this.page.locator(
    'h3:has-text("Transaction History")',
  );
});

When("I look at the Transaction History section", async function () {
  this.transactionHistoryItems = this.page.locator(
    '[data-testid="transaction-history"] li',
  );
});

When("I look at the Recorded Transactions section", async function () {
  this.recordedTransactionsItems = this.page.locator(
    '[data-testid="recorded-transactions"] li',
  );
});

When("I look at the List Price in Property Specifications", async function () {
  this.listPriceElement = this.page
    .locator('dt:has-text("List Price")')
    .locator("+ dd");
});

Then(
  "I should see {string} without a dollar sign",
  async function (text: string) {
    await expect(this.priceDisplay).toContainText(text);
    const priceText = await this.priceDisplay.textContent();
    expect(priceText).not.toMatch(/^\$/);
  },
);

Then(
  "I should not see {string} followed by undefined or null",
  async function (symbol: string) {
    const priceText = await this.priceDisplay.textContent();
    expect(priceText).not.toMatch(/\$\s*(undefined|null)/);
  },
);

Then(
  "the status pill should be larger with px-4 py-2 padding",
  async function () {
    const statusPill = this.statusPills.first();
    await expect(statusPill).toHaveClass(/px-4/);
    await expect(statusPill).toHaveClass(/py-2/);
    await expect(statusPill).toHaveClass(/text-sm/);
  },
);

Then("the MLS number pill should not be displayed", async function () {
  const mlsPill = this.page.locator('.rounded-full:has-text("MLS#")');
  await expect(mlsPill).toHaveCount(0);
});

Then("only the property status should be shown", async function () {
  const statusTexts = ["For Sale", "Sold"];
  const statusPill = this.statusPills.first();
  const statusText = await statusPill.textContent();
  expect(
    statusTexts.some((status) => statusText.includes(status)),
  ).toBeTruthy();
});

Then(
  "{string} should appear before {string}",
  async function (first: string, second: string) {
    const firstSection = this.page.locator(`h3:has-text("${first}")`);
    const secondSection = this.page.locator(`h3:has-text("${second}")`);

    const firstBox = await firstSection.boundingBox();
    const secondBox = await secondSection.boundingBox();

    expect(firstBox.y).toBeLessThan(secondBox.y);
  },
);

Then("both sections should show newest entries first", async function () {
  // Check that dates are in descending order
  const dateElements = this.page.locator("time[datetime]");
  const dates = await dateElements.evaluateAll((elements: Element[]) =>
    elements.map((el) => new Date(el.getAttribute("datetime"))),
  );

  for (let i = 1; i < dates.length; i++) {
    expect(dates[i - 1] >= dates[i]).toBeTruthy();
  }
});

Then(
  "I should not see duplicate entries with the same type and date",
  async function () {
    const statusItems = await this.transactionHistoryItems.all();
    const statusKeys = new Set();

    for (const item of statusItems) {
      const statusText = await item.locator("p").first().textContent();
      const dateText = await item.locator("time").getAttribute("datetime");
      const key = `${statusText}-${dateText}`;

      expect(statusKeys.has(key)).toBeFalsy();
      statusKeys.add(key);
    }
  },
);

Then("I should not see any entries without valid dates", async function () {
  const statusItems = await this.transactionHistoryItems.all();

  for (const item of statusItems) {
    const dateElement = item.locator("time[datetime]");
    const dateText = await dateElement.getAttribute("datetime");

    // Verify that all entries have valid dates
    expect(dateText).toBeTruthy();
    expect(dateText.trim()).not.toBe("");

    // Verify that the date is actually valid
    const date = new Date(dateText);
    expect(date.getTime()).not.toBeNaN();
  }
});

Then("I should only see transactions that have buyer names", async function () {
  const transactionItems = await this.recordedTransactionsItems.all();

  for (const item of transactionItems) {
    const nameText = await item.locator("p").first().textContent();

    // Should contain actual names, not just placeholder text
    expect(nameText).toMatch(/\w+\s+\w+/); // Should have at least first and last name pattern
    expect(nameText).not.toContain("undefined");
    expect(nameText).not.toContain("null");
    expect(nameText.trim()).not.toBe("");
  }
});

Then(
  "I should not see any transactions without buyer first or last names",
  async function () {
    const transactionItems = await this.recordedTransactionsItems.all();

    for (const item of transactionItems) {
      const nameText = await item.locator("p").first().textContent();

      // Verify that transactions without proper names are filtered out
      expect(nameText).not.toMatch(/^\s*purchased the property/); // No empty name at start
      expect(nameText).not.toMatch(/undefined.*purchased the property/);
      expect(nameText).not.toMatch(/null.*purchased the property/);
    }
  },
);

Then("the entries should be sorted with newest dates first", async function () {
  const dateElements = await this.transactionHistoryItems
    .locator("time[datetime]")
    .all();
  const dates = [];

  for (const dateEl of dateElements) {
    const dateStr = await dateEl.getAttribute("datetime");
    dates.push(new Date(dateStr));
  }

  // Check that dates are in descending order (newest first)
  for (let i = 1; i < dates.length; i++) {
    expect(dates[i - 1] >= dates[i]).toBeTruthy();
  }
});

Then("older entries should appear below newer ones", async function () {
  const dateElements = await this.transactionHistoryItems
    .locator("time[datetime]")
    .all();
  const positions = [];

  for (const dateEl of dateElements) {
    const dateStr = await dateEl.getAttribute("datetime");
    const boundingBox = await dateEl.boundingBox();
    positions.push({
      date: new Date(dateStr),
      y: boundingBox.y,
    });
  }

  // Sort by Y position and verify dates are in correct order
  positions.sort((a, b) => a.y - b.y);

  for (let i = 1; i < positions.length; i++) {
    // Earlier Y position (higher on page) should have newer or equal date
    expect(positions[i - 1].date >= positions[i].date).toBeTruthy();
  }
});

Then(
  "all unique statuses should be displayed chronologically",
  async function () {
    const dateElements = await this.transactionHistoryItems
      .locator("time")
      .all();
    const dates = [];

    for (const dateEl of dateElements) {
      const dateStr = await dateEl.getAttribute("datetime");
      dates.push(new Date(dateStr));
    }

    // Check that dates are in descending order (newest first)
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i - 1] >= dates[i]).toBeTruthy();
    }
  },
);

Then(
  "if no price is available, it should show {string}",
  async function (text: string) {
    const listPriceText = await this.listPriceElement.textContent();
    if (!listPriceText.includes("$")) {
      expect(listPriceText.trim()).toBe(text);
    }
  },
);

Then("if a price exists, it should show with a dollar sign", async function () {
  const listPriceText = await this.listPriceElement.textContent();
  if (listPriceText.includes("$")) {
    expect(listPriceText).toMatch(/^\$/);
  }
});

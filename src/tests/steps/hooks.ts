import { Before, After, AfterAll, setDefaultTimeout } from "@cucumber/cucumber";
import { CustomWorld } from "./world.js";

setDefaultTimeout(30 * 1000);

Before(async function (this: CustomWorld) {
  console.log("Launching browser...");
  await this.openBrowser();
  console.log("Browser launched.");
});

After(async function (this: CustomWorld) {
  await this.closeBrowser();
});

AfterAll(async function () {
  setTimeout(() => {
    console.log("Forcing process exit after all tests.");
    process.exit(0);
  }, 1000);
});

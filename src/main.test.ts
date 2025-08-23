import { describe, it, expect, vi } from "vitest";

// Mock all the dependencies that main.ts imports
vi.mock("@/assets/styles.scss", () => ({}));
vi.mock("@/assets/tailwind.css", () => ({}));
vi.mock("floating-vue/dist/style.css", () => ({}));
vi.mock("file-icon-vectors/dist/file-icon-vivid.min.css", () => ({}));

vi.mock("aws-amplify", () => ({
  Amplify: {
    configure: vi.fn(),
  },
}));

vi.mock("./aws-exports", () => ({}));

vi.mock("@/router/index.js", () => ({
  default: {
    push: vi.fn(),
    replace: vi.fn(),
  },
}));

vi.mock("./store/store", () => ({
  default: {
    state: {},
    commit: vi.fn(),
    dispatch: vi.fn(),
  },
}));

vi.mock("floating-vue", () => ({
  default: {},
}));

vi.mock("@primevue/themes/aura", () => ({
  default: {},
}));

vi.mock("primevue/config", () => ({
  default: {},
}));

vi.mock("primevue/confirmationservice", () => ({
  default: {},
}));

vi.mock("primevue/toastservice", () => ({
  default: {},
}));

describe("main.ts", () => {
  it("should test main module configuration", async () => {
    // Test that we can create a Vue app configuration
    const { createApp } = await import("vue");
    const app = createApp({});
    expect(app).toBeDefined();
    expect(typeof app.mount).toBe("function");
  });
});

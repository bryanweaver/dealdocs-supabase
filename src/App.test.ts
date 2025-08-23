import { mount } from "@vue/test-utils";
import App from "./App.vue";
import { describe, it, expect, vi } from "vitest";
import { createStore } from "vuex";

// Mock AWS Amplify
vi.mock("aws-amplify/auth", () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
  confirmSignUp: vi.fn(),
  signUp: vi.fn(),
}));

vi.mock("@aws-amplify/ui-vue", () => ({
  Authenticator: {
    name: "Authenticator",
    template: '<div class="authenticator"><slot /></div>',
    props: ["services", "formFields"],
  },
}));

vi.mock("@aws-amplify/analytics", () => ({
  configureAutoTrack: vi.fn(),
}));

vi.mock("aws-amplify/utils", () => ({
  I18n: {
    putVocabulariesForLanguage: vi.fn(),
  },
}));

// Mock Vue Router
vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("App", () => {
  it("renders app component", () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          Authenticator: true,
          "router-view": true,
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});

/**
 * Test utility functions and helpers
 */
import { mount, VueWrapper } from "@vue/test-utils";
import { createStore, Store } from "vuex";
import { Router, createRouter, createWebHistory } from "vue-router";
import { vi } from "vitest";

/**
 * Create a mock Vuex store for testing
 */
export function createMockStore(initialState: any = {}) {
  const defaultState = {
    accountId: null,
    contractId: null,
    verifiedAddress: {
      streetLine: "",
      secondary: "",
      city: "",
      state: "",
      zipcode: "",
    },
    formData: {
      property: {},
      buyers: {},
      sellers: {},
      finance: {},
      title: {},
      leases: {},
      survey: {},
      titleObjections: {},
      titleNotices: {},
      propertyCondition: {},
      brokerDisclosure: {},
      closing: {},
      possession: {},
      buyerProvisions: {},
      buyerNotices: {},
      buyerAttorney: {},
      listingAgent: {},
      homeownersAssociationAddendum: {},
    },
    requiredFields: {},
    markedQuestions: {},
    currentSectionId: "",
    skipCompletedQuestions: true,
    etchPackets: [],
    uploadedDocuments: {},
    contracts: [],
    agentContactCounts: {},
    ...initialState,
  };

  const store = createStore({
    state: defaultState,
    mutations: {
      setAccountId: vi.fn(),
      setContractId: vi.fn(),
      setVerifiedAddress: vi.fn(),
      setCurrentSectionId: vi.fn(),
      toggleSkipCompletedQuestions: vi.fn(),
      toggleMarkedQuestion: vi.fn(),
      updateFormData: vi.fn(),
      updateSectionFormData: vi.fn(),
      setFormDataFromContract: vi.fn(),
      setPropertyData: vi.fn(),
      setSellerAgentData: vi.fn(),
      resetStore: vi.fn(),
      updateEtchPacket: vi.fn(),
      deleteEtchPacket: vi.fn(),
      setEtchPackets: vi.fn(),
      setContracts: vi.fn(),
      removeContract: vi.fn(),
      setUploadedDocument: vi.fn(),
      deleteUpload: vi.fn(),
      updateSignerStatus: vi.fn(),
      resetUploadedDocs: vi.fn(),
      setAgentContactCounts: vi.fn(),
    },
    getters: {
      getSectionProgress: () => () => ({
        totalQuestions: 0,
        completedQuestions: 0,
      }),
      isSectionComplete: () => () => false,
      isContractComplete: () => false,
      getFirstIncompleteSection: () => "buyers",
      getFirstIncompleteQuestion: () => null,
      getFirstIncompleteQuestionForSection: () => () => null,
      getUploadedDocuments: () => ({}),
      getUploadedDocument: () => () => ({ isUploaded: false }),
      allDocsAreUploaded: () => false,
      allSignersCompleted: () => false,
      getAgentContactCounts: () => ({}),
    },
    actions: {
      selectContract: vi.fn(),
      deleteUpload: vi.fn(),
      uploadDocument: vi.fn(),
      fetchAgentContactCounts: vi.fn(),
    },
  });

  return store;
}

/**
 * Create a mock router for testing
 */
export function createMockRouter(initialRoute: string = "/") {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: "/", component: { template: "<div>Home</div>" } },
      { path: "/contracts", component: { template: "<div>Contracts</div>" } },
      {
        path: "/contracts/:id",
        component: { template: "<div>Contract Details</div>" },
      },
      {
        path: "/contracts/:id/forms/:sectionId",
        component: { template: "<div>Forms</div>" },
      },
    ],
  });
}

/**
 * Mount a component with common testing setup
 */
export function mountWithDefaults(component: any, options: any = {}) {
  const store = options.store || createMockStore();
  const router = options.router || createMockRouter();

  const defaultOptions = {
    global: {
      plugins: [store, router],
      stubs: {
        "router-link": true,
        "router-view": true,
        Teleport: true,
        ...options.stubs,
      },
      mocks: {
        $t: (key: string) => key, // Mock i18n
        ...options.mocks,
      },
    },
    ...options,
  };

  return mount(component, defaultOptions);
}

/**
 * Mock AWS Amplify dependencies
 */
export function mockAmplify() {
  vi.mock("aws-amplify/auth", () => ({
    signIn: vi.fn().mockResolvedValue({}),
    signOut: vi.fn().mockResolvedValue({}),
    confirmSignUp: vi.fn().mockResolvedValue({}),
    signUp: vi.fn().mockResolvedValue({}),
  }));

  vi.mock("@aws-amplify/ui-vue", () => ({
    Authenticator: {
      name: "Authenticator",
      template: '<div class="authenticator"><slot /></div>',
      props: ["services", "formFields"],
    },
  }));

  vi.mock("aws-amplify", () => ({
    Amplify: {
      configure: vi.fn(),
    },
  }));
}

/**
 * Mock PrimeVue components commonly used in tests
 */
export function mockPrimeVue() {
  const components = [
    "Button",
    "InputText",
    "InputNumber",
    "Dropdown",
    "Calendar",
    "Checkbox",
    "RadioButton",
    "SelectButton",
    "Listbox",
    "Panel",
    "Card",
    "DataTable",
    "Column",
    "ProgressBar",
    "Toast",
    "Dialog",
    "ConfirmDialog",
    "Sidebar",
    "Menu",
    "Menubar",
    "Steps",
    "InputMask",
    "DatePicker",
    "InputGroup",
    "Tag",
    "Badge",
    "Chip",
  ];

  const mocks = {};
  components.forEach((component) => {
    mocks[`primevue/${component.toLowerCase()}`] = {
      default: {
        name: component,
        template: `<div class="${component.toLowerCase()}"><slot /></div>`,
        props: [
          "modelValue",
          "value",
          "options",
          "placeholder",
          "disabled",
          "readonly",
        ],
        emits: ["update:modelValue", "change", "click"],
      },
    };
  });

  return mocks;
}

/**
 * Create a timeout promise for testing async operations
 */
export function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wait for Vue's next tick with a timeout
 */
export async function waitForNextTick(
  wrapper: VueWrapper<any>,
  timeoutMs: number = 1000,
) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    await wrapper.vm.$nextTick();
    await timeout(10);
  }
}

/**
 * Mock local storage for testing
 */
export function mockLocalStorage() {
  const store = new Map();

  return {
    getItem: vi.fn((key: string) => store.get(key) || null),
    setItem: vi.fn((key: string, value: string) => store.set(key, value)),
    removeItem: vi.fn((key: string) => store.delete(key)),
    clear: vi.fn(() => store.clear()),
    key: vi.fn((index: number) => Array.from(store.keys())[index] || null),
    get length() {
      return store.size;
    },
  };
}

/**
 * Mock window.location for testing navigation
 */
export function mockLocation(initialUrl: string = "http://localhost:3000/") {
  const url = new URL(initialUrl);

  return {
    href: url.href,
    origin: url.origin,
    protocol: url.protocol,
    host: url.host,
    hostname: url.hostname,
    port: url.port,
    pathname: url.pathname,
    search: url.search,
    hash: url.hash,
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
  };
}

/**
 * Mock fetch for API testing
 */
export function mockFetch(responses: Record<string, any> = {}) {
  return vi.fn((url: string, options?: RequestInit) => {
    const response = responses[url] || { data: {} };
    return Promise.resolve({
      ok: response.ok !== false,
      status: response.status || 200,
      statusText: response.statusText || "OK",
      json: () => Promise.resolve(response.data),
      text: () => Promise.resolve(JSON.stringify(response.data)),
      blob: () => Promise.resolve(new Blob([JSON.stringify(response.data)])),
      headers: new Headers(response.headers || {}),
    });
  });
}

/**
 * Helper to create file objects for testing file uploads
 */
export function createMockFile(
  name: string,
  content: string = "test content",
  type: string = "text/plain",
) {
  const blob = new Blob([content], { type });
  const file = new File([blob], name, { type });
  return file;
}

/**
 * Helper to create FormData for testing
 */
export function createMockFormData(fields: Record<string, any>) {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, String(value));
    }
  });
  return formData;
}

/**
 * Assert that an element exists and is visible
 */
export function expectVisible(wrapper: VueWrapper<any>, selector: string) {
  const element = wrapper.find(selector);
  expect(element.exists()).toBe(true);
  expect(element.isVisible()).toBe(true);
  return element;
}

/**
 * Assert that an element exists but is not visible
 */
export function expectHidden(wrapper: VueWrapper<any>, selector: string) {
  const element = wrapper.find(selector);
  expect(element.exists()).toBe(true);
  expect(element.isVisible()).toBe(false);
  return element;
}

/**
 * Assert that an element does not exist
 */
export function expectNotExists(wrapper: VueWrapper<any>, selector: string) {
  const element = wrapper.find(selector);
  expect(element.exists()).toBe(false);
  return element;
}

/**
 * Helper to simulate user input in forms
 */
export async function fillForm(
  wrapper: VueWrapper<any>,
  fields: Record<string, any>,
) {
  for (const [selector, value] of Object.entries(fields)) {
    const input = wrapper.find(selector);
    if (input.exists()) {
      if (
        input.element.tagName === "INPUT" ||
        input.element.tagName === "TEXTAREA"
      ) {
        await input.setValue(value);
      } else if (input.element.tagName === "SELECT") {
        await input.setValue(value);
      }
      await input.trigger("input");
      await input.trigger("change");
    }
  }
  await wrapper.vm.$nextTick();
}

/**
 * Helper to simulate clicking buttons and links
 */
export async function clickElement(wrapper: VueWrapper<any>, selector: string) {
  const element = wrapper.find(selector);
  expect(element.exists()).toBe(true);
  await element.trigger("click");
  await wrapper.vm.$nextTick();
  return element;
}

/**
 * Helper to wait for an element to appear
 */
export async function waitForElement(
  wrapper: VueWrapper<any>,
  selector: string,
  timeoutMs: number = 5000,
) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    await wrapper.vm.$nextTick();
    const element = wrapper.find(selector);
    if (element.exists()) {
      return element;
    }
    await timeout(50);
  }
  throw new Error(`Element "${selector}" did not appear within ${timeoutMs}ms`);
}

/**
 * Helper to wait for an element to disappear
 */
export async function waitForElementToDisappear(
  wrapper: VueWrapper<any>,
  selector: string,
  timeoutMs: number = 5000,
) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    await wrapper.vm.$nextTick();
    const element = wrapper.find(selector);
    if (!element.exists()) {
      return;
    }
    await timeout(50);
  }
  throw new Error(
    `Element "${selector}" did not disappear within ${timeoutMs}ms`,
  );
}

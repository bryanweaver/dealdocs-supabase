/**
 * Global test setup configuration
 * This file is imported by Vitest before running tests
 */
import { beforeAll, afterAll, beforeEach, afterEach, vi } from "vitest";
import { config } from "@vue/test-utils";

// Mock PrimeVue components globally
function mockPrimeVue() {
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

const primeVueMocks = mockPrimeVue();
Object.entries(primeVueMocks).forEach(([path, component]) => {
  vi.mock(path, () => component);
});

// Global Vue Test Utils configuration
config.global.stubs = {
  // Stub router components
  "router-link": {
    template: "<a><slot /></a>",
    props: ["to"],
  },
  "router-view": {
    template: "<div><slot /></div>",
  },

  // Stub Teleport
  Teleport: {
    template: "<div><slot /></div>",
    props: ["to"],
  },

  // Stub transition components
  transition: {
    template: "<div><slot /></div>",
  },
  "transition-group": {
    template: "<div><slot /></div>",
  },
};

// Mock global objects
beforeAll(() => {
  // Mock window.matchMedia
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock ResizeObserver
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock HTMLElement methods
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.scroll = vi.fn();
  Element.prototype.scrollTo = vi.fn();

  // Mock console methods to reduce noise in tests
  if (process.env.NODE_ENV === "test") {
    global.console = {
      ...console,
      log: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      debug: vi.fn(),
    };
  }

  // Mock crypto for UUID generation
  Object.defineProperty(global, "crypto", {
    value: {
      randomUUID: () => "test-uuid-" + Math.random().toString(36).substr(2, 9),
      getRandomValues: (arr: any) => {
        for (let i = 0; i < arr.length; i++) {
          arr[i] = Math.floor(Math.random() * 256);
        }
        return arr;
      },
    },
  });

  // Mock URL.createObjectURL
  global.URL.createObjectURL = vi.fn(() => "mock-url");
  global.URL.revokeObjectURL = vi.fn();

  // Set test environment variables
  process.env.NODE_ENV = "test";
  process.env.VITE_APP_ENV = "test";
});

beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks();

  // Reset timers
  vi.useFakeTimers();

  // Reset local storage mock
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    key: vi.fn(),
    length: 0,
  };
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
    writable: true,
  });

  // Reset session storage mock
  const sessionStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    key: vi.fn(),
    length: 0,
  };
  Object.defineProperty(window, "sessionStorage", {
    value: sessionStorageMock,
    writable: true,
  });

  // Mock fetch
  global.fetch = vi.fn();

  // Reset window.location
  delete (window as any).location;
  window.location = {
    ...window.location,
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
    href: "http://localhost:3000/",
    origin: "http://localhost:3000",
    protocol: "http:",
    host: "localhost:3000",
    hostname: "localhost",
    port: "3000",
    pathname: "/",
    search: "",
    hash: "",
  } as any;
});

afterEach(() => {
  // Restore timers
  vi.useRealTimers();

  // Clean up any remaining mocks
  vi.restoreAllMocks();
});

afterAll(() => {
  // Final cleanup
  vi.clearAllMocks();
});

// Custom matchers
expect.extend({
  toBeVisible(received) {
    const pass =
      received &&
      received.exists &&
      received.exists() &&
      received.isVisible &&
      received.isVisible();

    if (pass) {
      return {
        message: () => `expected element not to be visible`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected element to be visible`,
        pass: false,
      };
    }
  },

  toHaveBeenCalledWithObjectContaining(received, expected) {
    const pass = received.mock.calls.some((call: any[]) =>
      call.some(
        (arg) =>
          typeof arg === "object" &&
          Object.keys(expected).every((key) => arg[key] === expected[key]),
      ),
    );

    if (pass) {
      return {
        message: () =>
          `expected function not to have been called with object containing ${JSON.stringify(expected)}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected function to have been called with object containing ${JSON.stringify(expected)}`,
        pass: false,
      };
    }
  },
});

// Add custom types for TypeScript
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeVisible(): R;
      toHaveBeenCalledWithObjectContaining(expected: object): R;
    }
  }
}

// Export for use in other test files
export { config };

import { createApp } from "vue";
// import "./style.css";
import "@/assets/styles.scss";
import "@/assets/tailwind.css";

import "floating-vue/dist/style.css";
import "file-icon-vectors/dist/file-icon-vivid.min.css";

import App from "./App.vue";
import router from "@/router/index.js";
import store from "./store/store";
import FloatingVue from "floating-vue";
import { FloatingVueConfig } from "floating-vue/dist/config";
import Aura from "@primevue/themes/aura";
import PrimeVue from "primevue/config";
import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice";
import { Amplify } from "aws-amplify";

const floatingVueConfig: FloatingVueConfig = {
  // Disable popper components
  disabled: false,
  // Default position offset along main axis (px)
  distance: 5,
  // Default position offset along cross axis (px)
  skidding: 0,
  // Default container where the tooltip will be appended
  container: "body",
  // Element used to compute position and size boundaries
  boundary: undefined,
  // Skip delay & CSS transitions when another popper is shown, so that the popper appear to instanly move to the new position.
  instantMove: false,
  // Auto destroy tooltip DOM nodes (ms)
  disposeTimeout: 5000,
  // Triggers on the popper itself
  popperTriggers: [],
  // Positioning strategy
  strategy: "absolute",
  // Prevent overflow
  preventOverflow: true,
  // Flip to the opposite placement if needed
  flip: true,
  // Shift on the cross axis to prevent the popper from overflowing
  shift: true,
  // Overflow padding (px)
  overflowPadding: 0,
  // Arrow padding (px)
  arrowPadding: 0,
  // Compute arrow overflow (useful to hide it)
  arrowOverflow: true,
  /**
   * By default, compute autohide on 'click'.
   */
  autoHideOnMousedown: false,
  // Themes
  themes: {
    tooltip: {
      // Default tooltip placement relative to target element
      placement: "auto",
      distance: 20,
      overflowPadding: 50,
      // Be explicit about ONLY using click and touch
      triggers: ["click", "touch"],
      // Remove the hideTriggers function - let default behavior handle hiding
      hideTriggers: undefined,
      // Make sure popper triggers match
      popperTriggers: ["click", "touch"],
      // Auto-hide when clicking outside
      autoHide: true,
      // Delay (ms)
      delay: {
        show: 200,
        hide: 0,
      },
      // Update popper on content resize
      handleResize: false,
      // Enable HTML content in directive
      html: false,
      // Displayed when tooltip content is loading
      loadingContent: "...",
    },
    dropdown: {
      // Default dropdown placement relative to target element
      placement: "bottom",
      // Default events that trigger the dropdown
      triggers: ["click"],
      // Delay (ms)
      delay: 0,
      // Update popper on content resize
      handleResize: true,
      // Hide on click outside
      autoHide: true,
    },
    menu: {
      $extend: "dropdown",
      triggers: ["touch", "click"],
      popperTriggers: ["touch", "click"],
      delay: {
        show: 0,
        hide: 400,
      },
    },
  },
};

// Dynamic import of aws-exports with fallback to mock config for CI/CD
const loadAmplifyConfig = async () => {
  try {
    const awsExports = await import("./aws-exports.js");
    return awsExports.default;
  } catch (error) {
    console.warn("aws-exports.js not found, using mock configuration for CI/CD");
    // Mock configuration for CI/CD environments
    return {
      aws_project_region: "us-east-1",
      aws_cognito_region: "us-east-1",
      aws_user_pools_id: "mock-user-pool-id",
      aws_user_pools_web_client_id: "mock-client-id",
      aws_appsync_graphqlEndpoint: "https://mock.appsync-api.us-east-1.amazonaws.com/graphql",
      aws_appsync_region: "us-east-1",
      aws_appsync_authenticationType: "API_KEY",
      aws_appsync_apiKey: "mock-api-key",
      aws_cognito_identity_pool_id: "us-east-1:mock-identity-pool",
      aws_user_files_s3_bucket: "mock-s3-bucket",
      aws_user_files_s3_bucket_region: "us-east-1",
    };
  }
};

// Initialize app with async config loading
const initializeApp = async () => {
  const amplifyConfig = await loadAmplifyConfig();
  
  // Configure Amplify without analytics for now
  const config = { ...amplifyConfig };
  delete config.Analytics;
  delete config.aws_mobile_analytics_app_id;
  delete config.aws_mobile_analytics_app_region;

  Amplify.configure(config);

  createApp(App)
    .use(router)
    .use(store)
    .use(FloatingVue, floatingVueConfig)
    .use(PrimeVue, {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: ".app-dark",
        },
      },
    })
    .use(ConfirmationService)
    .use(ToastService)
    .mount("#app");
};

// Initialize the app
initializeApp().catch(console.error);


<script setup lang="ts">
// import { configureAutoTrack } from "@aws-amplify/analytics";
import { Authenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { confirmSignUp, signIn, signOut, signUp } from "aws-amplify/auth";
import { I18n } from "aws-amplify/utils";

// Analytics disabled temporarily - requires proper Pinpoint configuration
// configureAutoTrack({
//   type: "session",
//   enable: true,
// });

// Customize the text labels
I18n.putVocabulariesForLanguage("en", {
  "Sign In": "Login",
  "Sign in": "Log in",
  "Sign in to your account": "Welcome back to DocuDeals",
  "Create Account": "Register",
  "Create a new account": "Join DocuDeals",
  Username: "Email",
  Password: "Password",
  "Forgot your password?": "Reset Password",
  "Reset your password": "Forgot your password?",
  "Enter your username": "Enter your email",
  "Send code": "Reset my password",
  "Back to Sign In": "Back to Login",
});

const router = useRouter();

// Form fields customization
const formFields = {
  signIn: {
    username: {
      placeholder: "Enter your email",
      label: "Email",
      isRequired: true,
    },
    password: {
      placeholder: "Enter your password",
      label: "Password",
      isRequired: true,
    },
  },
  signUp: {
    email: {
      order: 1,
      placeholder: "Enter your email",
    },
    password: {
      order: 2,
      placeholder: "Create a password",
    },
    confirm_password: {
      order: 3,
      placeholder: "Confirm your password",
    },
  },
};

// Service overrides
const services = {
  async handleSignIn(formData) {
    try {
      const signInResult = await signIn(formData);
      localStorage.setItem("loginTimestamp", new Date().getTime().toString());
      router.push("/#/contracts");
      return signInResult;
    } catch (error) {
      console.error("Error signing in:", error);
    }
  },
  async handleSignUp(formData) {
    try {
      const email = formData.username.toLowerCase();
      const signUpResult = await signUp({
        ...formData,
        username: email,
      });
      return signUpResult;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  },
  // Add this new handler for the confirmation step
  async handleConfirmSignUp(formData) {
    try {
      const result = await confirmSignUp(formData);
      // After confirmation, we'll let the user sign in manually
      return result;
    } catch (error) {
      console.error("Error confirming signup:", error);
      throw error;
    }
  },
};

// Session management
const checkAndHandleSessionExpiry = () => {
  const loginTime = localStorage.getItem("loginTimestamp");
  if (loginTime) {
    const currentTime = new Date().getTime();
    const sessionDuration = currentTime - parseInt(loginTime);
    if (sessionDuration > 3600000) {
      handleSignOut();
    }
  }
};

const handleSignOut = async () => {
  localStorage.removeItem("loginTimestamp");
  await signOut();
  router.push("/");
};

onMounted(() => {
  const intervalId = setInterval(checkAndHandleSessionExpiry, 60000);
  return () => clearInterval(intervalId);
});

const currentYear = computed(() => new Date().getFullYear());
</script>

<template>
  <div class="auth-wrapper">
    <Authenticator :services="services" :form-fields="formFields">
      <!-- Default slot for authenticated state -->
      <template #default>
        <router-view />
      </template>

      <!-- Custom header slots -->
      <template #header>
        <div class="custom-header">
          <img
            src="@/assets/docudeals_logo_v1.png"
            alt="DocuDeals Logo"
            class="logo"
          />
          <!-- <h1>DealDocs</h1> -->
        </div>
      </template>

      <!-- Custom footer -->
      <template #footer>
        <div class="custom-footer">
          <small>© {{ currentYear }} DocuDeals. All Rights Reserved.</small>
        </div>
      </template>
    </Authenticator>
  </div>
</template>

<style>
/* Global styles for the Amplify Authenticator */
[data-amplify-authenticator] {
  --amplify-colors-background-primary: var(--primary-color);
  --amplify-colors-background-secondary: var(--surface-color);
  --amplify-colors-brand-primary-10: var(--primary-color);
  --amplify-colors-brand-primary-80: var(--primary-color);
  --amplify-colors-brand-primary-90: var(--primary-color);
  --amplify-colors-brand-primary-100: var(--primary-color);
  --amplify-components-button-primary-background-color: var(--primary-color);
  --amplify-components-button-primary-hover-background-color: #178a46;
  --amplify-components-button-primary-focus-background-color: #178a46;
  --amplify-components-tabs-item-active-color: var(--primary-color);
  --amplify-components-tabs-item-active-border-color: var(--primary-color);
  --amplify-components-tabs-item-color: var(--text-color);
  --amplify-components-fieldcontrol-focus-border-color: var(--primary-color);
  --amplify-components-fieldcontrol-focus-box-shadow: 0 0 0 2px
    var(--primary-color-light);

  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

/* Auth-specific wrapper styles */
[data-amplify-authenticator] .auth-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  width: 100%;
  position: relative;
  z-index: 1;
}

/* Custom header styling */
.custom-header {
  text-align: center;
  margin-bottom: 2rem;
}

.custom-header .logo {
  width: 400px;
  height: auto;
  margin-bottom: 1rem;
}

.custom-header h1 {
  font-size: 2rem;
  font-weight: 800;
  color: var(--primary-color);
  margin: 0;
}

/* Custom footer styling */
.custom-footer {
  text-align: center;
  margin-top: 2rem;
  color: var(--text-color);
  font-size: 0.875rem;
}

/* Override Amplify's default container styles */
:deep(.amplify-authenticator__container) {
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  max-width: 420px;
  width: 100%;
}

/* Style form inputs */
:deep(.amplify-field) {
  margin-bottom: 1.5rem;
}

:deep(.amplify-button) {
  width: 100%;
  height: 48px;
  font-weight: 600;
  border-radius: 0.375rem;
}

:deep(.amplify-tabs) {
  margin-bottom: 2rem;
}
</style>

<script setup lang="ts">
defineOptions({ name: "AuthComponent" })
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { AuthService } from "@/services/auth.js";
import Card from "primevue/card";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Message from "primevue/message";
import TooltipPopover from "@/components/TooltipPopover.vue";
// import ProgressSpinner from "primevue/progressspinner"; // Not currently used

const router = useRouter();
const route = useRoute();

// Component state
const isLoading = ref(false);
const loadingMessage = ref("");
const isSignUp = ref(false);
const isPasswordResetMode = ref(false);
const isForgotPasswordMode = ref(false);
const formData = ref({
  email: "",
  password: "",
  confirmPassword: "",
  fullName: "",
  company: "",
  newPassword: ""
});
const error = ref("");
const message = ref("");

// Computed
const isFormValid = computed(() => {
  // More robust email validation that allows test domains
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailValid = formData.value.email && (
    emailRegex.test(formData.value.email) || 
    formData.value.email.includes("@test") || 
    formData.value.email.includes("@example") ||
    formData.value.email.includes("@dealdocs.test")
  );
  const passwordValid = formData.value.password && formData.value.password.length >= 6;
  const confirmPasswordValid = !isSignUp.value || formData.value.password === formData.value.confirmPassword;
  const fullNameValid = !isSignUp.value || (formData.value.fullName && formData.value.fullName.trim().length > 0);
  return emailValid && passwordValid && confirmPasswordValid && fullNameValid;
});

// Methods
const checkAndHandleSessionExpiry = () => {
  const loginTime = localStorage.getItem("loginTimestamp");
  if (loginTime) {
    const currentTime = new Date().getTime();
    const sessionDuration = currentTime - parseInt(loginTime);
    // Check if more than 1 hour has passed (3600000 milliseconds)
    if (sessionDuration > 3600000) {
      handleSignOut();
    }
  }
};

const handleSignOut = async () => {
  localStorage.removeItem("loginTimestamp");
  await AuthService.signOut();
  router.push("/auth"); // Navigate to auth page
};

const handleAuth = async () => {
  if (!isFormValid.value) return;
  
  isLoading.value = true;
  error.value = "";
  message.value = "";

  try {
    if (isSignUp.value) {
      loadingMessage.value = "Creating your account...";
      const result = await AuthService.signUp(
        formData.value.email,
        formData.value.password,
        {
          fullName: formData.value.fullName,
          company: formData.value.company
        }
      );
      
      if (result.success) {
        // Check if we have both user and session (auto-login case)
        if (result.user && result.session) {
          console.log("✅ Account created and auto-logged in");
          loadingMessage.value = "Account created successfully! Logging you in...";

          // Add a small delay to show the success message
          await new Promise(resolve => setTimeout(resolve, 1500));

          // Store login timestamp
          localStorage.setItem("loginTimestamp", new Date().getTime().toString());
          // Ensure sidebar is closed on login (for mobile)
          if (window.innerWidth <= 991) {
            localStorage.setItem("sidebarClosed", "true");
          }
          router.push("/contracts");
        } else if (result.user && !result.session) {
          // User created but no session - email confirmation required
          message.value = "Account created successfully! Please check your email to confirm your account.";
          // Switch to sign in mode
          isSignUp.value = false;
          formData.value.password = "";
          formData.value.confirmPassword = "";
        } else {
          // User created but need to sign in manually
          message.value = "Account created successfully! Please sign in.";
          // Switch to sign in mode
          isSignUp.value = false;
          formData.value.password = "";
          formData.value.confirmPassword = "";
        }
      } else {
        error.value = result.error;
      }
    } else {
      loadingMessage.value = "Signing you in...";
      const result = await AuthService.signIn(
        formData.value.email,
        formData.value.password
      );

      if (result.success) {
        loadingMessage.value = "Welcome back! Redirecting...";

        // Add a small delay to show the success message
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Store login timestamp
        localStorage.setItem("loginTimestamp", new Date().getTime().toString());
        // Ensure sidebar is closed on login (for mobile)
        if (window.innerWidth <= 991) {
          localStorage.setItem("sidebarClosed", "true");
        }
        router.push("/contracts");
      } else {
        error.value = result.error;
      }
    }
  } catch (err) {
    error.value = "An unexpected error occurred";
    console.error("Auth error:", err);
  } finally {
    isLoading.value = false;
    loadingMessage.value = "";
  }
};

const handleResetPassword = async () => {
  if (!formData.value.email) {
    error.value = "Please enter your email address";
    return;
  }
  
  isLoading.value = true;
  error.value = "";
  
  try {
    const result = await AuthService.resetPassword(formData.value.email);
    if (result.success) {
      message.value = "Password reset email sent. Check your inbox.";
    } else {
      error.value = result.error;
    }
  } catch (err) {
    error.value = "Failed to send reset email";
  } finally {
    isLoading.value = false;
    loadingMessage.value = "";
  }
};

const toggleMode = () => {
  isSignUp.value = !isSignUp.value;
  error.value = "";
  message.value = "";
  formData.value.confirmPassword = "";
  formData.value.fullName = "";
  formData.value.company = "";
};

const handleUpdatePassword = async () => {
  if (!formData.value.newPassword || formData.value.newPassword.length < 6) {
    error.value = "Password must be at least 6 characters";
    return;
  }

  isLoading.value = true;
  error.value = "";

  try {
    const result = await AuthService.updatePassword(formData.value.newPassword);
    if (result.success) {
      message.value = "Password updated successfully! Redirecting...";
      setTimeout(() => {
        router.push("/contracts");
      }, 2000);
    } else {
      error.value = result.error;
    }
  } catch (err) {
    error.value = "Failed to update password";
  } finally {
    isLoading.value = false;
  }
};

// Check session expiry every minute
onMounted(async () => {
  // Check for email confirmation or password reset
  if (route.meta.isConfirmation) {
    message.value = "Email confirmed successfully! You can now sign in.";
    // Auto-redirect to login after showing message
    setTimeout(() => {
      router.push("/auth");
    }, 3000);
    return;
  }

  if (route.meta.isForgotPassword) {
    isForgotPasswordMode.value = true;
    return;
  }

  if (route.meta.isPasswordReset) {
    // Check if we have a recovery session
    const session = await AuthService.getSession();
    if (!session) {
      error.value = "Auth session missing! Please request a new password reset link.";
      // Redirect to forgot password page
      setTimeout(() => {
        router.push("/forgot-password");
      }, 3000);
    } else {
      isPasswordResetMode.value = true;
    }
    return;
  }

  // Check if user is already authenticated
  const isAuthenticated = await AuthService.isAuthenticated();
  if (isAuthenticated && !route.meta.isPasswordReset && !route.meta.isForgotPassword) {
    router.push("/contracts");
    return;
  }

  const intervalId = setInterval(checkAndHandleSessionExpiry, 60000);
  // Clean up interval on component unmount
  return () => clearInterval(intervalId);
});
</script>

<template>
  <div class="auth-container min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <img 
          src="@/assets/docudeals_logo_v1.png" 
          alt="DealDocs Logo" 
          class="mx-auto h-24 w-auto mb-6"
        />
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          {{ isPasswordResetMode ? 'Reset Your Password' : isForgotPasswordMode ? 'Forgot Password' : isSignUp ? 'Create your account' : 'Sign in to your account' }}
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Real Estate Contract Management Platform
        </p>
      </div>
      
      <Card class="w-full relative">
        <!-- Loading Overlay -->
        <div v-if="isLoading && loadingMessage" class="absolute inset-0 bg-white/95 rounded-lg flex items-center justify-center z-50">
          <div class="text-center px-8 py-12">
            <i class="pi pi-spin pi-spinner text-4xl mb-4" style="color: var(--primary-color)"></i>
            <p class="text-lg font-semibold text-gray-800">{{ loadingMessage }}</p>
          </div>
        </div>

        <template #content>
          <!-- Forgot Password Form -->
          <form v-if="isForgotPasswordMode" class="space-y-6" @submit.prevent="handleResetPassword">
            <!-- Error Message -->
            <Message v-if="error" severity="error" :closable="false">
              {{ error }}
            </Message>

            <!-- Success Message -->
            <Message v-if="message" severity="success" :closable="false">
              {{ message }}
            </Message>

            <div class="text-sm text-gray-600 mb-4">
              Enter your email address and we'll send you a link to reset your password.
            </div>

            <!-- Email -->
            <div class="flex flex-col gap-2">
              <label for="email" class="text-sm font-medium text-gray-700">Email Address</label>
              <InputText
                v-model="formData.email"
                id="email"
                type="email"
                placeholder="Enter your email"
                :disabled="isLoading"
                autofocus
              />
            </div>

            <!-- Submit Button -->
            <Button
              type="submit"
              label="Send Reset Link"
              class="w-full"
              :disabled="isLoading || !formData.email"
            />

            <!-- Back to Login -->
            <div class="text-center">
              <Button
                label="Back to Sign In"
                link
                size="small"
                @click="router.push('/auth')"
              />
            </div>
          </form>

          <!-- Password Reset Form -->
          <form v-else-if="isPasswordResetMode" class="space-y-6" @submit.prevent="handleUpdatePassword">
            <!-- Error Message -->
            <Message v-if="error" severity="error" :closable="false">
              {{ error }}
            </Message>

            <!-- Success Message -->
            <Message v-if="message" severity="success" :closable="false">
              {{ message }}
            </Message>

            <!-- New Password -->
            <div class="flex flex-col gap-2">
              <label for="newPassword" class="text-sm font-medium text-gray-700">New Password</label>
              <Password
                v-model="formData.newPassword"
                id="newPassword"
                placeholder="Enter new password (min 6 characters)"
                :feedback="false"
                toggleMask
                :disabled="isLoading"
              />
            </div>

            <!-- Submit Button -->
            <Button
              type="submit"
              label="Update Password"
              class="w-full"
              :disabled="isLoading || !formData.newPassword || formData.newPassword.length < 6"
            />

            <!-- Back to Login -->
            <div class="text-center">
              <Button
                label="Back to Sign In"
                link
                size="small"
                @click="router.push('/auth')"
              />
            </div>
          </form>

          <!-- Regular Auth Form -->
          <form v-else class="space-y-6" @submit.prevent="handleAuth">

            <!-- Error Message -->
            <Message v-if="error" severity="error" :closable="false">
              {{ error }}
            </Message>

            <!-- Success Message -->
            <Message v-if="message" severity="success" :closable="false">
              {{ message }}
            </Message>
            
            <!-- Full Name (Sign Up only) -->
            <div v-if="isSignUp" class="flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <label for="fullName" class="text-sm font-medium text-gray-700">Full Name</label>
                <TooltipPopover id="signup-fullname">
                  <div class="p-2 max-w-xs">
                    <p class="font-semibold mb-1">Important Notice</p>
                    <p class="text-sm">This name will be used on all contracts you create and cannot be changed after account creation. This ensures contract integrity and prevents unauthorized use of the platform.</p>
                  </div>
                </TooltipPopover>
              </div>
              <InputText
                id="fullName"
                v-model="formData.fullName"
                type="text"
                placeholder="Enter your full legal name"
                :required="isSignUp"
              />
            </div>
            
            <!-- Company (Sign Up only) -->
            <div v-if="isSignUp" class="flex flex-col gap-2">
              <label for="company" class="text-sm font-medium text-gray-700">Company (Optional)</label>
              <InputText
                id="company"
                v-model="formData.company"
                type="text"
                placeholder="Enter your company name"
              />
            </div>
            
            <!-- Email -->
            <div class="flex flex-col gap-2">
              <label for="email" class="text-sm font-medium text-gray-700">Email Address</label>
              <InputText
                id="email"
                v-model="formData.email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <!-- Password -->
            <div class="flex flex-col gap-2">
              <label for="password" class="text-sm font-medium text-gray-700">Password</label>
              <Password
                id="password"
                v-model="formData.password"
                placeholder="Enter your password"
                :toggle-mask="true"
                :feedback="isSignUp"
                required
              />
            </div>
            
            <!-- Confirm Password (Sign Up only) -->
            <div v-if="isSignUp" class="flex flex-col gap-2">
              <label for="confirmPassword" class="text-sm font-medium text-gray-700">Confirm Password</label>
              <Password
                id="confirmPassword"
                v-model="formData.confirmPassword"
                placeholder="Confirm your password"
                :toggle-mask="true"
                :feedback="false"
                required
              />
            </div>
            
            <!-- Submit Button -->
            <Button
              :label="isSignUp ? 'Sign Up' : 'Sign In'"
              :loading="isLoading"
              :disabled="!isFormValid || isLoading"
              type="submit"
              class="w-full"
              size="large"
            />
          </form>
          
          <div class="mt-6 space-y-4">
            <!-- Toggle Sign In/Up -->
            <div class="text-center">
              <Button
                :label="isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'"
                link
                size="small"
                @click="toggleMode"
              />
            </div>
            
            <!-- Password Reset (Sign In only) -->
            <div v-if="!isSignUp" class="text-center">
              <Button
                label="Forgot your password?"
                link
                size="small"
                @click="router.push('/forgot-password')"
              />
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
/* Ensure Password component takes full width */
:deep(.p-password) {
  width: 100%;
}

:deep(.p-password-input) {
  width: 100%;
}
</style>

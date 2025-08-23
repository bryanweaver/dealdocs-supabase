<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { AuthService } from "@/services/auth.js";
import Card from "primevue/card";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Message from "primevue/message";
// import ProgressSpinner from "primevue/progressspinner"; // Not currently used

const router = useRouter();

// Component state
const isLoading = ref(false);
const isSignUp = ref(false);
const formData = ref({
  email: "",
  password: "",
  confirmPassword: "",
  fullName: "",
  company: ""
});
const error = ref("");
const message = ref("");

// Computed
const isFormValid = computed(() => {
  const emailValid = formData.value.email && formData.value.email.includes("@");
  const passwordValid = formData.value.password && formData.value.password.length >= 6;
  const confirmPasswordValid = !isSignUp.value || formData.value.password === formData.value.confirmPassword;
  return emailValid && passwordValid && confirmPasswordValid;
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
  router.push("/");
};

const handleAuth = async () => {
  if (!isFormValid.value) return;
  
  isLoading.value = true;
  error.value = "";
  message.value = "";
  
  try {
    if (isSignUp.value) {
      const result = await AuthService.signUp(
        formData.value.email,
        formData.value.password,
        {
          fullName: formData.value.fullName,
          company: formData.value.company
        }
      );
      
      if (result.success) {
        message.value = "Please check your email to confirm your account.";
        // Switch to sign in mode
        isSignUp.value = false;
        formData.value.password = "";
        formData.value.confirmPassword = "";
      } else {
        error.value = result.error;
      }
    } else {
      const result = await AuthService.signIn(
        formData.value.email,
        formData.value.password
      );
      
      if (result.success) {
        // Store login timestamp
        localStorage.setItem("loginTimestamp", new Date().getTime().toString());
        router.push("/#/contracts");
      } else {
        error.value = result.error;
      }
    }
  } catch (err) {
    error.value = "An unexpected error occurred";
    console.error("Auth error:", err);
  } finally {
    isLoading.value = false;
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

// Check session expiry every minute
onMounted(async () => {
  // Check if user is already authenticated
  const isAuthenticated = await AuthService.isAuthenticated();
  if (isAuthenticated) {
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
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          {{ isSignUp ? 'Create your account' : 'Sign in to your account' }}
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          DealDocs Real Estate Contract Management
        </p>
      </div>
      
      <Card class="w-full">
        <template #content>
          <form class="space-y-6" @submit.prevent="handleAuth">
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
              <label for="fullName" class="text-sm font-medium text-gray-700">Full Name</label>
              <InputText
                id="fullName"
                v-model="formData.fullName"
                type="text"
                placeholder="Enter your full name"
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
                :disabled="isLoading"
                @click="handleResetPassword"
              />
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

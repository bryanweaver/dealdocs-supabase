<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { AuthService } from "@/services/auth.js";

const router = useRouter();
const isAuthenticated = ref(false);

// Check authentication status
const checkAuthStatus = async () => {
  try {
    isAuthenticated.value = await AuthService.isAuthenticated();
  } catch (error) {
    console.error("Error checking auth status:", error);
    isAuthenticated.value = false;
  }
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
  await AuthService.signOut();
  isAuthenticated.value = false;
  router.push("/auth");
};

onMounted(async () => {
  await checkAuthStatus();
  
  // Listen for auth state changes
  AuthService.onAuthStateChange((event, session) => {
    isAuthenticated.value = !!session?.user;
  });
  
  const intervalId = setInterval(checkAndHandleSessionExpiry, 60000);
  return () => clearInterval(intervalId);
});

// const currentYear = computed(() => new Date().getFullYear()); // Not currently used
</script>

<template>
  <div class="app-wrapper">
    <!-- Show main app if authenticated -->
    <router-view v-if="isAuthenticated" />
    
    <!-- Show auth component if not authenticated -->
    <router-view v-else />
  </div>
</template>

<style>
/* Global app styles */
.app-wrapper {
  min-height: 100vh;
  background-color: var(--surface-ground);
}

/* Ensure router-view takes full height */
.app-wrapper > div {
  min-height: 100vh;
}
</style>

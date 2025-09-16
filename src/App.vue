<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { AuthService } from "@/services/auth.js";
import { ContractAPI } from "@/services/api.js";

const router = useRouter();
const store = useStore();
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
  window.location.href = "/#/auth"; // Force reload to auth page
};

// Load contract if contractId exists in localStorage
const loadStoredContract = async () => {
  const contractId = localStorage.getItem("contractId");
  if (contractId && isAuthenticated.value) {
    try {
      console.log("Loading stored contract:", contractId);
      const contract = await ContractAPI.get(contractId);
      if (contract) {
        console.log("Raw contract data from database:", JSON.stringify(contract, null, 2));
        store.dispatch("selectContract", contract);
        console.log("Contract loaded and dispatched to store");
        console.log("Store formData after loading:", JSON.stringify(store.state.formData, null, 2));
      }
    } catch (error) {
      console.error("Error loading stored contract:", error);
      // Clear invalid contractId
      localStorage.removeItem("contractId");
    }
  }
};

onMounted(async () => {
  await checkAuthStatus();
  
  // Load stored contract after authentication check
  if (isAuthenticated.value) {
    await loadStoredContract();
  }
  
  // Listen for auth state changes
  AuthService.onAuthStateChange(async (event, session) => {
    isAuthenticated.value = !!session?.user;
    
    // Load contract when user logs in
    if (event === 'SIGNED_IN' && session?.user) {
      await loadStoredContract();
    }
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

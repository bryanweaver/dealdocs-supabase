<script setup lang="ts">
import { Authenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";
import { signIn, signOut } from "aws-amplify/auth";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

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
  await signOut();
  router.push("/");
};

const services = {
  async handleSignIn(formData) {
    await signIn(formData);
    // Store login timestamp
    localStorage.setItem("loginTimestamp", new Date().getTime().toString());
    router.push("/#/contracts");
  },
};

// Check session expiry every minute
onMounted(() => {
  const intervalId = setInterval(checkAndHandleSessionExpiry, 60000);
  // Clean up interval on component unmount
  return () => clearInterval(intervalId);
});
</script>

<template>
  <Authenticator :services="services">
    <template #default="{ signOut }">
      <button @click="signOut">Sign Out</button>
    </template>
  </Authenticator>
</template>

<script lang="ts">
export default {
  name: "AuthComponent",
  components: {
    Authenticator,
  },
};
</script>

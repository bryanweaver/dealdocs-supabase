<template>
  <Drawer v-model:visible="visible" header="Settings" position="right">
    <!-- User Profile Section -->
    <div class="p-4">
      <h2 class="text-xl font-semibold mb-4">User Profile</h2>
      <p class="text-color-secondary">
        Manage your account settings and preferences
      </p>
    </div>

    <!-- Logout Button -->
    <div class="p-4">
      <Button
        label="Log Out"
        severity="contrast"
        raised
        class="w-full"
        icon="pi pi-sign-out"
        @click="handleLogout"
      ></Button>
    </div>

    <!-- Theme Configuration Section -->
    <div class="p-4">
      <div class="layout-config-menu">
        <!-- Theme Toggle with description -->
        <button type="button" class="w-full text-left" @click="toggleDarkMode">
          <div class="flex items-center gap-3">
            <div class="layout-topbar-action">
              <i
                :class="[
                  'pi',
                  { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme },
                ]"
              ></i>
            </div>
            <div>
              <h3 class="text-base font-medium m-0">
                {{ isDarkTheme ? "Dark" : "Light" }} Mode
              </h3>
              <p class="text-sm text-color-secondary m-0">
                Toggle theme appearance
              </p>
            </div>
          </div>
        </button>

        <!-- Theme Customization with description -->
        <div class="relative mt-3">
          <button
            v-styleclass="{
              selector: '@next',
              enterFromClass: 'hidden',
              enterActiveClass: 'animate-scalein',
              leaveToClass: 'hidden',
              leaveActiveClass: 'animate-fadeout',
              hideOnOutsideClick: true,
            }"
            type="button"
            class="w-full text-left"
          >
            <div class="flex items-center gap-3">
              <div class="layout-topbar-action layout-topbar-action-highlight">
                <i class="pi pi-palette"></i>
              </div>
              <div>
                <h3 class="text-base font-medium m-0">Customize Theme</h3>
                <p class="text-sm text-color-secondary m-0">
                  Adjust colors and styling
                </p>
              </div>
            </div>
          </button>
          <AppConfigurator />
        </div>
      </div>
    </div>

    <div class="border-t-1 border-surface-border mt-3"></div>
  </Drawer>
</template>

<script setup>
import { computed } from "vue";
import Drawer from "primevue/drawer";
import { AuthService } from "@/services/auth.js";
import { useRouter } from "vue-router";
import { useLayout } from "./composables/layout";
import AppConfigurator from "./AppConfigurator.vue";

const router = useRouter();
const { toggleDarkMode, isDarkTheme } = useLayout();

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const visible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const handleLogout = async () => {
  router.push("/contracts");
  await AuthService.signOut();
};
</script>

<style scoped>
.layout-topbar-action {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: var(--text-color-secondary);
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  color: var(--text-color);
  transition: background-color var(--element-transition-duration);
  cursor: pointer;
}

.config-panel {
  z-index: 1000;
}

.layout-topbar-action-highlight {
  background-color: var(--primary-color);
  color: var(--primary-contrast-color);
}

.text-color-secondary {
  color: var(--text-color-secondary);
}
</style>

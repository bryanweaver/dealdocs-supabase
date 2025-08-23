<script setup>
import { useLayout } from "@/layout/composables/layout";
// import AppConfigurator from "./AppConfigurator.vue";
import AppRightDrawer from "./AppRightDrawer.vue";
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import CustomStepper from "@/components/CustomStepper.vue";
import { onUnmounted } from "vue";

const currentStep = ref("1");
const store = useStore();
const selectedContractId = computed(() => store.state.contractId);
const screenWidth = ref(window.innerWidth);

// Add window resize listener
const handleResize = () => {
  screenWidth.value = window.innerWidth;
};

// Set up the listener when component mounts
onMounted(() => {
  window.addEventListener("resize", handleResize);
});

// Clean up the listener when component unmounts
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

console.log("Selected Contract ID:", selectedContractId.value);

// Update steps computed property to use screenWidth ref instead of direct window.innerWidth
const steps = computed(() => [
  {
    label: screenWidth.value <= 768 ? "Gather" : "Gather Data",
    route: {
      name: "ContractDashboard",
      params: { id: selectedContractId.value },
    },
  },
  {
    label: screenWidth.value <= 768 ? "Upload" : "Upload Docs",
    route: {
      name: "ContractDocuments",
      params: { id: selectedContractId.value },
    },
  },
  {
    label: screenWidth.value <= 768 ? "Sign" : "Sign Contract",
    route: {
      name: "GenerateContract",
      params: { id: selectedContractId.value },
    },
  },
  {
    label: screenWidth.value <= 768 ? "Email" : "Email Contract",
    route: {
      name: "PrepareContractPackage",
      params: { id: selectedContractId.value },
    },
  },
]);

const { onMenuToggle } = useLayout();
// Reactive state for the drawer's visibility
const drawerVisible = ref(false);

// Function to toggle the drawer
function toggleDrawer() {
  drawerVisible.value = !drawerVisible.value;
}
</script>

<template>
  <div class="layout-topbar">
    <div class="layout-topbar-logo-container">
      <button
        v-if="selectedContractId"
        class="layout-menu-button layout-topbar-action"
        @click="onMenuToggle"
      >
        <i class="pi pi-bars"></i>
      </button>
      <router-link to="/contracts" class="layout-topbar-logo">
        <img
          src="@/assets/docudeals_logo_v1.png"
          alt="DocuDeals Logo"
          class="hidden lg:block h-8"
        />
      </router-link>
    </div>

    <div v-if="selectedContractId" class="stepper-container">
      <CustomStepper
        :current-step="currentStep"
        :steps="steps"
        :allow-navigation="true"
      />
    </div>

    <div class="layout-topbar-actions">
      <button
        v-styleclass="{
          selector: '@next',
          enterFromClass: 'hidden',
          enterActiveClass: 'animate-scalein',
          leaveToClass: 'hidden',
          leaveActiveClass: 'animate-fadeout',
          hideOnOutsideClick: true,
        }"
        class="layout-topbar-action"
        @click="toggleDrawer"
      >
        <i class="pi pi-ellipsis-v"></i>
      </button>
    </div>

    <AppRightDrawer v-model="drawerVisible" />
  </div>
</template>

<style scoped>
.stepper-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1rem;
  flex: 1;
  margin-left: 1rem;
}

.layout-topbar {
  min-height: 5rem;
  /* padding: 0.5rem 2rem; */
}

.stepper-container ::v-deep(.p-stepper-list) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.stepper-container ::v-deep(.p-stepper-item) {
  flex: 1;
  position: relative;
}

.stepper-container ::v-deep(.p-stepper-item:not(:last-child))::after {
  content: "";
  position: absolute;
  top: 50%;
  left: calc(100% + 0.5rem);
  width: calc(100% - 1rem);
  height: 2px;
  background-color: #ccc;
  transform: translateY(-50%);
}
</style>

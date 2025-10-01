<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const route = useRoute();
const store = useStore();

const props = defineProps({
  steps: {
    type: Array,
    required: true,
  },
  allowNavigation: {
    type: Boolean,
    default: false,
  },
});
console.log("CustomStepper props:", props); // Use props to avoid lint error

const isStep1Complete = computed(() => {
  return store.getters.isContractComplete;
});

const isStep2Complete = computed(() => {
  return store.getters.allDocsAreUploaded;
});

const isStep3Complete = computed(() => {
  return store.getters.allSignersCompleted;
});

const getCurrentStep = () => {
  console.log("Route:", route);
  const routeName = route.name;

  console.log("Route Name:", routeName);
  if (["ContractDashboard", "FormPage", "QuestionFlow"].includes(routeName)) {
    return 1;
  } else if (routeName === "ContractDocuments") {
    return 2;
  } else if (routeName === "GenerateContract") {
    return 3;
  } else if (routeName === "PrepareContractPackage") {
    return 4;
  }
  return 1; // Default to first step
};

const activeStep = computed(() => getCurrentStep());
console.log("Active Step:", activeStep.value);

const isStepActive = (index) => activeStep.value >= index + 1;
const isLineActive = (index) => activeStep.value > index + 1;
</script>

<template>
  <div class="custom-stepper">
    <div class="stepper-list">
      <component
        :is="allowNavigation ? 'router-link' : 'div'"
        v-for="(step, index) in steps"
        :key="index"
        :to="allowNavigation ? step.route : undefined"
        class="stepper-item"
        :class="{ active: isStepActive(index) }"
      >
        <div class="step-number">
          <template v-if="index === 0 && isStep1Complete">
            <i class="pi pi-check" />
          </template>
          <template v-else-if="index === 1 && isStep2Complete">
            <i class="pi pi-check" />
          </template>
          <template v-else-if="index === 2 && isStep3Complete">
            <i class="pi pi-check" />
          </template>
          <template v-else>
            {{ index + 1 }}
          </template>
        </div>
        <div class="step-label">
          {{ step.label }}
        </div>
        <div
          v-if="index < steps.length - 1"
          class="step-line"
          :class="{ active: isLineActive(index) }"
        />
      </component>
    </div>
  </div>
</template>

<style scoped>
.custom-stepper {
  width: 100%;
}

.stepper-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  gap: 3rem;
}

.stepper-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
  text-decoration: none;
  color: var(--text-color);
}

.step-line {
  position: absolute;
  top: 1rem;
  left: calc(50% + 1rem);
  width: calc(100% + 3rem); /* Adjusted for gap */
  height: 2px;
  background-color: var(--surface-border);
  transition: background-color 0.3s ease;
}

.step-line.active {
  background-color: var(--primary-color);
}

.step-number {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: var(--surface-border);
  display: flex;
  align-items: center;
  justify-content: center;
  /* margin-bottom: 0.5rem; */
  font-weight: bold;
  transition: background-color 0.3s ease;
  z-index: 1;
  font-size: 0.875rem;
}

.step-number .pi {
  font-size: 0.875rem;
}

.stepper-item.active .step-number {
  background-color: var(--primary-color);
  color: var(--primary-color-text);
}

.step-label {
  font-size: 0.875rem;
  text-align: center;
  white-space: nowrap;
  margin-top: 0.3rem;
}
</style>

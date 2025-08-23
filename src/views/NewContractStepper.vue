<template>
  <div class="py-4 sm:py-8 px-0 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto min-h-[600px]">
      <Card class="mx-0 sm:mx-4">
        <template #content>
          <!-- Stepper Navigation -->
          <div class="mb-8">
            <!-- Desktop Stepper -->
            <div class="hidden sm:block">
              <div class="w-full flex items-center">
                <template v-for="(step, index) in steps" :key="index">
                  <!-- Step Circle -->
                  <div
                    class="w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center"
                    :class="[
                      currentStep > index
                        ? 'bg-primary text-white'
                        : currentStep === index
                          ? 'bg-primary-light text-primary border-2 border-primary'
                          : 'bg-gray-200 text-gray-500',
                    ]"
                  >
                    {{ index + 1 }}
                  </div>

                  <!-- Connector Line -->
                  <div
                    v-if="index < steps.length - 1"
                    class="flex-1 h-1 mx-2"
                    :class="[
                      currentStep > index ? 'bg-primary' : 'bg-gray-200',
                    ]"
                  ></div>
                </template>
              </div>

              <!-- Step Labels -->
              <div class="flex justify-between px-2 mt-2">
                <template
                  v-for="(step, index) in steps"
                  :key="`label-${index}`"
                >
                  <span
                    class="text-xs sm:text-sm font-medium"
                    :class="[
                      currentStep >= index ? 'text-primary' : 'text-gray-500',
                    ]"
                  >
                    {{ step.label }}
                  </span>
                </template>
              </div>
            </div>

            <!-- Mobile Stepper -->
            <div class="sm:hidden">
              <div class="flex items-center justify-center">
                <span class="text-sm font-medium text-primary">
                  Step {{ currentStep + 1 }} of {{ steps.length }}:
                  {{ steps[currentStep].label }}
                </span>
              </div>
              <!-- Mobile Progress Bar -->
              <div class="mt-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-2 bg-primary rounded-full transition-all duration-300"
                  :style="{
                    width: `${((currentStep + 1) / steps.length) * 100}%`,
                  }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Step Content -->
          <div class="min-h-[400px] sm:min-h-[600px]">
            <component
              :is="currentComponent"
              :verified-address="verifiedAddress"
              :property-data="propertyData"
              @next-step="handleNextStep"
              @prev-step="handlePrevStep"
            ></component>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BeginContract from "@/views/BeginContract.vue";
import AddressValidation from "@/views/AddressValidation.vue";
import PropertyData from "@/views/PropertyData.vue";
import Card from "primevue/card";
import { useStore } from "vuex";

export default defineComponent({
  name: "NewContractStepper",
  components: {
    BeginContract,
    AddressValidation,
    PropertyData,
    Card,
  },
  setup() {
    const store = useStore();
    return { store };
  },
  data() {
    return {
      currentStep: 0,
      steps: [
        { label: "Begin Contract", component: BeginContract },
        { label: "Verify Address", component: AddressValidation },
        { label: "Property Details", component: PropertyData },
      ],
    };
  },
  computed: {
    currentComponent() {
      return this.steps[this.currentStep].component;
    },
    verifiedAddress() {
      return this.$store.state.verifiedAddress;
    },
    propertyData() {
      return this.$store.state.propertyData;
    },
  },
  methods: {
    handleNextStep() {
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
      }
    },
    handlePrevStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
      }
    },
  },
});
</script>

<style scoped>
@media (max-width: 640px) {
  :deep(.p-card) {
    border-radius: 0;
    margin: 0;
    box-shadow: none;
  }

  :deep(.p-card .p-card-content) {
    padding: 0.75rem;
  }
}
</style>

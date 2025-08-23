<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";

// PrimeVue components
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Listbox from "primevue/listbox";
import Button from "primevue/button";
import InputMask from "primevue/inputmask";
import DatePicker from "primevue/datepicker";
import SelectButton from "primevue/selectbutton";
import InputGroup from "primevue/inputgroup";

// Import validateField from utils
import { validateField } from "@/utils/validationUtils";
import { useRouter } from "vue-router";
import TooltipPopover from "./TooltipPopover.vue";

// Define question types - removed for ESLint compatibility

const router = useRouter();
const store = useStore();

const props = defineProps({
  questionConfig: {
    type: Array,
    required: true,
  },
  currentIndex: {
    type: Number,
    required: true,
  },
  hasPreviousQuestion: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["previous", "next"]);

const currentQuestion = computed(() => {
  return props.questionConfig[props.currentIndex];
});

const isMarked = computed(() => {
  return (
    store.state.markedQuestions[currentQuestion.value.sectionId] &&
    store.state.markedQuestions[currentQuestion.value.sectionId].includes(
      currentQuestion.value.fieldId,
    )
  );
});

const inputValue = ref(null);
const validationError = ref([]);
const hasValidationError = computed(() => validationError.value.length > 0);

onMounted(() => {
  inputValue.value = getInputValue(currentQuestion.value);
});

const isFieldRequired = (question) => {
  return (
    store.state.requiredFields[question.sectionId]?.includes(
      question.fieldId,
    ) || false
  );
};

const navigateToFormPage = (sectionId) => {
  router.push({ name: "FormPage", params: { sectionId } });
};

const getInputValue = (question) => {
  return question.sectionId
    ? store.state.formData[question.sectionId][question.fieldId] || ""
    : store.state.formData[question.fieldId] || "";
};

const goToPrevious = () => {
  emit("previous");
};

const goToNext = () => {
  if (!isMarked.value) {
    // Determine if the field is required
    const isRequired = isFieldRequired(currentQuestion.value);

    // Validate the field only if not marked as "I don't know"
    validationError.value = validateField(
      currentQuestion.value,
      inputValue.value,
      isRequired,
    );

    if (validationError.value.length > 0) {
      // Prevent advancing to the next question
      console.log("Validation errors:", validationError.value);
      return;
    }
  }

  // Update the store's formData
  store.commit("updateFormData", {
    sectionId: currentQuestion.value.sectionId,
    fieldId: currentQuestion.value.fieldId,
    value: inputValue.value,
  });

  emit("next");
};
</script>

<template>
  <div class="question-input-container">
    <div>
      <!-- Question Title with Required Asterisk (if needed) -->
      <div class="question-container">
        <div
          class="question-title"
          :class="{ 'marked-question': currentQuestion.marked }"
        >
          <span v-if="currentQuestion.isRequired" class="required-asterisk"
            >*</span
          >
          <span>{{ currentQuestion.question }}</span>
        </div>
      </div>

      <!-- Introduction Only -->
      <div v-if="currentQuestion.intro" class="intro-container">
        <div class="intro-content">
          <p v-html="currentQuestion.intro"></p>
        </div>
      </div>

      <!-- Input Components based on type -->
      <div v-else class="input-container">
        <!-- Input Text -->
        <div v-if="currentQuestion.type === 'text'" class="input-wrapper">
          <InputText
            v-model="inputValue"
            class="w-full"
            :class="{ 'marked-input': currentQuestion.marked }"
            :placeholder="currentQuestion.placeholder || ''"
          />
          <small v-if="hasValidationError" class="p-error">{{
            validationError
          }}</small>
          <small v-if="currentQuestion.description" class="text-gray-600 mt-2">
            {{ currentQuestion.description }}
          </small>
        </div>

        <!-- Input Text with Tooltip -->
        <div
          v-else-if="currentQuestion.type === 'text-tooltip'"
          class="input-wrapper"
        >
          <div class="flex items-center mb-1">
            <InputText
              v-model="inputValue"
              class="w-full"
              :class="{ 'marked-input': currentQuestion.marked }"
              :placeholder="currentQuestion.placeholder || ''"
            />
            <TooltipPopover :tooltip-content="currentQuestion.tooltip" />
          </div>
          <small v-if="hasValidationError" class="p-error">{{
            validationError
          }}</small>
          <small v-if="currentQuestion.description" class="text-gray-600 mt-2">
            {{ currentQuestion.description }}
          </small>
        </div>

        <!-- Input Number -->
        <div
          v-else-if="currentQuestion.type === 'number'"
          class="input-wrapper"
        >
          <InputNumber
            v-model="inputValue"
            class="w-full"
            :class="{ 'marked-input': currentQuestion.marked }"
            :placeholder="currentQuestion.placeholder || ''"
            :min-fraction-digits="0"
            :max-fraction-digits="2"
          />
          <small v-if="hasValidationError" class="p-error">{{
            validationError
          }}</small>
          <small v-if="currentQuestion.description" class="text-gray-600 mt-2">
            {{ currentQuestion.description }}
          </small>
        </div>

        <!-- Date Picker -->
        <div v-else-if="currentQuestion.type === 'date'" class="input-wrapper">
          <DatePicker
            v-model="inputValue"
            class="w-full"
            :class="{ 'marked-input': currentQuestion.marked }"
            date-format="mm/dd/yy"
            :show-icon="true"
          />
          <small v-if="hasValidationError" class="p-error">{{
            validationError
          }}</small>
          <small v-if="currentQuestion.description" class="text-gray-600 mt-2">
            {{ currentQuestion.description }}
          </small>
        </div>

        <!-- Select Button (Radio Button Group) -->
        <div
          v-else-if="currentQuestion.type === 'select'"
          class="select-wrapper"
        >
          <SelectButton
            v-model="inputValue"
            :options="currentQuestion.options"
            option-label="label"
            :class="{ 'marked-button': currentQuestion.marked }"
            class="w-full flex flex-wrap"
          />
          <small v-if="hasValidationError" class="p-error">{{
            validationError
          }}</small>
          <small v-if="currentQuestion.description" class="text-gray-600 mt-2">
            {{ currentQuestion.description }}
          </small>
        </div>

        <!-- Input Listbox -->
        <div
          v-else-if="currentQuestion.type === 'listbox'"
          class="listbox-wrapper"
        >
          <Listbox
            v-model="inputValue"
            :options="currentQuestion.options"
            option-label="label"
            class="w-full"
            :class="{ 'marked-input': currentQuestion.marked }"
          />
          <small v-if="hasValidationError" class="p-error">{{
            validationError
          }}</small>
          <small v-if="currentQuestion.description" class="text-gray-600 mt-2">
            {{ currentQuestion.description }}
          </small>
        </div>

        <!-- Input Mask (Formatted Input) -->
        <div v-else-if="currentQuestion.type === 'mask'" class="input-wrapper">
          <InputMask
            v-model="inputValue"
            :mask="currentQuestion.mask"
            class="w-full"
            :class="{ 'marked-input': currentQuestion.marked }"
            :placeholder="currentQuestion.placeholder || ''"
          />
          <small v-if="hasValidationError" class="p-error">{{
            validationError
          }}</small>
          <small v-if="currentQuestion.description" class="text-gray-600 mt-2">
            {{ currentQuestion.description }}
          </small>
        </div>

        <!-- Monetary Input (with $ prefix) -->
        <div v-else-if="currentQuestion.type === 'money'" class="input-wrapper">
          <InputGroup>
            <span class="p-inputgroup-addon">$</span>
            <InputNumber
              v-model="inputValue"
              class="w-full"
              :class="{ 'marked-input': currentQuestion.marked }"
              :placeholder="currentQuestion.placeholder || ''"
              :min-fraction-digits="2"
              :max-fraction-digits="2"
            />
          </InputGroup>
          <small v-if="hasValidationError" class="p-error">{{
            validationError
          }}</small>
          <small v-if="currentQuestion.description" class="text-gray-600 mt-2">
            {{ currentQuestion.description }}
          </small>
        </div>
      </div>
    </div>

    <!-- Footer Buttons -->
    <div class="footer-buttons mt-4 flex items-center">
      <!-- Previous Button on the Left -->
      <Button
        label="Previous"
        :disabled="!hasPreviousQuestion"
        icon="pi pi-arrow-left"
        @click="goToPrevious"
      />

      <Button
        label="Next"
        icon="pi pi-arrow-right"
        icon-pos="right"
        class="mx-auto"
        @click="goToNext"
      />
    </div>
    <div class="flex justify-center mt-4">
      <Button
        label="Go to Form Page"
        class="p-button-link"
        @click="navigateToFormPage(currentQuestion.sectionId)"
      />
    </div>
  </div>
</template>

<style scoped>
.question-input-container {
  padding: 1.5rem;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  color: var(--text-color);
  transition: color 0.3s ease;
}

.question-container {
  margin-bottom: 2rem;
  text-align: center;
}

.question-title {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--text-color);
}

.intro-container {
  margin-bottom: 2rem;
}

.intro-content {
  font-size: 1.1rem;
  line-height: 1.5;
  color: var(--text-color);
}

.input-container {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  width: 100%;
}

.input-wrapper,
.select-wrapper,
.listbox-wrapper {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.required-asterisk {
  color: var(--red-500);
  margin-right: 2px;
}

.marked-question {
  opacity: 0.5;
}

.p-error {
  color: var(--red-500);
  font-size: 0.875em;
  margin-top: 0.25rem;
}

.marked-input {
  background: var(--yellow-50) !important;
}

.marked-button {
  color: var(--text-color) !important;
  background-color: var(--yellow-50) !important;
}

@media (max-width: 768px) {
  .question-input-container {
    padding: 1rem;
  }

  .question-title {
    font-size: 1.25rem;
  }
}
</style>

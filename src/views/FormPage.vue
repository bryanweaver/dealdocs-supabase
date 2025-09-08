<template>
  <div class="form-page">
    <!-- Progress Bar at the top -->
    <div class="sticky-progress-bar">
      <div class="progress-bar-container">
        <SectionProgressBar :section-id="sectionId" :section-title="section" />
      </div>
    </div>

    <!-- Form Panel -->
    <Panel class="form-content">
      <form>
        <!-- Questions -->
        <div
          v-for="question in visibleQuestions"
          :key="question.fieldId"
          class="question-item"
        >
          <!-- Question display -->
          <div v-if="!question.intro">
            <div class="question-label">
              <div class="flex justify-between">
                <h2 class="text-center font-bold text-2xl mb-4">
                  {{ question.question }}
                  <span
                    v-if="isFieldRequired(question)"
                    class="required-asterisk"
                    >*</span
                  >
                </h2>

                <TooltipPopover :id="question.fieldId">
                  {{ question.description }}
                </TooltipPopover>
              </div>
            </div>

            <!-- Input types -->
            <div
              :class="{
                'marked-question': isMarked(
                  question.sectionId,
                  question.fieldId,
                ),
              }"
            >
              <!-- Text Input -->
              <div v-if="question.type === 'text'" class="flex flex-col">
                <InputGroup>
                  <InputText
                    v-model="inputValues[question.fieldId]"
                    :disabled="isContractStarted && sectionId === 'property'"
                    :class="{
                      'p-invalid': validationErrors[question.fieldId]?.length,
                      'marked-input': isMarked(
                        question.sectionId,
                        question.fieldId,
                      ),
                    }"
                    class="w-full"
                    @blur="setInputValue(question, $event.target.value)"
                  />
                  <div class="flex justify-center items-center ml-4">
                    <PrimeButton
                      label="I don't know"
                      :icon="
                        isMarked(question.sectionId, question.fieldId)
                          ? 'pi pi-check-circle'
                          : 'pi pi-circle'
                      "
                      class="p-button-text"
                      :class="{
                        'marked-button': isMarked(
                          question.sectionId,
                          question.fieldId,
                        ),
                      }"
                      @click="
                        toggleMarked(question.sectionId, question.fieldId)
                      "
                    />
                  </div>
                </InputGroup>
                <small
                  v-if="validationErrors[question.fieldId]?.length"
                  class="p-error"
                >
                  {{ validationErrors[question.fieldId][0] }}
                </small>
              </div>

              <!-- Number Input -->
              <div v-else-if="question.type === 'number'" class="flex flex-col">
                <InputGroup>
                  <InputNumber
                    v-model="inputValues[question.fieldId]"
                    :disabled="isContractStarted && sectionId === 'property'"
                    :class="{
                      'p-invalid': validationErrors[question.fieldId]?.length,
                      'marked-input': isMarked(
                        question.sectionId,
                        question.fieldId,
                      ),
                    }"
                    class="w-full"
                    :min="0"
                    :min-fraction-digits="0"
                    :max-fraction-digits="2"
                    @input="setInputValue(question, $event.value)"
                  />
                  <div class="flex justify-center items-center ml-4">
                    <PrimeButton
                      label="I don't know"
                      :icon="
                        isMarked(question.sectionId, question.fieldId)
                          ? 'pi pi-check-circle'
                          : 'pi pi-circle'
                      "
                      class="p-button-text"
                      :class="{
                        'marked-button': isMarked(
                          question.sectionId,
                          question.fieldId,
                        ),
                      }"
                      @click="
                        toggleMarked(question.sectionId, question.fieldId)
                      "
                    />
                  </div>
                </InputGroup>
                <small
                  v-if="validationErrors[question.fieldId]?.length"
                  class="p-error"
                >
                  {{ validationErrors[question.fieldId][0] }}
                </small>
              </div>

              <!-- Currency Input -->
              <div
                v-else-if="question.type === 'currency'"
                class="flex flex-col"
              >
                <InputGroup>
                  <InputNumber
                    v-model="inputValues[question.fieldId]"
                    :disabled="isContractStarted && sectionId === 'property'"
                    :class="{
                      'p-invalid': validationErrors[question.fieldId]?.length,
                      'marked-input': isMarked(
                        question.sectionId,
                        question.fieldId,
                      ),
                    }"
                    class="w-full"
                    mode="currency"
                    currency="USD"
                    locale="en-US"
                    @input="setInputValue(question, $event.value)"
                  />
                  <div class="flex justify-center items-center ml-4">
                    <PrimeButton
                      label="I don't know"
                      :icon="
                        isMarked(question.sectionId, question.fieldId)
                          ? 'pi pi-check-circle'
                          : 'pi pi-circle'
                      "
                      class="p-button-text"
                      :class="{
                        'marked-button': isMarked(
                          question.sectionId,
                          question.fieldId,
                        ),
                      }"
                      @click="
                        toggleMarked(question.sectionId, question.fieldId)
                      "
                    />
                  </div>
                </InputGroup>
                <small
                  v-if="validationErrors[question.fieldId]?.length"
                  class="p-error"
                >
                  {{ validationErrors[question.fieldId][0] }}
                </small>
              </div>

              <!-- Date Input -->
              <div v-else-if="question.type === 'date'" class="flex flex-col">
                <InputGroup>
                  <DatePicker
                    v-model="inputValues[question.fieldId]"
                    :disabled="isContractStarted && sectionId === 'property'"
                    :class="{
                      'p-invalid': validationErrors[question.fieldId]?.length,
                      'marked-input': isMarked(
                        question.sectionId,
                        question.fieldId,
                      ),
                    }"
                    date-format="DD, mm/dd/yy"
                    show-icon
                    class="w-full"
                    @update:model-value="setInputValue(question, $event)"
                  />
                  <div class="flex justify-center items-center ml-4">
                    <PrimeButton
                      label="I don't know"
                      :icon="
                        isMarked(question.sectionId, question.fieldId)
                          ? 'pi pi-check-circle'
                          : 'pi pi-circle'
                      "
                      class="p-button-text"
                      :class="{
                        'marked-button': isMarked(
                          question.sectionId,
                          question.fieldId,
                        ),
                      }"
                      @click="
                        toggleMarked(question.sectionId, question.fieldId)
                      "
                    />
                  </div>
                </InputGroup>
                <small
                  v-if="validationErrors[question.fieldId]?.length"
                  class="p-error"
                >
                  {{ validationErrors[question.fieldId][0] }}
                </small>
              </div>

              <!-- Select Input -->
              <div v-else-if="question.type === 'select'" class="flex flex-col">
                <InputGroup>
                  <Listbox
                    v-model="inputValues[question.fieldId]"
                    :disabled="isContractStarted && sectionId === 'property'"
                    :class="{
                      'p-invalid': validationErrors[question.fieldId]?.length,
                      'marked-input': isMarked(
                        question.sectionId,
                        question.fieldId,
                      ),
                    }"
                    :options="question.options"
                    option-label="label"
                    option-value="value"
                    placeholder="Select an option"
                    class="w-full"
                    @change="setInputValue(question, $event.value)"
                  />
                  <div class="flex justify-center items-center ml-4">
                    <PrimeButton
                      label="I don't know"
                      :icon="
                        isMarked(question.sectionId, question.fieldId)
                          ? 'pi pi-check-circle'
                          : 'pi pi-circle'
                      "
                      class="p-button-text"
                      :class="{
                        'marked-button': isMarked(
                          question.sectionId,
                          question.fieldId,
                        ),
                      }"
                      @click="
                        toggleMarked(question.sectionId, question.fieldId)
                      "
                    />
                  </div>
                </InputGroup>
                <small
                  v-if="validationErrors[question.fieldId]?.length"
                  class="p-error"
                >
                  {{ validationErrors[question.fieldId][0] }}
                </small>
              </div>

              <!-- Boolean Input -->
              <div
                v-else-if="question.type === 'boolean'"
                class="flex flex-col"
              >
                <InputGroup>
                  <SelectButton
                    v-model="inputValues[question.fieldId]"
                    :disabled="isContractStarted && sectionId === 'property'"
                    :options="[
                      { label: 'Yes', value: true },
                      { label: 'No', value: false },
                    ]"
                    option-label="label"
                    option-value="value"
                    :class="{
                      'p-invalid': validationErrors[question.fieldId]?.length,
                      'marked-input': isMarked(
                        question.sectionId,
                        question.fieldId,
                      ),
                    }"
                    class="mr-2"
                    @update:model-value="setInputValue(question, $event)"
                  />
                  <div class="flex justify-center items-center ml-4">
                    <PrimeButton
                      label="I don't know"
                      :icon="
                        isMarked(question.sectionId, question.fieldId)
                          ? 'pi pi-check-circle'
                          : 'pi pi-circle'
                      "
                      class="p-button-text"
                      :class="{
                        'marked-button': isMarked(
                          question.sectionId,
                          question.fieldId,
                        ),
                      }"
                      @click="
                        toggleMarked(question.sectionId, question.fieldId)
                      "
                    />
                  </div>
                </InputGroup>
                <small
                  v-if="validationErrors[question.fieldId]?.length"
                  class="p-error"
                >
                  {{ validationErrors[question.fieldId][0] }}
                </small>
              </div>

              <!-- Phone Input -->
              <div v-else-if="question.type === 'phone'" class="flex flex-col">
                <InputGroup>
                  <InputMask
                    v-model="inputValues[question.fieldId]"
                    :disabled="isContractStarted && sectionId === 'property'"
                    :class="{
                      'p-invalid': validationErrors[question.fieldId]?.length,
                      'marked-input': isMarked(
                        question.sectionId,
                        question.fieldId,
                      ),
                    }"
                    mask="(999) 999-9999"
                    class="w-full"
                    @blur="setInputValue(question, $event.target.value)"
                  />
                  <div class="flex justify-center items-center ml-4">
                    <PrimeButton
                      label="I don't know"
                      :icon="
                        isMarked(question.sectionId, question.fieldId)
                          ? 'pi pi-check-circle'
                          : 'pi pi-circle'
                      "
                      class="p-button-text"
                      :class="{
                        'marked-button': isMarked(
                          question.sectionId,
                          question.fieldId,
                        ),
                      }"
                      @click="
                        toggleMarked(question.sectionId, question.fieldId)
                      "
                    />
                  </div>
                </InputGroup>
                <small
                  v-if="validationErrors[question.fieldId]?.length"
                  class="p-error"
                >
                  {{ validationErrors[question.fieldId][0] }}
                </small>
              </div>

              <!-- Add more input types as needed -->

              <!-- Referral Link Button -->
              <div
                v-else-if="question.type === 'referralLink'"
                class="flex flex-col items-center mt-4"
              >
                <ReferralButton
                  :label="question.label || 'Visit Financing Referral'"
                  :url="question.referralUrl"
                  :description="question.description"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-between mt-4">
          <Button
            v-if="sectionIndex > 0"
            label="Previous Section"
            icon="pi pi-arrow-left"
            icon-pos="left"
            class="p-button-secondary"
            @click.prevent="navigateToPreviousSection"
          />
          <Button
            label="Next Section"
            icon="pi pi-arrow-right"
            icon-pos="right"
            @click.prevent="submitFormAndLoadNextSection"
          />
        </div>
      </form>

      <div class="flex justify-center">
        <Button
          label="Go to Question Flow"
          class="p-button-link"
          @click="navigateToQuestionFlow(sectionId)"
        />
      </div>
    </Panel>
  </div>
</template>

<script>
import { getQuestionsForSection } from "../config/TX";
import { ContractAPI } from "@/services/api.js";
import { createContractPayload } from "@/utils/fieldMapUtils";

import SectionProgressBar from "@/components/SectionProgressBar.vue";

// PrimeVue components
import Panel from "primevue/panel";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Listbox from "primevue/listbox";
import Button from "primevue/button";
import InputMask from "primevue/inputmask";
import DatePicker from "primevue/datepicker";
import { formatDate } from "@/utils/dateUtils";
import { validateField } from "@/utils/validationUtils";
import { isQuestionRequired } from "@/utils/questionUtils";
import TooltipPopover from "@/components/TooltipPopover.vue";
import ReferralButton from "@/components/ReferralButton.vue";

export default {
  name: "FormPage",
  components: {
    Panel,
    InputText,
    InputNumber,
    DatePicker,
    Listbox,
    PrimeButton: Button,
    InputMask,
    SectionProgressBar,
    TooltipPopover,
    ReferralButton,
  },
  data() {
    return {
      sectionId: this.$route.params.sectionId,
      sectionIndex: null,
      formData: {},
      inputValues: {},
      questions: [],
      section: "",
      validationErrors: {},
    };
  },
  computed: {
    isContractStarted() {
      return !!this.$store.state.contractId; // Assuming contractId is set when a contract is started
    },
    formDataKeys() {
      return Object.keys(this.$store.state.formData);
    },
    invisibleQuestions() {
      console.log("checking invisible questions...");
      // Filter the questions based on their dependencies
      return this.questions.filter((question) => {
        // If the question has no dependencies, exclude it
        if (!question.dependsOnAll && !question.dependsOnAny) return false;

        // Check dependencies
        if (question.dependsOnAll) {
          // Check if any AND dependency is not satisfied
          return question.dependsOnAll.some((dep) => {
            // If the dependency is from another section
            if (dep.sectionId) {
              return (
                this.$store.state.formData[dep.sectionId]?.[dep.fieldId] !==
                dep.value
              );
            }
            // If the dependency is from the current section
            return this.inputValues[dep.fieldId] !== dep.value;
          });
        }

        if (question.dependsOnAny) {
          // Check if all OR dependencies are not satisfied
          return question.dependsOnAny.every((dep) => {
            // If the dependency is from another section
            if (dep.sectionId) {
              return (
                this.$store.state.formData[dep.sectionId]?.[dep.fieldId] !==
                dep.value
              );
            }
            // If the dependency is from the current section
            return this.inputValues[dep.fieldId] !== dep.value;
          });
        }

        return false;
      });
    },
    visibleQuestions() {
      console.log("checking visible questions...");
      // Filter the questions based on their dependencies
      return this.questions.filter((question) => {
        // If the question has no dependencies, include it
        if (!question.dependsOnAll && !question.dependsOnAny) return true;

        // Check dependencies
        if (question.dependsOnAll) {
          // Check if all AND dependencies are satisfied
          const allDepsMatch = question.dependsOnAll.every((dep) => {
            // If the dependency is from another section
            if (dep.sectionId) {
              const value =
                this.$store.state.formData[dep.sectionId]?.[dep.fieldId];
              return value === dep.value;
            }
            // If the dependency is from the current section
            const value =
              this.$store.state.formData[this.sectionId]?.[dep.fieldId];
            return value === dep.value;
          });
          if (!allDepsMatch) return false;
        }

        if (question.dependsOnAny) {
          // Check if any OR dependency is satisfied
          const anyDepMatches = question.dependsOnAny.some((dep) => {
            // If the dependency is from another section
            if (dep.sectionId) {
              const value =
                this.$store.state.formData[dep.sectionId]?.[dep.fieldId];
              return value === dep.value;
            }
            // If the dependency is from the current section
            const value =
              this.$store.state.formData[this.sectionId]?.[dep.fieldId];
            return value === dep.value;
          });
          if (!anyDepMatches) return false;
        }

        return true;
      });
    },
  },
  watch: {
    "$route.params.sectionId"(newVal) {
      this.sectionId = newVal;
      this.sectionIndex = this.formDataKeys.indexOf(this.sectionId);
      this.updateFormData();
    },
    "$store.state.formData": {
      handler() {
        this.updateFormData();
      },
      deep: true,
    },
  },
  created() {
    this.sectionIndex = this.formDataKeys.indexOf(this.sectionId);
    this.updateFormData();
    window.scrollTo(0, 0);
  },
  methods: {
    updateFormData() {
      // Clear formData
      Object.keys(this.formData).forEach((key) => {
        delete this.formData[key];
      });
      // Clear inputValues
      Object.keys(this.inputValues).forEach((key) => {
        delete this.inputValues[key];
      });
      // Copy from store's formData
      Object.assign(
        this.formData,
        this.$store.state.formData[this.sectionId] || {},
      );
      Object.assign(this.inputValues, this.formData);
      this.questions = getQuestionsForSection(this.sectionId);
      this.section = this.questions[0]?.section || "";
    },
    isMarked(sectionId, fieldId) {
      return (
        this.$store.state.markedQuestions[sectionId] &&
        this.$store.state.markedQuestions[sectionId].includes(fieldId)
      );
    },
    toggleMarked(sectionId, fieldId) {
      this.$store.commit("toggleMarkedQuestion", { sectionId, fieldId });
      this.validationErrors[fieldId] = [];
    },
    validateOnBlur(question) {
      const isRequired = this.isFieldRequired(question);

      if (!this.isMarked(question.sectionId, question.fieldId)) {
        const errors = validateField(
          question,
          this.inputValues[question.fieldId],
          isRequired,
        );
        this.validationErrors[question.fieldId] = errors;
      } else {
        this.validationErrors[question.fieldId] = [];
      }
    },
    setInputValue(question, value) {
      let formattedValue = value;
      if (question.type === "date") {
        formattedValue = formatDate(value, "YYYY-MM-DD");
      }

      this.inputValues[question.fieldId] = formattedValue;

      // Update the store's formData
      this.$store.commit("updateFormData", {
        sectionId: question.sectionId,
        fieldId: question.fieldId,
        value: formattedValue,
      });

      const isRequired = this.isFieldRequired(question);

      if (!this.isMarked(question.sectionId, question.fieldId)) {
        const errors = validateField(question, formattedValue, isRequired);
        this.validationErrors[question.fieldId] = errors;
      } else {
        // Clear validation errors for marked questions
        this.validationErrors[question.fieldId] = [];
      }

      if (this.isMarked(question.sectionId, question.fieldId)) {
        this.$store.commit("toggleMarkedQuestion", {
          sectionId: question.sectionId,
          fieldId: question.fieldId,
        });
      }
    },
    isFieldRequired(question) {
      return isQuestionRequired(
        question,
        // this.formData,
        this.$store.state.requiredFields,
      );
    },
    navigateToPreviousSection() {
      if (this.sectionIndex > 0) {
        this.$router.push({
          name: "FormPage",
          params: { sectionId: this.formDataKeys[this.sectionIndex - 1] },
        });
      }
    },
    navigateToQuestionFlow(sectionId) {
      let questionIndex = 0;
      const firstIncompleteQuestionIndex =
        this.$store.getters.getFirstIncompleteQuestionForSection(sectionId);
      if (firstIncompleteQuestionIndex !== null) {
        questionIndex = firstIncompleteQuestionIndex;
      }
      this.$router.push({
        name: "QuestionFlow",
        params: { sectionId: sectionId, questionIndex: questionIndex },
      });
    },
    async submitFormAndLoadNextSection() {
      // Validate all visible fields
      this.visibleQuestions.forEach((question) => {
        const value = this.inputValues[question.fieldId];
        const isRequired = this.isFieldRequired(question);

        if (!this.isMarked(question.sectionId, question.fieldId)) {
          const errors = validateField(question, value, isRequired);
          this.validationErrors[question.fieldId] = errors;
        } else {
          // Clear validation errors for marked questions
          this.validationErrors[question.fieldId] = [];
        }
      });

      // Allow save even if there are validation errors
      // if (hasErrors) {
      //   console.log("Validation errors:", this.validationErrors);
      //   return;
      // }

      // No validation errors, update the store's formData
      this.$store.commit("updateSectionFormData", {
        sectionId: this.sectionId,
        data: { ...this.inputValues },
      });

      try {
        // Create update payload with the current section's data
        const sectionUpdate = {
          [this.sectionId]: { ...this.inputValues }
        };
        
        // Use the field mapping utilities to create the proper payload
        const updatePayload = createContractPayload(sectionUpdate, {
          markedQuestions: this.$store.state.markedQuestions
        });
        
        console.log('Updating contract with payload:', updatePayload);
        
        // Update the contract using Supabase API
        const response = await ContractAPI.update(this.$store.state.contractId, updatePayload);
        console.log("Contract updated:", response);

        // Navigate to the next section if it exists
        if (this.formDataKeys[this.sectionIndex + 1]) {
          this.$router.push({
            name: "FormPage",
            params: { sectionId: this.formDataKeys[this.sectionIndex + 1] },
          });
        } else {
          // Handle end of form (e.g., navigate to a summary page)
          console.log("Form completed.");
        }
      } catch (error) {
        console.error("Error updating contract:", error);
      }
    },
  },
};
</script>

<style scoped>
.form-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

::v-deep(.p-panel-header) {
  display: none;
}

.sticky-progress-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: transparent;
  padding-bottom: 5px;
  margin: 0px 5px;
}

.progress-bar-container {
  margin-bottom: 0;
  /* Remove existing margin since we have padding on parent */
}

.form-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.question-item {
  margin-bottom: 20px;
}

.question-label {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.info-icon {
  margin-left: 5px;
  color: #007ad9;
  cursor: pointer;
}

.marked-question {
  opacity: 0.5;
}

.mt-4 {
  margin-top: 1rem;
}

.required-asterisk {
  color: red;
  margin-right: 2px;
}

.p-error {
  color: red;
  font-size: 0.875em;
  margin-top: 0.25rem;
}

.marked-input {
  background: #fff9c4 !important;
}

.marked-button {
  color: black !important;
}
</style>

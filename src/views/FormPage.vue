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
                    :disabled="(isContractStarted && sectionId === 'property') || question.readOnly"
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
                  <div v-if="sectionId !== 'property' && !question.readOnly" class="flex justify-center items-center ml-4">
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
                  <div v-if="sectionId !== 'property'" class="flex justify-center items-center ml-4">
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
                  <div v-if="sectionId !== 'property'" class="flex justify-center items-center ml-4">
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
                  <div v-if="sectionId !== 'property'" class="flex justify-center items-center ml-4">
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
                  <Dropdown
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
                    @update:model-value="setInputValue(question, $event)"
                  />
                  <div v-if="sectionId !== 'property'" class="flex justify-center items-center ml-4">
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
                  <div v-if="sectionId !== 'property'" class="flex justify-center items-center ml-4">
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
                  <div v-if="sectionId !== 'property'" class="flex justify-center items-center ml-4">
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
            @click="handleNextButtonClick"
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
import { getQuestionsForSection, sections } from "../config/TX";
import { ContractAPI } from "@/services/api.js";
import { createContractPayload } from "@/utils/fieldMapUtils";
import { AuthService } from "@/services/auth.js";

import SectionProgressBar from "@/components/SectionProgressBar.vue";

// PrimeVue components
import Panel from "primevue/panel";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Dropdown from "primevue/dropdown";
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
    Dropdown,
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
      inputValues: {}, // This will be made reactive via Vue.set in updateFormData
      questions: [],
      section: "",
      validationErrors: {},
      isSaving: false, // Flag to prevent data clearing during save
    };
  },
  computed: {
    isContractStarted() {
      return !!this.$store.state.contractId; // Assuming contractId is set when a contract is started
    },
    formDataKeys() {
      // Use the fixed list of navigable sections from the config
      // instead of all keys from formData
      return sections;
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
  async beforeRouteUpdate(to, from, next) {
    // Auto-save when navigating between sections (for menu navigation)
    console.log(`[FormPage beforeRouteUpdate] CALLED - from ${from.params.sectionId} to ${to.params.sectionId}`);
    const oldSectionId = from.params.sectionId;
    const newSectionId = to.params.sectionId;

    if (oldSectionId && oldSectionId !== newSectionId && !this.isSaving) {
      console.log(`[FormPage beforeRouteUpdate] Auto-saving ${oldSectionId} before switching to ${newSectionId}`);
      this.isSaving = true;
      try {
        await this.saveCurrentSection();
        console.log(`[FormPage beforeRouteUpdate] Save completed for ${oldSectionId}`);
      } catch (error) {
        console.error(`[FormPage beforeRouteUpdate] Save failed:`, error);
      } finally {
        this.isSaving = false;
      }
    }
    next();
  },
  async beforeRouteLeave(to, from, next) {
    // Auto-save before leaving the page completely
    console.log(`[FormPage beforeRouteLeave] CALLED - leaving ${from.params.sectionId}`);
    if (this.sectionId && !this.isSaving) {
      console.log(`[FormPage beforeRouteLeave] Auto-saving ${this.sectionId} before leaving`);
      this.isSaving = true;
      try {
        await this.saveCurrentSection();
        console.log(`[FormPage beforeRouteLeave] Save completed for ${this.sectionId}`);
      } catch (error) {
        console.error(`[FormPage beforeRouteLeave] Save failed:`, error);
      } finally {
        this.isSaving = false;
      }
    }
    next();
  },
  watch: {
    "$route.params.sectionId"(newVal) {
      // Update section when route changes (save happens in beforeRouteUpdate)
      if (newVal && this.formDataKeys.includes(newVal)) {
        this.sectionId = newVal;
        this.sectionIndex = this.formDataKeys.indexOf(this.sectionId);
        this.updateFormData();
      }
    },
    "$store.state.formData": {
      handler() {
        // Don't update form data if we're in the middle of saving
        // This prevents the inputValues from being cleared while we're trying to save them
        if (!this.isSaving) {
          this.updateFormData();
        }
      },
      deep: true,
    },
  },
  async created() {
    console.log('🟢 FormPage.vue created() - component is loading');
    console.log('🟢 Methods available:', Object.keys(this.$options.methods || {}));
    this.sectionIndex = this.formDataKeys.indexOf(this.sectionId);
    this.updateFormData();
    
    // If we're on the buyers section, populate the primaryName and email from user profile
    if (this.sectionId === 'buyers') {
      const user = await AuthService.getUser();
      if (user) {
        // Set the primaryName field with the user's full name
        if (user.user_metadata?.full_name) {
          this.inputValues.primaryName = user.user_metadata.full_name;
          // Also update the store
          this.$store.commit("updateFormData", {
            sectionId: 'buyers',
            fieldId: 'primaryName',
            value: user.user_metadata.full_name,
          });
        }
        
        // Always populate the email field from the user profile (immutable)
        if (user.email) {
          this.inputValues.email = user.email;
          this.$store.commit("updateFormData", {
            sectionId: 'buyers',
            fieldId: 'email',
            value: user.email,
          });
        }
      }
    }
    
    window.scrollTo(0, 0);
  },
  methods: {
    updateFormData() {
      console.log(`[FormPage] updateFormData called for section: ${this.sectionId}`);
      console.log(`[FormPage] Store formData for ${this.sectionId}:`, this.$store.state.formData[this.sectionId]);

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

      console.log(`[FormPage] After update - formData:`, this.formData);
      console.log(`[FormPage] After update - inputValues:`, this.inputValues);

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

      // Debug logging for critical fields
      if (question.fieldId === 'hasListingAgentInfo' || question.fieldId === 'primaryName' || question.fieldId === 'secondaryName') {
        console.log(`Setting ${question.fieldId} to:`, value);
        console.log('Value type:', typeof value);
        console.log('Current inputValues before update:', {...this.inputValues});
      }

      this.inputValues[question.fieldId] = formattedValue;

      // Log after setting
      if (question.fieldId === 'primaryName' || question.fieldId === 'secondaryName') {
        console.log(`After setting ${question.fieldId}, inputValues:`, {...this.inputValues});
      }

      // Update the store's formData
      this.$store.commit("updateFormData", {
        sectionId: question.sectionId,
        fieldId: question.fieldId,
        value: formattedValue,
      });

      // Debug log the store update for boolean fields
      if (question.fieldId === 'hasListingAgentInfo') {
        console.log('Store updated with hasListingAgentInfo:', formattedValue);
        console.log('Current store value:', this.$store.state.formData.listingAgent?.hasListingAgentInfo);
      }

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
    handleNextButtonClick(event) {
      console.log('🔴 NEXT BUTTON CLICKED!', event);
      console.log('🔴 Current section:', this.sectionId);
      event.preventDefault();
      this.submitFormAndLoadNextSection();
    },
    async saveCurrentSection() {
      try {
        console.log(`[FormPage SAVE] ========== saveCurrentSection() CALLED for ${this.sectionId} ==========`);

        // Extract save logic into reusable function
        const markedFields = this.$store.state.markedQuestions[this.sectionId] || [];
        const storeData = this.$store.state.formData[this.sectionId] || {};
        const dataToSave = {};

        Object.keys(storeData).forEach(fieldId => {
          if (!markedFields.includes(fieldId)) {
            dataToSave[fieldId] = storeData[fieldId];
          }
        });

        console.log(`[FormPage SAVE] Saving section: ${this.sectionId}`);
        console.log(`[FormPage SAVE] Data to save:`, JSON.stringify(dataToSave, null, 2));

        // Update the store's formData with non-marked fields only
        this.$store.commit("updateSectionFormData", {
          sectionId: this.sectionId,
          data: dataToSave,
        });

        // Create update payload with the current section's data (excluding marked fields)
        let sectionUpdate = {
          [this.sectionId]: dataToSave
        };

        // Special handling for sections that share JSONB columns
        // When saving sellers, also include buyers data (both go to 'parties' column)
        if (this.sectionId === 'sellers') {
          console.log('[FormPage SAVE] Saving sellers section');
          console.log('[FormPage SAVE] dataToSave for sellers:', dataToSave);
          sectionUpdate.buyers = this.$store.state.formData.buyers || {};
        }
        // When saving buyers, also include sellers data (both go to 'parties' column)
        else if (this.sectionId === 'buyers') {
          sectionUpdate.sellers = this.$store.state.formData.sellers || {};
        }
        // When saving HOA addendum, include other legal sections
        else if (this.sectionId === 'homeownersAssociationAddendum') {
          const legalSections = ['leases', 'survey', 'buyerProvisions', 'buyerNotices', 'buyerAttorney'];
          legalSections.forEach(section => {
            if (this.$store.state.formData[section]) {
              sectionUpdate[section] = this.$store.state.formData[section];
            }
          });
        }
        // When saving listing agent, include other additional_info sections
        else if (this.sectionId === 'listingAgent') {
          console.log('[FormPage SAVE] Saving listingAgent section with data:', dataToSave);
          const additionalSections = ['propertyCondition', 'brokerDisclosure', 'possession'];
          additionalSections.forEach(section => {
            if (this.$store.state.formData[section]) {
              sectionUpdate[section] = this.$store.state.formData[section];
            }
          });
        }
        // When saving any legal section, include all other legal sections
        else if (['leases', 'survey', 'buyerProvisions', 'buyerNotices', 'buyerAttorney'].includes(this.sectionId)) {
          const legalSections = ['leases', 'survey', 'homeownersAssociationAddendum', 'buyerProvisions', 'buyerNotices', 'buyerAttorney'];
          legalSections.forEach(section => {
            if (section !== this.sectionId && this.$store.state.formData[section]) {
              sectionUpdate[section] = this.$store.state.formData[section];
            }
          });
        }
        // When saving any additional_info section, include all other additional_info sections
        else if (['propertyCondition', 'brokerDisclosure', 'possession'].includes(this.sectionId)) {
          const additionalSections = ['propertyCondition', 'brokerDisclosure', 'possession', 'listingAgent'];
          additionalSections.forEach(section => {
            if (section !== this.sectionId && this.$store.state.formData[section]) {
              sectionUpdate[section] = this.$store.state.formData[section];
            }
          });
        }
        // When saving any title/closing section, include all other title/closing sections
        else if (['title', 'titleObjections', 'titleNotices', 'closing'].includes(this.sectionId)) {
          const titleSections = ['title', 'titleObjections', 'titleNotices', 'closing'];
          titleSections.forEach(section => {
            if (section !== this.sectionId && this.$store.state.formData[section]) {
              sectionUpdate[section] = this.$store.state.formData[section];
            }
          });
        }

        console.log('Section update being sent:', sectionUpdate);

        // Use the field mapping utilities to create the proper payload
        const updatePayload = createContractPayload(sectionUpdate, {
          markedQuestions: this.$store.state.markedQuestions
        });

        console.log('Updating contract with payload:', updatePayload);

        // Update the contract using Supabase API
        const response = await ContractAPI.update(this.$store.state.contractId, updatePayload);
        console.log("Contract updated:", response);

        // If a new contract was created (because the old one didn't exist), update the store
        if (response.id !== this.$store.state.contractId) {
          console.log("New contract created with ID:", response.id);
          this.$store.commit("setContractId", response.id);
        }

        console.log("Contract update response:", response);
      } catch (error) {
        console.error('[FormPage SAVE] ERROR in saveCurrentSection:', error);
        throw error;
      }
    },
    async submitFormAndLoadNextSection() {
      console.log(`[FormPage SAVE] ========== SAVE TRIGGERED FOR SECTION: ${this.sectionId} ==========`);
      this.isSaving = true;

      try {
        await this.saveCurrentSection();

        // Navigate to the next section if it exists
        if (this.formDataKeys[this.sectionIndex + 1]) {
          this.$router.push({
            name: "FormPage",
            params: { sectionId: this.formDataKeys[this.sectionIndex + 1] },
          });
        } else {
          // All form sections completed - navigate to the contract dashboard
          console.log("All form sections completed. Navigating to dashboard.");
          this.$router.push({
            name: "ContractDashboard",
            params: { id: this.$store.state.contractId },
          });
        }
      } catch (error) {
        console.error("Error updating contract:", error);
      } finally {
        this.isSaving = false;
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

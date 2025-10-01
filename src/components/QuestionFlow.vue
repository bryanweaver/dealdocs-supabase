<template>
  <div class="question-flow">
    <!-- Progress Bar at the top -->
    <div class="progress-bar-container">
      <SectionProgressBar
        :section-id="currentSectionId"
        :section-title="currentSectionTitle"
      />
    </div>

    <!-- Question Panel -->
    <div class="question-container">
      <Panel class="question-panel">
        <Transition
          :name="transitionName"
          mode="out-in"
        >
          <!-- Question content -->
          <question-input
            :key="questionKey"
            :form-data="formData"
            :question-config="currentSectionQuestions"
            :current-index="currentQuestionIndex"
            :has-previous-question="hasPreviousQuestion"
            @previous="handlePrevious"
            @next="handleNext"
          />
        </Transition>
      </Panel>
    </div>
  </div>
</template>

<script>
import QuestionInput from "./QuestionInput.vue";
import {
  getCurrentQuestionConfig,
  getIndexBySection,
  getSectionByIndex,
} from "../config/TX/index";
import { mapState } from "vuex";
import SectionProgressBar from "./SectionProgressBar.vue";
import Panel from "primevue/panel";
import { isQuestionRequired } from "@/utils/questionUtils";
import { useLayout } from "@/layout/composables/layout";
// import { computed } from "vue";

export default {
  components: {
    QuestionInput,
    SectionProgressBar,
    Panel,
  },
  setup() {
    const { isDarkTheme } = useLayout();
    return { isDarkTheme };
  },
  data() {
    return {
      currentQuestionIndex: 0, // Index of the current question
      currentSectionIndex: 0, // Index of the current section
      transitionName: "slide-left", // Transition name for the question input
    };
  },
  computed: {
    ...mapState(["formData", "requiredFields"]),
    currentSectionQuestions() {
      // Get the current section slug based on the current section index
      const currentSectionSlug = getSectionByIndex(this.currentSectionIndex);
      // Retrieve the question configuration for the current section
      const questions = getCurrentQuestionConfig(currentSectionSlug);
      return questions.map((question) => ({
        ...question,
        isRequired: isQuestionRequired(
          question,
          // this.formData,
          this.$store.state.requiredFields,
        ),
      }));
    },
    hasPreviousQuestion() {
      return this.currentQuestionIndex > 0 || this.currentSectionIndex > 0;
    },
    currentSectionId() {
      if (
        this.currentSectionQuestions &&
        this.currentSectionQuestions.length > 0
      ) {
        return this.currentSectionQuestions[0].sectionId;
      }
      return "";
    },
    currentSectionTitle() {
      if (
        this.currentSectionQuestions &&
        this.currentSectionQuestions.length > 0
      ) {
        return this.currentSectionQuestions[0].section;
      }
      return "";
    },
    questionKey() {
      return `${this.currentSectionIndex}-${this.currentQuestionIndex}`;
    },
  },
  mounted() {
    // Get both sectionId and optional questionIndex from the route parameters
    const { sectionId, questionIndex } = this.$route.params;
    if (sectionId) {
      // Find the index of the section based on the provided sectionId
      const sectionIndex = getIndexBySection(sectionId);
      if (sectionIndex !== -1) {
        this.currentSectionIndex = sectionIndex;
        // Load the questions for the new current section
        this.currentSectionQuestions = getCurrentQuestionConfig(sectionId);

        if (questionIndex !== "" && questionIndex !== undefined) {
          // Attempt to parse the provided questionIndex
          const parsedIndex = parseInt(questionIndex, 10);
          if (
            !isNaN(parsedIndex) &&
            parsedIndex >= 0 &&
            parsedIndex < this.currentSectionQuestions.length
          ) {
            this.currentQuestionIndex = parsedIndex;
          } else {
            // If the provided value is invalid, fallback to finding the first unanswered question
            for (let i = 0; i < this.currentSectionQuestions.length; i++) {
              const question = this.currentSectionQuestions[i];
              if (!this.isQuestionAnswered(question)) {
                this.currentQuestionIndex = i;
                break;
              }
            }
          }
        } else {
          // No questionIndex provided: use default behavior—find the first unanswered question
          for (let i = 0; i < this.currentSectionQuestions.length; i++) {
            const question = this.currentSectionQuestions[i];
            if (!this.isQuestionAnswered(question)) {
              this.currentQuestionIndex = i;
              break;
            }
          }
        }
      }
    } else {
      // No sectionId provided: loop through the current section questions for the first unanswered one
      for (let i = 0; i < this.currentSectionQuestions.length; i++) {
        const question = this.currentSectionQuestions[i];
        if (!this.isQuestionAnswered(question)) {
          this.currentQuestionIndex = i;
          break;
        }
      }
    }
  },
  methods: {
    handlePrevious() {
      this.transitionName = "slide-right";
      let prevIndex = this.currentQuestionIndex - 1;

      if (prevIndex >= 0) {
        // Move to the previous question in the current section
        this.currentQuestionIndex = prevIndex;
      } else {
        // Move to the last question of the previous section
        if (this.currentSectionIndex > 0) {
          this.currentSectionIndex--;
          const prevSectionSlug = getSectionByIndex(this.currentSectionIndex);
          this.currentSectionQuestions =
            getCurrentQuestionConfig(prevSectionSlug);
          // Set to the last question of the previous section
          this.currentQuestionIndex = this.currentSectionQuestions.length - 1;
        } else {
          // Already at the first question; handle as needed
        }
      }
    },
    handleNext() {
      this.transitionName = "slide-left";
      let nextIndex = this.currentQuestionIndex + 1;

      if (nextIndex < this.currentSectionQuestions.length) {
        // Move to the next question in the current section
        this.currentQuestionIndex = nextIndex;
      } else {
        // We've reached the end of the current section
        this.currentSectionIndex++;
        const nextSectionSlug = getSectionByIndex(this.currentSectionIndex);

        if (nextSectionSlug) {
          this.currentSectionQuestions =
            getCurrentQuestionConfig(nextSectionSlug);
          // Start at the first question of the new section
          this.currentQuestionIndex = 0;
        } else {
          // No more sections; handle as needed (e.g., navigate to summary)
        }
      }
    },
    isQuestionAnswered(question) {
      if (question.intro) return true;

      const sectionId = question.sectionId;
      const fieldId = question.fieldId;
      const value = this.formData[sectionId]?.[fieldId];
      return value !== null && value !== undefined && value !== "";
    },
    isQuestionVisible(question) {
      // Check if all dependencies are met
      if (question.dependsOnAll) {
        return question.dependsOnAll.every((dep) => this.checkDependsOn(dep));
      }
      if (question.dependsOnAny) {
        return question.dependsOnAny.some((dep) => this.checkDependsOn(dep));
      }
      return true;
    },
    checkDependsOn(dep) {
      const depQuestion = this.findQuestionByFieldId(dep.fieldId);
      const depValue = this.formData[depQuestion.sectionId]?.[dep.fieldId];
      return depValue === dep.value;
    },
    findQuestionByFieldId(fieldId) {
      // Search in the current section questions
      return (
        this.currentSectionQuestions.find((q) => q.fieldId === fieldId) ||
        // Optionally, search in all sections if necessary
        // QuestionConfig.find((q) => q.fieldId === fieldId)
        {}
      );
    },
  },
};
</script>

<style scoped>
.question-flow {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: var(--surface-ground);
  transition: background-color 0.3s ease;
}

.progress-bar-container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto 2rem;
}

.question-container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
}

.question-panel {
  background: var(--surface-card);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease;
}

/* Slide Left (Next) */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.slide-left-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Slide Right (Previous) */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.slide-right-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

@media (max-width: 768px) {
  .question-flow {
    padding: 1rem;
  }

  .progress-bar-container,
  .question-container {
    width: 95%;
  }

  .question-panel {
    padding: 1rem;
  }
}
</style>

<!-- components/SectionProgressBar.vue -->
<template>
  <Panel class="section-progress-bar">
    <div class="header">
      <h3 class="title">{{ sectionTitle }}</h3>
      <span class="progress-text">{{ progressPercentage }}% Complete</span>
    </div>

    <ProgressBar
      :value="progressPercentage"
      :show-value="false"
      class="custom-progress-bar"
    />

    <p
      v-if="totalQuestions === 0 && completedQuestions === 0"
      class="completion-text"
    >
      All questions here are optional
    </p>
    <p v-else class="completion-text">
      <span class="completed">{{ completedQuestions }}</span> out of
      <span class="total">{{ totalQuestions }}</span> questions completed
    </p>
  </Panel>
</template>

<script>
import ProgressBar from "primevue/progressbar";
import Panel from "primevue/panel";
import { mapGetters } from "vuex";
import { useLayout } from "@/layout/composables/layout";

export default {
  name: "SectionProgressBar",
  components: {
    ProgressBar,
    Panel,
  },
  props: {
    sectionId: {
      type: String,
      required: true,
    },
    sectionTitle: {
      type: String,
      required: true,
    },
  },
  setup() {
    const { isDarkTheme } = useLayout();
    return { isDarkTheme };
  },
  computed: {
    ...mapGetters(["getSectionProgress"]),
    sectionData() {
      return this.$store.state.formData[this.sectionId] || {};
    },
    progressData() {
      return this.getSectionProgress(this.sectionId);
    },
    totalQuestions() {
      return this.progressData.totalQuestions;
    },
    completedQuestions() {
      return this.progressData.completedQuestions;
    },
    progressPercentage() {
      if (this.totalQuestions === 0) {
        return 100;
      }
      return Math.round((this.completedQuestions / this.totalQuestions) * 100);
    },
  },
  watch: {
    sectionData: {
      deep: true,
      handler() {
        // Progress is automatically updated via computed properties
        // No need to manually calculate
      },
    },
  },
  mounted() {
    // Progress is automatically calculated via computed properties
    // No need to manually calculate
  },
  methods: {
    // Remove calculateProgress method as it's not needed
  },
};
</script>

<style scoped>
.section-progress-bar {
  background: var(--surface-card);
  border-radius: var(--p-panel-border-radius);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  transition:
    background-color 0.3s ease,
    color 0.3s ease,
    box-shadow 0.3s ease;
}

:deep(.p-panel-header) {
  display: none;
}

:deep(.p-panel-content) {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.progress-text {
  color: var(--text-color-secondary);
  font-weight: 500;
}

.custom-progress-bar {
  height: 0.75rem !important;
  border-radius: 999px !important;
}

.completion-text {
  margin-top: 0.75rem;
  color: var(--text-color-secondary);
  text-align: center;
}

.completed,
.total {
  font-weight: 600;
  color: var(--text-color);
}
</style>

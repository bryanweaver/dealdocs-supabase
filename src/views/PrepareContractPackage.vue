<template>
  <div class="prepare-contract-package">
    <div class="document-checklist">
      <DocumentChecklist
        @files-for-agent-email="handleFilesForEmail"
        @checklist-status="handleChecklistStatus"
      />
    </div>
    <div v-if="showEmailForm" class="email-form">
      <AgentEmailForm :files-for-agent-email="filesForAgentEmail" />
    </div>
    <div v-else class="m-4">
      <Message severity="warn" class="mb-4">
        Please ensure you have uploaded all required documents and generated
        your contract before sending the contract to the agent. Once these
        things are complete, the agent email form will be available below.
      </Message>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { getAllQuestions } from "../config/TX";
import { useStore } from "vuex";
import AgentEmailForm from "../components/AgentEmailForm.vue";
import DocumentChecklist from "../components/DocumentChecklist.vue";

export default defineComponent({
  name: "PrepareContractPackage",
  components: {
    AgentEmailForm,
    DocumentChecklist,
  },
  setup() {
    const store = useStore();
    const allQuestions = getAllQuestions();
    const openAccordions = ref({});
    const formData = ref({});
    const showEmailForm = ref(false);

    const filesForAgentEmail = ref([]);

    const handleChecklistStatus = (isComplete) => {
      showEmailForm.value = isComplete;
    };

    const handleFilesForEmail = (keys) => {
      filesForAgentEmail.value = keys;
    };

    const toggleAccordion = (sectionId) => {
      openAccordions.value[sectionId] = !openAccordions.value[sectionId];
    };

    const getValueFromStore = (sectionId, fieldId) => {
      return computed(() => {
        const value = store.state.formData[sectionId][fieldId];
        if (typeof value === "string") {
          return value;
        } else if (typeof value === "boolean") {
          return value ? "Yes" : "No";
        } else {
          return value;
        }
      });
    };

    return {
      allQuestions,
      openAccordions,
      formData,
      toggleAccordion,
      getValueFromStore,
      filesForAgentEmail,
      handleFilesForEmail,
      showEmailForm,
      handleChecklistStatus,
    };
  },
});
</script>

<style scoped>
.accordion {
  border: 1px solid #ccc;
  margin-bottom: 10px;
}

.accordion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  cursor: pointer;
}

.accordion-content {
  padding: 10px;
}

.question-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
}

.question-label {
  flex: 1;
  max-width: 500px; /* Adjust this value as needed */
}

.question-input {
  flex: 2;
  margin-left: 20px;
  max-width: 200px;
}
</style>

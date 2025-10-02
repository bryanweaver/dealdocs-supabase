<template>
  <!-- Progress Overview - Let's add just this first -->
  <ContractProgressCard
    :completed-sections="completedSections"
    :total-sections="totalSections"
    class="mb-6"
  />

  <!-- Completion Section - Now directly under progress card -->
  <div
    v-if="isContractComplete"
    class="mb-6"
  >
    <Panel class="w-full mx-auto">
      <template #header>
        <h2 class="text-lg font-semibold">
          Contract Questions Complete! 🎉
        </h2>
      </template>
      <div class="p-4">
        <p class="text-center mb-2">
          Congratulations! You've completed all required questions for your
          contract. You can now proceed with reviewing and signing your contract.
        </p>

        <!-- Next steps as actionable buttons -->
        <div class="next-steps mt-6">
          <h3 class="mb-4 text-lg font-semibold text-center">
            Choose Your Next Action:
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <router-link
              :to="`/contracts/${$route.params.id}/upload-documents`"
              :class="['action-button-card', { 'primary-action': nextPrimaryAction === 'upload', 'completed-action': hasUploadedDocuments }]"
            >
              <div class="action-button-content">
                <i :class="['action-icon', hasUploadedDocuments ? 'pi pi-check-circle' : 'pi pi-upload']" />
                <h4 class="action-title">{{ hasUploadedDocuments ? 'Documents Uploaded' : 'Upload Documents' }}</h4>
                <p class="action-description">{{ hasUploadedDocuments ? 'Documents ready' : 'Add supporting documents to your contract package' }}</p>
                <span v-if="nextPrimaryAction === 'upload'" class="next-step-badge">Next Step</span>
              </div>
            </router-link>

            <router-link
              :to="`/contracts/${$route.params.id}/generate-contract`"
              :class="['action-button-card', { 'primary-action': nextPrimaryAction === 'generate', 'completed-action': hasGeneratedContract }]"
            >
              <div class="action-button-content">
                <i :class="['action-icon', hasGeneratedContract ? 'pi pi-check-circle' : 'pi pi-file-pdf']" />
                <h4 class="action-title">{{ hasGeneratedContract ? 'Contract Generated' : 'Generate & Sign' }}</h4>
                <p class="action-description">{{ hasGeneratedContract ? 'PDF created and signed' : 'Create PDF and add digital signatures' }}</p>
                <span v-if="nextPrimaryAction === 'generate'" class="next-step-badge">Next Step</span>
              </div>
            </router-link>

            <router-link
              :to="`/contracts/${$route.params.id}/prepare-contract-package`"
              :class="['action-button-card', { 'primary-action': nextPrimaryAction === 'send', 'completed-action': hasBeenSent }]"
            >
              <div class="action-button-content">
                <i :class="['action-icon', hasBeenSent ? 'pi pi-check-circle' : 'pi pi-send']" />
                <h4 class="action-title">{{ hasBeenSent ? 'Sent to Agent' : 'Send to Agent' }}</h4>
                <p class="action-description">{{ hasBeenSent ? 'Package delivered' : 'Email complete package to listing agent' }}</p>
                <span v-if="nextPrimaryAction === 'send'" class="next-step-badge">Next Step</span>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </Panel>
  </div>

  <!-- Show navigation cards if not complete -->
  <div
    v-else
    class="flex justify-between gap-6 mb-6 w-full"
  >
    <GoToFormsCard />
    <GoToQuestionsCard />
  </div>

  <!-- Referrals Section -->
  <div class="mb-6">
    <Panel class="referral-status-grid w-full mx-auto">
      <template #header>
        <h2 class="text-lg font-semibold">
          Referrals
        </h2>
      </template>
      <div
        class="flex flex-row justify-center gap-8 items-center p-6"
      >
        <ReferralButton
          label="Get Financing Referral"
          :url="financingReferralUrl"
          description="Click here to get referred to our trusted financing partners."
        />
        <!-- Future referral buttons can be added here -->
      </div>
    </Panel>
  </div>

  <!-- Add DocumentStatusGrid after ContractProgressCard -->
  <DocumentStatusGrid class="mb-6" />
</template>

<script lang="ts">
import GoToFormsCard from "@/components/GoToFormsCard.vue";
import GoToQuestionsCard from "@/components/GoToQuestionsCard.vue";
import { computed, defineComponent, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { StorageAPI } from "@/services/api.js";
import ContractProgressCard from "@/components/ContractProgressCard.vue";
import DocumentStatusGrid from "./DocumentStatusGrid.vue";
import ReferralButton from "@/components/ReferralButton.vue";

export default defineComponent({
  name: "ContractDashboard",
  components: {
    GoToFormsCard,
    GoToQuestionsCard,
    ContractProgressCard,
    DocumentStatusGrid,
    ReferralButton,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    // Add these computed properties
    const completedSections = computed(() => {
      const sections = [
        "property",
        "buyers",
        "sellers",
        "homeownersAssociationAddendum",
        "leases",
        "title",
        "titleObjections",
        "titleNotices",
        "survey",
        "propertyCondition",
        "finance",
        "buyerProvisions",
        "closing",
        "possession",
        "brokerDisclosure",
        "buyerNotices",
        "buyerAttorney",
        "listingAgent",
      ];

      return sections.filter((section) =>
        store.getters.isSectionComplete(section),
      ).length;
    });

    const totalSections = computed(() => {
      // This should match the number of sections in your form
      return 18; // Total number of sections listed above
    });

    const isContractComplete = computed(() => store.getters.isContractComplete);

    // Track document upload status
    const hasUploadedDocuments = computed(() => {
      const uploadedDocs = store.state.uploadedDocuments || {};
      // Check if at least one document has been uploaded
      return Object.keys(uploadedDocs).some(key => uploadedDocs[key]?.isUploaded);
    });

    // Track contract generation status
    const hasGeneratedContract = computed(() => {
      // Check if contract has been generated (PDF exists)
      return store.state.formData?.contractGenerated ||
             store.state.contract?.pdf_url ||
             false;
    });

    // Track if contract has been sent
    const hasBeenSent = computed(() => {
      // Check if contract has been sent to agent
      return store.state.formData?.contractSent ||
             store.state.contract?.sent_to_agent ||
             false;
    });

    // Determine the next primary action
    const nextPrimaryAction = computed(() => {
      if (!hasUploadedDocuments.value) {
        return 'upload';
      } else if (!hasGeneratedContract.value) {
        return 'generate';
      } else if (!hasBeenSent.value) {
        return 'send';
      }
      return 'complete'; // All steps done
    });

    const financingReferralUrl =
      import.meta.env?.VITE_FINANCING_REFERRAL_URL ||
      "https://example.com/referral";

    const navigateToReview = () => {
      router.push(`/contracts/${route.params.id}/review`);
    };

    const fetchUploads = async () => {
      const accountId = store.state.accountId;
      const contractId = store.state.contractId;
      const folderPrefix = `accounts/${accountId}/contracts/${contractId}/`;
      const result = await StorageAPI.list(folderPrefix, 'contracts');

      // Group documents by type based on path
      const documentsByType = result.reduce((acc, item) => {
        const pathParts = item.name.split("/");
        const documentType = pathParts[pathParts.length - 2]; // Get the parent folder name as document type

        const document = {
          key: `${folderPrefix}${item.name}`,
          filetype: item.name.split(".").pop().toLowerCase(),
          date: new Date(item.updated_at || item.created_at).toLocaleString([], {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          }),
          name: item.name.split("/").pop().split("-").slice(1).join("-"),
        };

        if (!acc[documentType]) {
          acc[documentType] = [];
        }
        acc[documentType].push(document);
        return acc;
      }, {});

      // Store latest document for each type
      Object.entries(documentsByType).forEach(([docType, documents]) => {
        if (docType === "etch-packets") return;

        const sortedDocs = documents.sort(
          (a, b) => new Date(b.name).getTime() - new Date(a.name).getTime(),
        );

        if (sortedDocs.length > 0) {
          store.dispatch("uploadDocument", {
            documentType: docType,
            document: sortedDocs[0],
            isUploaded: true,
          });
        }
      });
    };

    onMounted(() => {
      fetchUploads();
    });

    return {
      isContractComplete,
      navigateToReview,
      fetchUploads,
      completedSections,
      totalSections,
      financingReferralUrl,
      hasUploadedDocuments,
      hasGeneratedContract,
      hasBeenSent,
      nextPrimaryAction,
    };
  },
});
</script>

<style scoped>
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}

/* Action Button Styles */
.action-button-card {
  display: block;
  padding: 1.5rem;
  background: var(--surface-0);
  border: 2px solid #d4d4d8;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.action-button-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: var(--primary-color);
  background: var(--surface-50);
}

.action-button-card.primary-action {
  border: 2px solid #93c5fd;
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--surface-0) 100%);
}

.action-button-card.primary-action:hover {
  border-color: var(--primary-color);
  background: linear-gradient(135deg, var(--primary-100) 0%, var(--primary-50) 100%);
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.25);
}

.action-button-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
}

.action-icon {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 0.75rem;
  transition: transform 0.3s ease;
}

.action-button-card:hover .action-icon {
  transform: scale(1.1);
}

.action-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.action-description {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  line-height: 1.4;
  margin: 0;
}

/* Completed action styling */
.action-button-card.completed-action {
  border-color: #10b981;
  background: #f0fdf4;
  opacity: 0.9;
}

.action-button-card.completed-action .action-icon {
  color: #10b981;
}

.action-button-card.completed-action:hover {
  border-color: #059669;
  transform: translateY(-2px);
}

/* Next Step Badge */
.next-step-badge {
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  background: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}

/* Dark mode adjustments */
.dark .action-button-card {
  background: var(--surface-800);
  border-color: var(--surface-600);
}

.dark .action-button-card:hover {
  background: var(--surface-700);
  border-color: var(--primary-color);
}

.dark .action-button-card.primary-action {
  background: linear-gradient(135deg, var(--surface-800) 0%, var(--surface-900) 100%);
  border-color: var(--primary-600);
}

.dark .action-button-card.primary-action:hover {
  background: linear-gradient(135deg, var(--surface-700) 0%, var(--surface-800) 100%);
}

.dark .action-button-card.completed-action {
  background: #064e3b;
  border-color: #10b981;
}

.dark .action-button-card.completed-action:hover {
  background: #065f46;
  border-color: #34d399;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .action-button-card {
    padding: 1.25rem;
  }

  .action-icon {
    font-size: 2rem;
  }

  .action-title {
    font-size: 1rem;
  }
}
</style>

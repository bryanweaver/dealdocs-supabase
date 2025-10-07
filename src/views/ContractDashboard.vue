<template>
  <!-- Progress Overview - Let's add just this first -->
  <ContractProgressCard
    :completed-sections="completedSections"
    :total-sections="totalSections"
    class="mb-6"
  />

  <!-- Completion Section - Now directly under progress card -->
  <div v-if="isContractComplete" class="mb-6">
    <Panel class="w-full mx-auto">
      <template #header>
        <h2 class="text-lg font-semibold">Contract Questions Complete! 🎉</h2>
      </template>
      <div class="p-4">
        <p class="text-center mb-2">
          Congratulations! You've completed all required questions for your
          contract. You can now proceed with reviewing and signing your contract.
        </p>

        <!-- Next steps in a more compact layout -->
        <div class="next-steps mt-6">
          <h3 class="mb-4 text-lg font-semibold">Next Steps:</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <router-link
              :to="`/contracts/${$route.params.id}/upload-documents`"
              class="next-step-card"
              :class="{ 'is-next-step': nextBestStep === 'upload', 'is-completed': allDocsUploaded }"
            >
              <div class="step-icon-circle" :class="{ 'is-completed': allDocsUploaded, 'is-next': nextBestStep === 'upload' }">
                <i v-if="allDocsUploaded" class="pi pi-check text-2xl"></i>
                <i v-else class="pi pi-file-export text-2xl"></i>
              </div>
              <div class="step-title">Upload Documents</div>
              <div class="step-description">Pre-approval, earnest & option checks</div>
            </router-link>

            <router-link
              :to="`/contracts/${$route.params.id}/generate-contract`"
              class="next-step-card"
              :class="{ 'is-next-step': nextBestStep === 'generate', 'is-completed': allSignersCompleted }"
            >
              <div class="step-icon-circle" :class="{ 'is-completed': allSignersCompleted, 'is-next': nextBestStep === 'generate' }">
                <i v-if="allSignersCompleted" class="pi pi-check text-2xl"></i>
                <i v-else class="pi pi-pencil text-2xl"></i>
              </div>
              <div class="step-title">Generate & Sign</div>
              <div class="step-description">Create PDF and collect signatures</div>
            </router-link>

            <router-link
              :to="`/contracts/${$route.params.id}/prepare-contract-package`"
              class="next-step-card"
              :class="{ 'is-next-step': nextBestStep === 'email' }"
            >
              <div class="step-icon-circle" :class="{ 'is-next': nextBestStep === 'email' }">
                <i class="pi pi-send text-2xl"></i>
              </div>
              <div class="step-title">Email to Agent</div>
              <div class="step-description">Send to selling agent</div>
            </router-link>
          </div>
        </div>
      </div>
    </Panel>
  </div>

  <!-- Show navigation cards if not complete -->
  <div v-else class="flex justify-between gap-6 mb-6 w-full">
    <GoToFormsCard />
    <GoToQuestionsCard />
  </div>

  <!-- Referrals Section -->
  <div class="mb-6">
    <Panel class="referral-status-grid w-full mx-auto">
      <template #header>
        <h2 class="text-lg font-semibold">Referrals</h2>
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
    const allDocsUploaded = computed(() => store.getters.allDocsAreUploaded);
    const allSignersCompleted = computed(() => store.getters.allSignersCompleted);

    // Determine the next best step based on what's been completed
    const nextBestStep = computed(() => {
      // Step 1: Upload documents (if not done yet)
      if (!allDocsUploaded.value) {
        return 'upload';
      }
      // Step 2: Generate and sign (if docs uploaded but not signed)
      if (allDocsUploaded.value && !allSignersCompleted.value) {
        return 'generate';
      }
      // Step 3: Email to agent (if everything else is done)
      if (allDocsUploaded.value && allSignersCompleted.value) {
        return 'email';
      }
      // Default: start with upload
      return 'upload';
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

    onMounted(async () => {
      fetchUploads();

      // Load etch packets with proper transformation
      try {
        const contractId = store.state.contractId;
        await store.dispatch("loadEtchPacketsForContract", contractId);
      } catch (error) {
        console.error("Error loading etch packets:", error);
      }
    });

    return {
      isContractComplete,
      navigateToReview,
      fetchUploads,
      completedSections,
      totalSections,
      financingReferralUrl,
      allDocsUploaded,
      allSignersCompleted,
      nextBestStep,
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

/* Next Steps Styling */
.next-step-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  text-decoration: none;
  color: var(--text-color);
  transition: all 0.25s ease;
  text-align: center;
  min-height: 180px;
  position: relative;
  cursor: pointer;
}

.next-step-card:hover {
  border-color: #3b82f6;
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.15);
}

/* Next step highlight - blue border */
.next-step-card.is-next-step {
  border-color: #3b82f6;
  border-width: 3px;
  background: #eff6ff;
}

.next-step-card.is-next-step:hover {
  border-color: #2563eb;
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.25);
}

/* Completed step styling */
.next-step-card.is-completed {
  background: #f0fdf4;
  border-color: #86efac;
}

.next-step-card.is-completed:hover {
  border-color: #4ade80;
}

/* Icon circle */
.step-icon-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: #6b7280;
  transition: all 0.25s ease;
}

.step-icon-circle.is-next {
  background: #3b82f6;
  color: white;
}

.step-icon-circle.is-completed {
  background: #22c55e;
  color: white;
}

.step-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.step-description {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.4;
}

/* Dark mode adjustments */
:global(.dark) .next-step-card {
  background: #1f2937;
  border-color: #374151;
}

:global(.dark) .next-step-card:hover {
  border-color: #3b82f6;
}

:global(.dark) .next-step-card.is-next-step {
  background: #1e3a5f;
  border-color: #3b82f6;
}

:global(.dark) .next-step-card.is-completed {
  background: #064e3b;
  border-color: #86efac;
}

:global(.dark) .step-icon-circle {
  background: #374151;
  color: #9ca3af;
}

:global(.dark) .step-title {
  color: #f9fafb;
}

:global(.dark) .step-description {
  color: #9ca3af;
}
</style>

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
        <div class="next-steps mt-4">
          <h3 class="mb-3 text-base font-semibold">Next Steps:</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <router-link
              :to="`/contracts/${$route.params.id}/upload-documents`"
              class="flex items-center p-3 bg-surface-50 dark:bg-surface-800 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            >
              <i class="pi pi-file-export mr-3 text-xl" style="color: var(--primary-color)"></i>
              <span class="text-sm">Upload contract documents</span>
            </router-link>
            
            <router-link
              :to="`/contracts/${$route.params.id}/generate-contract`"
              class="flex items-center p-3 bg-surface-50 dark:bg-surface-800 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            >
              <i class="pi pi-pencil mr-3 text-xl" style="color: var(--primary-color)"></i>
              <span class="text-sm">Generate and sign contract</span>
            </router-link>
            
            <router-link
              :to="`/contracts/${$route.params.id}/prepare-contract-package`"
              class="flex items-center p-3 bg-surface-50 dark:bg-surface-800 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            >
              <i class="pi pi-send mr-3 text-xl" style="color: var(--primary-color)"></i>
              <span class="text-sm">Email to selling agent</span>
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
    };
  },
});
</script>

<style scoped>
/* .contract-landing {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
} */

/* .card-container {
  display: flex;
  justify-content: space-around;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 40px;
} */

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}
</style>

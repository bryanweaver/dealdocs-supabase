<script setup lang="ts">
// Component name for linting
defineOptions({ name: "ContractsPage" });

import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import ProgressSpinner from "primevue/progressspinner";
import ConfirmDialog from "primevue/confirmdialog";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { ContractAPI, EtchAPI } from "@/services/api.js";
import { AuthService } from "@/services/auth.js";

const store = useStore();
const user = ref(null);
const contracts = computed(() => {
  return store.state.contracts || [];
});
const router = useRouter();
const isLoading = ref(true);
const confirm = useConfirm();
const toast = useToast();

const callCreateAccount = async (user) => {
  try {
    // Account creation is now handled by user creation in Supabase
    // Set the user ID as account ID for compatibility
    store.commit("setAccountId", user.id);
    console.log("Account ID set from user:", user.id);
  } catch (error) {
    console.error("Error setting account:", error);
  }
};

const fetchAccountId = async (userId) => {
  try {
    // In Supabase version, account ID is the same as user ID
    store.commit("setAccountId", userId);
    console.log("Account ID set:", userId);
    return userId;
  } catch (error) {
    console.error("Error setting account ID:", error);
  }
};

const fetchContracts = async () => {
  try {
    // Use Supabase ContractAPI instead of GraphQL
    const contractsList = await ContractAPI.list({
      limit: 50,
      // Supabase handles user filtering via RLS
    });

    store.commit("setContracts", contractsList);
    isLoading.value = false;
  } catch (error) {
    console.error("Error fetching contracts:", error);
    isLoading.value = false;
  }
};

const fetchEtchPackets = async (contractId) => {
  try {
    // Use Supabase EtchAPI instead of GraphQL
    const etchPackets = await EtchAPI.list(contractId);
    store.commit("setEtchPackets", { items: etchPackets });
  } catch (error) {
    console.error("Error fetching etch packets:", error);
  }
};

const loadingContractId = ref(null);

const selectContract = async (contract) => {
  try {
    loadingContractId.value = contract.id;
    console.log("Selected contract:", contract);
    store.dispatch("selectContract", contract);

    await fetchEtchPackets(contract.id);

    router.push({ name: "ContractDashboard", params: { id: contract.id } });
  } catch (error) {
    console.error("Error selecting contract:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to load contract details",
      life: 3000,
    });
  } finally {
    loadingContractId.value = null;
  }
};

const deleteSelectedContract = async (contractId) => {
  confirm.require({
    message: "Are you sure you want to delete this contract?",
    header: "Confirmation",
    icon: "pi pi-exclamation-triangle",
    acceptClass: "p-button-danger",
    accept: async () => {
      try {
        // Use Supabase ContractAPI to delete contract
        await ContractAPI.delete(contractId);
        store.commit("removeContract", contractId);
        toast.add({
          severity: "success",
          summary: "Contract Deleted",
          detail: "The contract has been successfully deleted.",
          life: 3000,
        });
      } catch (error) {
        console.error("Error deleting contract:", error);
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "An error occurred while deleting the contract.",
          life: 3000,
        });
      }
    },
  });
};

onMounted(async () => {
  try {
    // Get current user from Supabase
    const currentUser = await AuthService.getUser();
    if (currentUser) {
      user.value = currentUser;
      store.commit("resetStore");
      const accountId = await fetchAccountId(currentUser.id);
      if (accountId) {
        await fetchContracts();
      } else {
        // Create account for new user
        await callCreateAccount(currentUser);
        // Set loading to false since new users won't have contracts yet
        isLoading.value = false;
      }
    } else {
      isLoading.value = false; // Ensure loading stops if there's no user
    }
  } catch (error) {
    console.error("Error in component mount:", error);
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="text-center text-xl">Contracts:</div>
  <div v-if="isLoading" class="flex justify-center items-center min-h-screen">
    <ProgressSpinner />
  </div>
  <div v-else-if="contracts.length > 0" class="flex flex-wrap">
    <div
      v-for="contract in contracts"
      :key="contract.id"
      class="w-full md:w-1/2 lg:w-1/3 p-4"
    >
      <div
        class="contract-card overflow-hidden h-full border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
        :class="{ loading: loadingContractId === contract.id }"
        @click="selectContract(contract)"
      >
        <!-- Property Image -->
        <div class="aspect-w-16 aspect-h-9 bg-gray-100">
          <img
            v-if="contract.property && contract.property.imageUrl"
            :src="contract.property.imageUrl"
            alt="Property"
            class="w-full h-48 object-cover"
          />
          <div
            v-else
            class="w-full h-48 bg-gray-200 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-16 w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="M9 22V12h6v10"
              />
            </svg>
          </div>
        </div>
        <!-- Property Details -->
        <div class="p-5">
          <h3 class="text-xl font-semibold mb-2">
            {{ contract.property?.streetAddress || "No Address Available" }}
          </h3>
          <p class="mb-4">
            {{ contract.property?.city || ""
            }}{{
              contract.property?.city && contract.property?.province
                ? ", "
                : ""
            }}{{ contract.property?.province || "" }}
            {{ contract.property?.postalCode || "" }}
          </p>
          <div class="flex justify-between items-center">
            <div class="flex items-center">
              <button class="select-button">
                Select <i class="pi pi-arrow-right ml-2"></i>
              </button>
            </div>
            <Button
              icon="pi pi-trash"
              class="p-button-text p-button-danger"
              aria-label="Delete contract"
              @click.stop="deleteSelectedContract(contract.id)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <p v-else class="text-l mb-6">No contracts found.</p>
  <div class="flex justify-center mb-12">
    <Button
      v-if="!isLoading"
      label="Start New Contract"
      class="p-button-primary text-lg p-3 px-6"
      @click="$router.push('/contracts/new')"
    />
  </div>
  <ConfirmDialog></ConfirmDialog>
  <Toast />
</template>

<style scoped>
.contract-card {
  background: #ffffff;
  color: #333333;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.contract-card h3 {
  color: #333333;
}

.contract-card p {
  color: #666666;
}

.contract-card:hover {
  transform: translateY(-5px);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.select-button {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #10b981;
  /* Updated to use the green/teal primary theme color */
  color: white;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}

.select-button:hover {
  background-color: #059669;
  /* Slightly darker shade for hover */
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

/* Dark mode specific styles */
:deep(.app-dark) .contract-card {
  background: var(--surface-card);
  border-color: var(--surface-border);
  color: var(--text-color);
}

:deep(.app-dark) .contract-card h3 {
  color: var(--text-color);
}

:deep(.app-dark) .contract-card p {
  color: var(--text-color-secondary);
}

:deep(.app-dark) .select-button {
  background-color: var(--primary-500);
  color: white;
}

:deep(.app-dark) .select-button:hover {
  background-color: var(--primary-600);
}

/* Loading state for specific contract */
.contract-card.loading {
  opacity: 0.7;
  pointer-events: none;
}
</style>

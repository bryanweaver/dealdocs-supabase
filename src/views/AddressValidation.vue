<template>
  <div class="flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-2xl bg-white rounded-lg shadow-md p-8">
      <h1
        class="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 text-center"
      >
        Property Address Verification
      </h1>

      <div class="space-y-6">
        <div class="relative">
          <!-- Search input with real-time feedback -->
          <div class="flex flex-col gap-1">
            <InputText
              :id="address"
              v-model="address"
              type="text"
              placeholder="Enter property address..."
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
              aria-label="Property address input"
              :class="{ 'border-red-400': noResultsFound }"
              autofocus
              @input="handleAddressInput"
              @keydown="handleKeyDown"
              @blur="handleBlur"
              @focus="handleFocus"
            />
            <small v-if="noResultsFound" class="text-red-500 text-sm">
              No matching addresses found. Please try a different search.
            </small>
            <small
              v-else-if="address.length > 0 && address.length < 4"
              class="text-gray-500 text-sm"
            >
              Type at least 4 characters to search
            </small>
          </div>

          <!-- Loading indicator -->
          <div v-if="isSearching" class="absolute right-3 top-3 text-gray-500">
            <i class="pi pi-spin pi-spinner"></i>
          </div>

          <!-- Dropdown results that show as user types -->
          <div
            v-if="suggestedAddresses.length > 0 && showSuggestions"
            class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
          >
            <ul class="max-h-60 overflow-auto py-1">
              <li
                v-for="(suggestion, index) in suggestedAddresses"
                :key="index"
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                :class="{ 'bg-primary-50': selectedIndex === index }"
                @click="selectAddress(suggestion)"
                @mouseenter="selectedIndex = index"
              >
                {{ suggestion.streetLine }} {{ suggestion.secondary }},
                {{ suggestion.city }}, {{ suggestion.state }}
                {{ suggestion.zipcode }}
              </li>
            </ul>
          </div>
        </div>

        <div
          v-if="verifiedAddress"
          class="bg-primary-50 p-4 rounded-lg border border-primary-200"
        >
          <div class="flex items-start gap-3">
            <div class="text-primary">
              <i class="pi pi-check-circle text-xl"></i>
            </div>
            <div>
              <p class="font-medium">Selected Address:</p>
              <p>
                {{ verifiedAddress.streetLine }}
                {{ verifiedAddress.secondary }}, {{ verifiedAddress.city }},
                {{ verifiedAddress.state }} {{ verifiedAddress.zipcode }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="verifiedAddress" class="flex justify-center">
          <PrimeButton
            label="Fetch Property Details"
            class="p-button-primary w-full sm:w-auto"
            @click="$emit('next-step')"
          >
            Fetch Property Details
            <span class="ml-2">→</span>
          </PrimeButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import * as SmartySDK from "smartystreets-javascript-sdk";
import { useStore } from "vuex";
import InputText from "primevue/inputtext";
import PrimeButton from "primevue/button";

const SmartyCore = SmartySDK.core;
const Lookup = SmartySDK.usStreet.Lookup;

// @ts-ignore
const key = import.meta.env.VITE_SMARTY_EMBEDDED_KEY;
const isLocal = import.meta.env.VITE_LOCAL_ADDRESS_VALIDATION === "true";
const credentials = new SmartyCore.SharedCredentials(key);

const clientBuilder = new SmartyCore.ClientBuilder(credentials).withLicenses([
  "us-autocomplete-pro-cloud",
]);
const client = clientBuilder.buildUsAutocompleteProClient();

// Debounce function to limit API calls
function debounce(func, delay) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

export default {
  name: "AddressValidation",
  components: {
    InputText,
    PrimeButton,
  },
  emits: ["next-step"],
  setup() {
    const store = useStore();

    return {
      store,
    };
  },
  data() {
    return {
      address: "",
      verifiedAddress: null,
      suggestedAddresses: [],
      isSearching: false,
      noResultsFound: false,
      error: null,
      addressSelected: false,
      showSuggestions: false,
      selectedIndex: -1,
      debouncedSearch: null,
    };
  },
  created() {
    // Create debounced search function on component creation
    this.debouncedSearch = debounce(this.searchAddress, 300);

    // Add click outside listener to close dropdown
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    // Clean up event listeners
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    handleAddressInput() {
      // Reset states
      this.verifiedAddress = null;
      this.addressSelected = false;
      this.noResultsFound = false;
      this.showSuggestions = true;

      // Only search if there are at least 4 characters
      if (this.address && this.address.length >= 4) {
        this.debouncedSearch();
      } else {
        // Clear suggestions if input is too short
        this.suggestedAddresses = [];
      }
    },
    handleKeyDown(event) {
      if (!this.showSuggestions || this.suggestedAddresses.length === 0) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          this.selectedIndex = Math.min(
            this.selectedIndex + 1,
            this.suggestedAddresses.length - 1,
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
          break;
        case "Enter":
          event.preventDefault();
          if (this.selectedIndex >= 0) {
            this.selectAddress(this.suggestedAddresses[this.selectedIndex]);
          }
          break;
        case "Escape":
          event.preventDefault();
          this.showSuggestions = false;
          break;
      }
    },
    handleFocus() {
      // Show suggestions again if we have results and user focuses back on input
      if (this.suggestedAddresses.length > 0 && !this.addressSelected) {
        this.showSuggestions = true;
      }
    },
    handleBlur() {
      // Use setTimeout to allow click events to register before hiding suggestions
      setTimeout(() => {
        if (!this.addressSelected) {
          this.showSuggestions = false;
        }
      }, 200);
    },
    handleClickOutside(event) {
      const isClickOutside = !event.target.closest(".relative");
      if (isClickOutside && this.showSuggestions) {
        this.showSuggestions = false;
      }
    },
    async searchAddress() {
      if (!this.address || this.address.length < 4) return;

      this.isSearching = true;
      this.suggestedAddresses = [];
      this.selectedIndex = -1;

      try {
        if (isLocal) {
          // Simulate network delay for local development
          await new Promise((resolve) => setTimeout(resolve, 500));
          this.suggestedAddresses = [
            {
              streetLine: "917 wynfield drive",
              secondary: "",
              city: "deer park",
              state: "TX",
              zipcode: "77536",
            },
            {
              streetLine: "1306 Kenwick Place",
              secondary: "",
              city: "Pasadena",
              state: "TX",
              zipcode: "77504",
            },
            {
              streetLine: "2201 Running Spring Drive",
              secondary: "",
              city: "Deer Park",
              state: "TX",
              zipcode: "77536",
            },
            {
              streetLine: "20104 Bitter Root Drive",
              secondary: "",
              city: "Porter",
              state: "TX",
              zipcode: "77365",
            },
            {
              streetLine: "5836 Cypress Cv Dr",
              secondary: "",
              city: "The Colony",
              state: "TX",
              zipcode: "75056",
            },
          ].filter(
            (addr) =>
              addr.streetLine
                .toLowerCase()
                .includes(this.address.toLowerCase()) ||
              addr.city.toLowerCase().includes(this.address.toLowerCase()),
          );
        } else {
          const lookup = new Lookup();
          lookup.maxResults = 10;
          lookup.search = this.address;
          lookup.maxCandidates = 10;
          const response = await client.send(lookup);
          this.handleSuccess(response);
        }

        // Handle if no results found
        this.noResultsFound = this.suggestedAddresses.length === 0;
      } catch (e) {
        this.error = e?.message;
        console.log(e);
        this.noResultsFound = true;
      } finally {
        this.isSearching = false;
      }
    },
    selectAddress(address) {
      this.verifiedAddress = address;
      this.addressSelected = true;
      this.showSuggestions = false;
      this.$store.commit("setVerifiedAddress", this.verifiedAddress);
    },
    handleSuccess(response) {
      this.suggestedAddresses = [];
      for (let i = 0; i < response.result.length; i++) {
        this.suggestedAddresses.push(response.result[i]);
      }
    },
    handleError(response) {
      console.log(response);
      this.noResultsFound = true;
    },
    async lookup() {
      // Legacy method, kept for backward compatibility
      this.searchAddress();
    },
  },
};
</script>

<style scoped>
@media (max-width: 640px) {
  :deep(.p-inputtext),
  :deep(.p-button) {
    border-radius: 0.5rem;
  }

  :deep(.p-dropdown) {
    width: 100%;
  }
}

.pi-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>

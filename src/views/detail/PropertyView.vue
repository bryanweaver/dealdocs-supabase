<template>
  <div class="py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl">
      <Card>
        <template #title>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
            Property Details
          </h1>
        </template>

        <template #content>
          <div v-if="loading" class="text-center py-12">
            <ProgressSpinner class="mb-4" />
            <p class="text-lg text-gray-600">Loading property details...</p>
          </div>

          <div v-else>
            <div v-if="propertyData" class="space-y-6">
              <!-- Address and Image side by side container -->
              <div
                class="flex flex-col md:flex-row md:items-start md:space-x-6 space-y-4 md:space-y-0"
              >
                <div class="md:flex-1">
                  <div
                    class="address-container bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                  >
                    <div class="flex items-start">
                      <div class="flex-shrink-0 mt-1 mr-3 text-primary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1113.314 0z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h2
                          class="text-xl sm:text-2xl font-bold text-gray-900 leading-tight"
                        >
                          {{ propertyData.streetAddress }}
                        </h2>
                        <p class="text-gray-600 text-lg mt-1">
                          {{ propertyData.city }}, {{ propertyData.state }}
                          {{ propertyData.postalCode }}
                        </p>
                        <!-- Price displayed prominently -->
                        <div class="mt-2 mb-2">
                          <span class="text-2xl font-bold text-primary"
                            >${{
                              propertyData.mostRecentPriceAmount ||
                              propertyData.price
                            }}</span
                          >
                        </div>
                        <div class="flex mt-3 items-center space-x-2">
                          <span
                            v-if="propertyData.mlsNumber"
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                          >
                            MLS# {{ propertyData.mlsNumber }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="propertyData.imageUrl" class="md:flex-1">
                  <div
                    class="overflow-hidden rounded-lg shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md"
                  >
                    <img
                      :src="propertyData.imageUrl"
                      class="w-full h-auto object-cover rounded-lg transform transition-transform duration-300 hover:scale-105"
                      alt="Property"
                    />
                  </div>
                </div>
              </div>

              <!-- Listing Agent Card -->
              <div
                v-if="listingAgentData"
                class="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 mb-4"
              >
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-10 w-10 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-lg text-gray-900">
                      Listed by:
                      <span class="text-primary">{{
                        listingAgentData.listingAssociateName
                      }}</span>
                    </p>
                    <p class="text-gray-600">
                      {{ listingAgentData.firmName }}
                    </p>
                    <div class="mt-2 flex space-x-4">
                      <a
                        v-if="listingAgentData.listingAssociatePhone"
                        :href="`tel:${listingAgentData.listingAssociatePhone}`"
                        class="text-primary hover:text-primary-dark text-sm flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        {{
                          formatPhoneNumber(
                            listingAgentData.listingAssociatePhone,
                          )
                        }}
                      </a>
                      <a
                        v-if="listingAgentData.listingAssociateEmail"
                        :href="`mailto:${listingAgentData.listingAssociateEmail}`"
                        class="text-primary hover:text-primary-dark text-sm flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        {{ listingAgentData.listingAssociateEmail }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                <!-- Property Details Card -->
                <div
                  class="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200"
                >
                  <h3 class="font-semibold text-gray-900 mb-4 text-lg">
                    Property Details
                  </h3>
                  <dl class="space-y-3 sm:space-y-4">
                    <div class="flex flex-col sm:flex-row sm:justify-between">
                      <dt class="text-gray-600 mb-1 sm:mb-0">MLS Number</dt>
                      <dd class="font-medium text-gray-900">
                        {{ propertyData.mlsNumber }}
                      </dd>
                    </div>
                    <div class="flex flex-col sm:flex-row sm:justify-between">
                      <dt class="text-gray-600 mb-1 sm:mb-0">Subdivision</dt>
                      <dd class="font-medium text-gray-900">
                        {{ propertyData.subdivision }}
                      </dd>
                    </div>
                    <div class="flex flex-col sm:flex-row sm:justify-between">
                      <dt class="text-gray-600 mb-1 sm:mb-0">Year Built</dt>
                      <dd class="font-medium text-gray-900">
                        {{ propertyData.yearBuilt }}
                      </dd>
                    </div>
                    <div class="flex flex-col sm:flex-row sm:justify-between">
                      <dt class="text-gray-600 mb-1 sm:mb-0">County</dt>
                      <dd class="font-medium text-gray-900">
                        {{ propertyData.county }}
                      </dd>
                    </div>
                  </dl>
                </div>

                <!-- Property Specifications Card -->
                <div
                  class="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200"
                >
                  <h3 class="font-semibold text-gray-900 mb-4 text-lg">
                    Property Specifications
                  </h3>
                  <dl class="space-y-3 sm:space-y-4">
                    <div class="flex flex-col sm:flex-row sm:justify-between">
                      <dt class="text-gray-600 mb-1 sm:mb-0">Bedrooms</dt>
                      <dd class="font-medium text-gray-900">
                        {{ propertyData.numBedroom }}
                      </dd>
                    </div>
                    <div class="flex flex-col sm:flex-row sm:justify-between">
                      <dt class="text-gray-600 mb-1 sm:mb-0">Bathrooms</dt>
                      <dd class="font-medium text-gray-900">
                        {{ propertyData.numBathroom }}
                      </dd>
                    </div>
                    <div class="flex flex-col sm:flex-row sm:justify-between">
                      <dt class="text-gray-600 mb-1 sm:mb-0">Floors</dt>
                      <dd class="font-medium text-gray-900">
                        {{ propertyData.numFloor }}
                      </dd>
                    </div>
                    <div class="flex flex-col sm:flex-row sm:justify-between">
                      <dt class="text-gray-600 mb-1 sm:mb-0">Living Area</dt>
                      <dd class="font-medium text-gray-900">
                        {{ propertyData.floorSizeValue }}
                        {{ propertyData.floorSizeUnit }}
                      </dd>
                    </div>
                    <div class="flex flex-col sm:flex-row sm:justify-between">
                      <dt class="text-gray-600 mb-1 sm:mb-0">Lot Size</dt>
                      <dd class="font-medium text-gray-900">
                        {{ propertyData.lotSizeValue }}
                        {{ propertyData.lotSizeUnit }}
                      </dd>
                    </div>
                    <div class="flex flex-col sm:flex-row sm:justify-between">
                      <dt class="text-gray-600 mb-1 sm:mb-0">List Price</dt>
                      <dd class="font-medium text-gray-900">
                        ${{ propertyData.price }}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <!-- Property Description Card -->
              <div
                v-if="propertyData.description"
                class="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200"
              >
                <h3 class="font-semibold text-gray-900 mb-4 text-lg">
                  Property Description
                </h3>
                <p class="text-gray-600">
                  {{ propertyData.description }}
                </p>
              </div>
            </div>

            <div v-else class="bg-danger-50 p-6 rounded-lg">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg
                    class="h-5 w-5 text-danger"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293-1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-danger-800">
                    No property data found.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script lang="ts">
import ProgressSpinner from "primevue/progressspinner";
import Card from "primevue/card";

export default {
  name: "PropertyView",
  components: {
    ProgressSpinner,
    Card,
  },
  data() {
    return {
      loading: true,
      propertyData: null,
      listingAgentData: null,
    };
  },
  computed: {
    contractId() {
      return this.$route.params.id;
    },
  },
  mounted() {
    this.loadPropertyData();
  },
  methods: {
    async loadPropertyData() {
      try {
        this.loading = true;
        // Get property data from Vuex store based on the current contract
        const formData = this.$store.state.formData;

        console.log("Form data from store:", formData);

        if (formData && formData.property) {
          this.propertyData = formData.property;
          this.listingAgentData = formData.listingAgent;

          console.log("Property data loaded:", this.propertyData);
          console.log("Agent data loaded:", this.listingAgentData);
        } else {
          console.error("No property data found in store");
        }
      } catch (error) {
        console.error("Error loading property data:", error);
      } finally {
        this.loading = false;
      }
    },

    // Format phone number for display
    formatPhoneNumber(phoneNumber) {
      if (!phoneNumber) return "";

      // Remove any non-digit characters
      const cleaned = ("" + phoneNumber).replace(/\D/g, "");

      // Check if it's a valid US number (10 digits)
      if (cleaned.length === 10) {
        return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`;
      } else if (cleaned.length === 11 && cleaned.charAt(0) === "1") {
        // Handle 11 digit numbers starting with 1 (US country code)
        return `(${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7, 11)}`;
      }
      // If not a standard format, return as is
      return phoneNumber;
    },
  },
};
</script>

<style scoped>
@media (max-width: 640px) {
  /* Stack dt/dd pairs vertically on mobile */
  dl div {
    margin-bottom: 1rem;
  }

  /* Increase text size for better readability */
  dt {
    font-size: 0.875rem;
  }

  dd {
    font-size: 1rem;
  }

  /* Add more breathing room between sections */
  .space-y-8 > * + * {
    margin-top: 2rem;
  }
}

/* Ensure consistent card styling */
.bg-gray-50 {
  border: 1px solid #e5e7eb;
}
</style>

<template>
  <div class="px-6 py-8">
    <h1 class="text-2xl font-semibold mb-6">Real Estate Agent Directory</h1>

    <!-- Admin Tools Section -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-medium">Directory Tools</h2>
        <div class="flex space-x-2">
          <button
            class="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 flex items-center"
            :disabled="loading"
            @click="refreshDashboard"
          >
            <svg
              v-if="loading"
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>{{ loading ? "Refreshing..." : "Refresh Data" }}</span>
          </button>
        </div>
      </div>
      <div
        v-if="statusMessage"
        class="mt-4 p-3 rounded-md"
        :class="
          statusSuccess
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        "
      >
        {{ statusMessage }}
      </div>
    </div>

    <!-- Dashboard Summary Section -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-xl font-medium mb-4">Agent Counts by Source</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="source in dashboardSources"
          :key="source.key"
          class="bg-gray-50 rounded-lg p-4 shadow flex flex-col items-center cursor-pointer hover:bg-blue-50"
          @click="filterBySource(source.key)"
        >
          <div class="text-lg font-semibold mb-2">{{ source.label }}</div>
          <div class="text-3xl font-bold text-blue-700">
            {{ dashboardCounts[source.key] ?? "—" }}
          </div>
        </div>
      </div>
    </div>

    <!-- Search Section -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="mb-4">
        <div class="flex items-center mb-2 border-b border-gray-200">
          <button
            :class="[
              'px-4 py-2 focus:outline-none',
              searchTab === 'exact'
                ? 'border-b-2 border-blue-600 font-semibold text-blue-700'
                : 'text-gray-600',
            ]"
            @click="searchTab = 'exact'"
          >
            Exact Name
          </button>
          <button
            :class="[
              'ml-2 px-4 py-2 focus:outline-none',
              searchTab === 'scan'
                ? 'border-b-2 border-blue-600 font-semibold text-blue-700'
                : 'text-gray-600',
            ]"
            @click="searchTab = 'scan'"
          >
            Scan
          </button>
        </div>
        <!-- Exact Name Search -->
        <div v-if="searchTab === 'exact'" class="flex gap-4 items-end mt-4">
          <input
            v-model="exactNameQuery"
            type="text"
            placeholder="Enter exact agent name..."
            class="w-full p-2 border border-gray-300 rounded-md"
            @keyup.enter="runExactNameSearch"
          />
          <button
            :disabled="loading || !exactNameQuery.trim()"
            class="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="runExactNameSearch"
          >
            <span v-if="loading && searchTab === 'exact'">
              <svg
                class="animate-spin h-5 w-5 inline-block mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Searching...
            </span>
            <span v-else>Search</span>
          </button>
        </div>
        <!-- Scan Search -->
        <div v-if="searchTab === 'scan'" class="flex gap-4 items-end mt-4">
          <input
            v-model="scanQuery"
            type="text"
            placeholder="Scan by partial name..."
            class="w-full p-2 border border-gray-300 rounded-md"
            @keyup.enter="runScanSearch"
          />
          <button
            :disabled="scanning || !scanQuery.trim()"
            class="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="runScanSearch"
          >
            <span v-if="scanning">
              <svg
                class="animate-spin h-5 w-5 inline-block mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Scanning...
            </span>
            <span v-else>Scan</span>
          </button>
          <button
            v-if="scanning"
            class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md shadow hover:bg-gray-400 ml-2"
            @click="stopScan"
          >
            Stop Scan
          </button>
        </div>
      </div>

      <!-- Active Filters -->
      <div
        v-if="selectedSource || hasActiveFilters"
        class="mt-4 flex flex-wrap gap-2"
      >
        <div
          v-if="selectedSource"
          class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
        >
          Source: {{ getSourceLabel(selectedSource) }}
          <button
            class="ml-1 text-blue-700 hover:text-blue-900"
            @click="clearSource"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <button
          v-if="hasActiveFilters || selectedSource"
          class="text-sm text-gray-600 hover:text-gray-800 underline"
          @click="clearAllFilters"
        >
          Clear all filters
        </button>
      </div>

      <!-- Loading Indicator -->
      <div v-if="searching" class="mt-4 text-blue-600">
        Searching for agents...
      </div>

      <!-- Search Results -->
      <div v-if="searchResults.length > 0" class="mt-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">
            Search Results ({{ searchResults.length }})
          </h3>
          <div class="flex items-center">
            <label class="text-sm mr-2">Sort by:</label>
            <select
              v-model="sortOption"
              class="border rounded p-1 text-sm"
              @change="sortResults"
            >
              <option value="name">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="agency">Agency (A-Z)</option>
              <option value="date-desc">Newest First</option>
              <option value="date">Oldest First</option>
            </select>
          </div>
        </div>

        <div class="bg-white rounded-lg border overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Agency
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Contact Info
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Source
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="agent in searchResults"
                :key="agent.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="font-medium text-gray-900">
                    {{ agent.name || "Unknown" }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ agent.agencyName || "N/A" }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm">
                    <div
                      v-if="agent.emailAddresses && agent.emailAddresses.length"
                      class="mb-1 truncate max-w-xs"
                    >
                      <a
                        :href="`mailto:${agent.emailAddresses[0]}`"
                        class="text-blue-600 hover:underline"
                      >
                        {{ agent.emailAddresses[0] }}
                      </a>
                    </div>
                    <div
                      v-if="agent.phoneNumbers && agent.phoneNumbers.length"
                      class="text-gray-600"
                    >
                      <a
                        :href="`tel:${agent.phoneNumbers[0]}`"
                        class="hover:underline"
                      >
                        {{ formatPhoneNumber(agent.phoneNumbers[0]) }}
                      </a>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getSourceClass(agent.source)"
                  >
                    {{ agent.source || "Unknown" }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    class="text-indigo-600 hover:text-indigo-900"
                    @click="showAgentDetails(agent)"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- No Results Message -->
      <div
        v-if="!loading && searchResults.length === 0 && searchedOnce"
        class="mt-6 p-8 text-center text-gray-500 border rounded-lg"
      >
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 class="mt-2 text-lg font-medium">No agents found</h3>
        <p class="mt-1 text-sm">
          Try adjusting your search terms or filters to find what you're looking
          for.
        </p>
        <button
          class="mt-4 text-blue-600 hover:text-blue-800"
          @click="clearAllFilters"
        >
          Clear all filters and try again
        </button>
      </div>
    </div>

    <!-- Agent Details Modal -->
    <div
      v-if="selectedAgent"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
      >
        <div class="p-6 border-b">
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-semibold">Agent Details</h3>
            <button
              class="text-gray-400 hover:text-gray-500"
              @click="selectedAgent = null"
            >
              <svg
                class="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="text-lg font-medium mb-4">Basic Information</h4>
              <dl class="space-y-2">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Name</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ selectedAgent.name || "Not provided" }}
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Agency</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ selectedAgent.agencyName || "Not provided" }}
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">
                    Email Addresses
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    <ul
                      v-if="
                        selectedAgent.emailAddresses &&
                        selectedAgent.emailAddresses.length
                      "
                      class="list-disc pl-5"
                    >
                      <li
                        v-for="(email, idx) in selectedAgent.emailAddresses"
                        :key="idx"
                      >
                        <a
                          :href="`mailto:${email}`"
                          class="text-blue-600 hover:underline"
                          >{{ email }}</a
                        >
                      </li>
                    </ul>
                    <span v-else>Not provided</span>
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">
                    Phone Numbers
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    <ul
                      v-if="
                        selectedAgent.phoneNumbers &&
                        selectedAgent.phoneNumbers.length
                      "
                      class="list-disc pl-5"
                    >
                      <li
                        v-for="(phone, idx) in selectedAgent.phoneNumbers"
                        :key="idx"
                      >
                        <a :href="`tel:${phone}`" class="hover:underline">{{
                          formatPhoneNumber(phone)
                        }}</a>
                      </li>
                    </ul>
                    <span v-else>Not provided</span>
                  </dd>
                </div>
              </dl>
            </div>
            <div>
              <h4 class="text-lg font-medium mb-4">Additional Information</h4>
              <dl class="space-y-2">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Profile URL</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    <a
                      v-if="selectedAgent.profileUrl"
                      :href="selectedAgent.profileUrl"
                      target="_blank"
                      class="text-blue-600 hover:underline break-all"
                    >
                      {{ selectedAgent.profileUrl }}
                    </a>
                    <span v-else>Not provided</span>
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Source</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ selectedAgent.source || "Not provided" }}
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Import Date</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{
                      formatDate(selectedAgent.importDate, "YYYY-MM-DD") ||
                      "Unknown"
                    }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div class="mt-6">
            <h4 class="text-lg font-medium mb-4">Raw Metadata</h4>
            <div class="bg-gray-50 p-4 rounded overflow-auto max-h-60">
              <pre class="text-xs">{{ prettyMetadata }}</pre>
            </div>
          </div>
        </div>
        <div class="p-6 border-t flex justify-end">
          <button
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md shadow hover:bg-gray-300"
            @click="selectedAgent = null"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from "vue";
import { useStore } from "vuex";
import { generateClient } from "aws-amplify/api";
import { formatDate } from "@/utils/dateUtils";
import debounce from "lodash/debounce";

// Direct query for agent counts by source
const getAgentCountsBySourceQuery = /* GraphQL */ `
  query GetAgentCountsBySource($source: String!) {
    listListingAgentContactInfos(
      filter: { source: { eq: $source } }
      limit: 1
    ) {
      items {
        id
      }
      nextToken
    }
  }
`;

// Query for search
const searchAgentsQuery = /* GraphQL */ `
  query SearchAgents(
    $filter: ModelListingAgentContactInfoFilterInput
    $limit: Int
  ) {
    listListingAgentContactInfos(filter: $filter, limit: $limit) {
      items {
        id
        name
        agencyName
        profileUrl
        phoneNumbers
        emailAddresses
        source
        importDate
        metaData
        createdAt
        updatedAt
      }
    }
  }
`;

// Add the new scan query for Lambda-backed scan
const scanListingAgentContactInfosQuery = /* GraphQL */ `
  query ScanListingAgentContactInfos(
    $query: String!
    $limit: Int
    $nextToken: String
  ) {
    scanListingAgentContactInfos(
      query: $query
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        agencyName
        profileUrl
        phoneNumbers
        emailAddresses
        source
        importDate
        metaData
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export default {
  name: "AgentDirectory",
  setup() {
    const store = useStore();
    const loading = ref(false);
    const statusMessage = ref("");
    const statusSuccess = ref(true);
    const searchQuery = ref("");
    const searchResults = ref([]);
    const selectedAgent = ref(null);
    const client = generateClient();
    const manualCounts = ref({});
    const dashboardSources = [
      { key: "homes.com", label: "Homes.com" },
      { key: "realtor.com", label: "Realtor.com" },
      { key: "remax.com", label: "Remax.com" },
      { key: "data2_part1", label: "Data2 (Part 1)" },
      { key: "data2_part2", label: "Data2 (Part 2)" },
      { key: "other", label: "Other" },
    ];

    // Advanced search features
    const showAdvancedSearch = ref(false);
    const advancedSearch = ref({
      name: "",
    });
    const selectedSource = ref("");
    const sortOption = ref("name");
    const searching = ref(false);
    const searchedOnce = ref(false);

    // --- New state for search tabs and scan streaming ---
    const searchTab = ref("exact");
    const exactNameQuery = ref("");
    const scanQuery = ref("");
    const scanning = ref(false);
    let scanCancelToken = { cancelled: false };

    // Computed properties for UI state
    const hasAdvancedSearchCriteria = computed(() => {
      return Object.values(advancedSearch.value).some(
        (val) => val.trim().length > 0,
      );
    });

    const hasActiveFilters = computed(() => {
      return hasAdvancedSearchCriteria.value;
    });

    // Combined dashboard counts
    const dashboardCounts = computed(() => {
      const storeCounts = store.getters.getAgentContactCounts || {};
      return {
        ...storeCounts,
        ...manualCounts.value,
      };
    });

    // Pretty print metadata
    const prettyMetadata = computed(() => {
      if (!selectedAgent.value || !selectedAgent.value.metaData) return "";
      try {
        const metadata = JSON.parse(selectedAgent.value.metaData);
        return JSON.stringify(metadata, null, 2);
      } catch (e) {
        return selectedAgent.value.metaData;
      }
    });

    // Helper function to get source label by key
    const getSourceLabel = (sourceKey) => {
      const source = dashboardSources.find((s) => s.key === sourceKey);
      return source ? source.label : sourceKey;
    };

    // Function to get appropriate CSS class for source tags
    const getSourceClass = (source) => {
      const sourceKey = source?.toLowerCase() || "unknown";
      const colorMap = {
        "homes.com": "bg-green-100 text-green-800",
        "realtor.com": "bg-blue-100 text-blue-800",
        "remax.com": "bg-red-100 text-red-800",
        data2_part1: "bg-purple-100 text-purple-800",
        data2_part2: "bg-indigo-100 text-indigo-800",
        other: "bg-gray-100 text-gray-800",
        unknown: "bg-gray-100 text-gray-800",
      };

      return colorMap[sourceKey] || "bg-gray-100 text-gray-800";
    };

    // Toggle advanced search
    const toggleAdvancedSearch = () => {
      showAdvancedSearch.value = !showAdvancedSearch.value;
    };

    // Filter by source (used when clicking on source cards)
    const filterBySource = (source) => {
      selectedSource.value = source;
      if (showAdvancedSearch.value) {
        runAdvancedSearch();
      } else {
        runSearch();
      }
    };

    // Clear source filter
    const clearSource = () => {
      selectedSource.value = "";
    };

    // Clear all filters
    const clearAllFilters = () => {
      selectedSource.value = "";
      searchQuery.value = "";
      Object.keys(advancedSearch.value).forEach((key) => {
        advancedSearch.value[key] = "";
      });
      searchResults.value = [];
      searchedOnce.value = false;
    };

    // Sort results
    const sortResults = () => {
      switch (sortOption.value) {
        case "name":
          searchResults.value.sort((a, b) =>
            (a.name || "").localeCompare(b.name || ""),
          );
          break;
        case "name-desc":
          searchResults.value.sort((a, b) =>
            (b.name || "").localeCompare(a.name || ""),
          );
          break;
        case "agency":
          searchResults.value.sort((a, b) =>
            (a.agencyName || "").localeCompare(b.agencyName || ""),
          );
          break;
        case "date":
          searchResults.value.sort((a, b) => {
            const dateA = a.importDate || a.createdAt || "";
            const dateB = b.importDate || b.createdAt || "";
            return dateA.localeCompare(dateB);
          });
          break;
        case "date-desc":
          searchResults.value.sort((a, b) => {
            const dateA = a.importDate || a.createdAt || "";
            const dateB = b.importDate || b.createdAt || "";
            return dateB.localeCompare(dateA);
          });
          break;
      }
    };

    // Fetch counts directly from DynamoDB for each source
    const fetchManualCounts = async () => {
      loading.value = true;
      statusMessage.value = "Fetching agent counts directly from database...";

      try {
        for (const source of dashboardSources) {
          // Try exact match first
          try {
            await client.graphql({
              query: getAgentCountsBySourceQuery,
              variables: { source: source.key },
            });

            // Use the count from scan
            const countResp = await client.graphql({
              query: searchAgentsQuery,
              variables: {
                filter: { source: { eq: source.key } },
                limit: 999, // Higher limit to get more accurate count
              },
            });

            if (countResp.data?.listListingAgentContactInfos?.items) {
              manualCounts.value[source.key] =
                countResp.data.listListingAgentContactInfos.items.length;
              console.log(
                `Found ${manualCounts.value[source.key]} agents for source "${source.key}"`,
              );
            }
          } catch (e) {
            console.error(`Error fetching counts for ${source.key}:`, e);
          }

          // Try case-insensitive match as fallback
          try {
            const uppercaseResp = await client.graphql({
              query: searchAgentsQuery,
              variables: {
                filter: { source: { eq: source.key.toUpperCase() } },
                limit: 999,
              },
            });

            if (
              uppercaseResp.data?.listListingAgentContactInfos?.items?.length >
              0
            ) {
              manualCounts.value[source.key] =
                (manualCounts.value[source.key] || 0) +
                uppercaseResp.data.listListingAgentContactInfos.items.length;
              console.log(
                `Added ${uppercaseResp.data.listListingAgentContactInfos.items.length} agents with uppercase source "${source.key.toUpperCase()}"`,
              );
            }

            const capitalizedResp = await client.graphql({
              query: searchAgentsQuery,
              variables: {
                filter: {
                  source: {
                    eq:
                      source.key.charAt(0).toUpperCase() + source.key.slice(1),
                  },
                },
                limit: 999,
              },
            });

            if (
              capitalizedResp.data?.listListingAgentContactInfos?.items
                ?.length > 0
            ) {
              manualCounts.value[source.key] =
                (manualCounts.value[source.key] || 0) +
                capitalizedResp.data.listListingAgentContactInfos.items.length;
              console.log(
                `Added ${capitalizedResp.data.listListingAgentContactInfos.items.length} agents with capitalized source "${source.key.charAt(0).toUpperCase() + source.key.slice(1)}"`,
              );
            }
          } catch (e) {
            console.error(
              `Error fetching alternative case counts for ${source.key}:`,
              e,
            );
          }
        }

        // Check for any other source values
        try {
          const otherSourcesResp = await client.graphql({
            query: searchAgentsQuery,
            variables: {
              filter: {
                and: dashboardSources
                  .filter((s) => s.key !== "other")
                  .map((s) => ({
                    source: { ne: s.key },
                  })),
              },
              limit: 999,
            },
          });

          if (otherSourcesResp.data?.listListingAgentContactInfos?.items) {
            const otherSources = new Set();
            otherSourcesResp.data.listListingAgentContactInfos.items.forEach(
              (item) => {
                if (item.source) otherSources.add(item.source);
              },
            );

            console.log("Found other source values:", Array.from(otherSources));
            manualCounts.value["other"] =
              otherSourcesResp.data.listListingAgentContactInfos.items.length;
          }
        } catch (e) {
          console.error("Error fetching other sources:", e);
        }

        // Also get a total count
        try {
          const totalResp = await client.graphql({
            query: searchAgentsQuery,
            variables: { limit: 1 },
          });

          console.log(
            "Sample item:",
            totalResp.data?.listListingAgentContactInfos?.items?.[0],
          );
        } catch (e) {
          console.error("Error fetching sample item:", e);
        }

        statusMessage.value = "Agent counts fetched directly from database.";
        statusSuccess.value = true;
        // Commit manualCounts to Vuex store so dashboard uses the correct values
        store.commit("setAgentContactCounts", { ...manualCounts.value });
      } catch (e) {
        console.error("Error in manual count fetch:", e);
        statusMessage.value = "Error fetching counts: " + e.message;
        statusSuccess.value = false;
      } finally {
        loading.value = false;
        setTimeout(() => (statusMessage.value = ""), 5000);
      }
    };

    // Fetch counts for each source using Vuex action (original method)
    const fetchDashboardCounts = async () => {
      loading.value = true;
      try {
        await store.dispatch("fetchAgentContactCounts", {
          client,
          sources: dashboardSources.map((s) => s.key),
        });
        console.log("Store counts:", store.getters.getAgentContactCounts);

        // If store counts are all zero, try manual fetch
        const storeCounts = store.getters.getAgentContactCounts || {};
        const allZero = Object.values(storeCounts).every(
          (count) => count === 0,
        );

        if (allZero) {
          console.log("All store counts are zero, trying manual fetch...");
          await fetchManualCounts();
        }
      } catch (e) {
        console.error("Error in fetchDashboardCounts:", e);
      } finally {
        loading.value = false;
      }
    };

    // Build a filter for search
    const buildSearchFilter = (query = null) => {
      const filters = [];
      if (query && query.trim().length >= 2) {
        const queryFilters = [
          { name: { contains: query } },
          { name: { contains: query.toLowerCase() } },
          {
            name: { contains: query.charAt(0).toUpperCase() + query.slice(1) },
          },
        ];
        filters.push({ or: queryFilters });
      }
      if (filters.length === 0) {
        return null;
      }
      return { and: filters };
    };

    // Build filter for advanced search
    const buildAdvancedFilter = () => {
      const filters = [];
      if (advancedSearch.value.name.trim()) {
        const name = advancedSearch.value.name.trim();
        filters.push({
          or: [
            { name: { contains: name } },
            { name: { contains: name.toLowerCase() } },
            {
              name: { contains: name.charAt(0).toUpperCase() + name.slice(1) },
            },
          ],
        });
      }
      if (filters.length === 0) {
        return null;
      }
      return { and: filters };
    };

    // Basic search function
    const runSearch = async () => {
      if (!searchQuery.value.trim() && !selectedSource.value) {
        searchResults.value = [];
        searchedOnce.value = true;
        return;
      }

      loading.value = true;
      searching.value = true;
      searchedOnce.value = true;

      try {
        const filter = buildSearchFilter(searchQuery.value);
        console.log("Search Query:", searchQuery.value);
        console.log("Constructed Filter:", JSON.stringify(filter, null, 2));

        // If we have no filter and no source, don't run the search
        if (!filter && !selectedSource.value) {
          searchResults.value = [];
          return;
        }

        const resp = await client.graphql({
          query: searchAgentsQuery,
          variables: { filter, limit: 100 }, // Increased limit for better results
        });

        console.log("Raw search response:", resp);

        if (resp.data?.listListingAgentContactInfos?.items) {
          searchResults.value = resp.data.listListingAgentContactInfos.items;
          sortResults(); // Sort the results based on current sort option
        } else {
          searchResults.value = [];
        }
      } catch (e) {
        console.error("Search error:", e);
        searchResults.value = [];
        statusMessage.value =
          "Search failed: " + (e.message || "Unknown error");
        statusSuccess.value = false;
        setTimeout(() => (statusMessage.value = ""), 5000);
      } finally {
        loading.value = false;
        searching.value = false;
      }
    };

    // Advanced search function
    const runAdvancedSearch = async () => {
      if (!hasAdvancedSearchCriteria.value && !selectedSource.value) {
        searchResults.value = [];
        searchedOnce.value = true;
        return;
      }

      loading.value = true;
      searching.value = true;
      searchedOnce.value = true;

      try {
        const filter = buildAdvancedFilter();

        if (!filter) {
          searchResults.value = [];
          return;
        }

        const resp = await client.graphql({
          query: searchAgentsQuery,
          variables: { filter, limit: 100 },
        });

        if (resp.data?.listListingAgentContactInfos?.items) {
          searchResults.value = resp.data.listListingAgentContactInfos.items;
          sortResults(); // Sort the results based on current sort option
        } else {
          searchResults.value = [];
        }
      } catch (e) {
        console.error("Advanced search error:", e);
        searchResults.value = [];
        statusMessage.value =
          "Search failed: " + (e.message || "Unknown error");
        statusSuccess.value = false;
        setTimeout(() => (statusMessage.value = ""), 5000);
      } finally {
        loading.value = false;
        searching.value = false;
      }
    };

    // --- Exact Name Search (GSI Query) ---
    const runExactNameSearch = async () => {
      if (!exactNameQuery.value.trim()) return;
      loading.value = true;
      searching.value = true;
      searchedOnce.value = true;
      searchResults.value = [];
      try {
        // Use Amplify client to call a custom query that uses the name-index
        // You may need to implement this in your backend if not present
        const resp = await client.graphql({
          query: /* GraphQL */ `
            query ListByName($name: String!) {
              listListingAgentContactInfosByName(name: $name) {
                items {
                  id
                  name
                  agencyName
                  profileUrl
                  phoneNumbers
                  emailAddresses
                  source
                  importDate
                  metaData
                  createdAt
                  updatedAt
                }
              }
            }
          `,
          variables: { name: exactNameQuery.value.trim() },
        });
        const items =
          resp.data?.listListingAgentContactInfosByName?.items || [];
        searchResults.value = items;
        sortResults();
      } catch (e) {
        console.error("Exact name search error:", e);
        searchResults.value = [];
        statusMessage.value =
          "Exact name search failed: " + (e.message || "Unknown error");
        statusSuccess.value = false;
        setTimeout(() => (statusMessage.value = ""), 5000);
      } finally {
        loading.value = false;
        searching.value = false;
      }
    };

    // --- Scan Search (Streaming) ---
    const runScanSearch = async () => {
      if (!scanQuery.value.trim() || scanQuery.value.trim().length < 2) {
        console.warn("Scan query must be at least 2 characters.");
        statusMessage.value =
          "Please enter at least 2 characters for scan search.";
        statusSuccess.value = false;
        setTimeout(() => (statusMessage.value = ""), 3000);
        return;
      }
      scanning.value = true;
      searching.value = true;
      searchedOnce.value = true;
      searchResults.value = [];
      scanCancelToken.cancelled = false;
      let nextToken = null;
      try {
        do {
          if (scanCancelToken.cancelled) break;
          // Use the new Lambda-backed scan query
          const resp = await client.graphql({
            query: scanListingAgentContactInfosQuery,
            variables: {
              query: scanQuery.value,
              limit: 50,
              nextToken,
            },
          });
          if (scanCancelToken.cancelled) break; // <-- ADD THIS CHECK
          const items = resp.data?.scanListingAgentContactInfos?.items || [];
          searchResults.value.push(...items);
          sortResults();
          nextToken = resp.data?.scanListingAgentContactInfos?.nextToken;
        } while (nextToken && !scanCancelToken.cancelled);
      } catch (e) {
        if (!scanCancelToken.cancelled) {
          console.error("Scan search error:", e);
          statusMessage.value =
            "Scan search failed: " + (e.message || "Unknown error");
          statusSuccess.value = false;
          setTimeout(() => (statusMessage.value = ""), 5000);
        }
      } finally {
        scanning.value = false;
        searching.value = false;
      }
    };
    const stopScan = () => {
      scanCancelToken.cancelled = true;
      scanning.value = false;
      searching.value = false;
    };

    // Create debounced search function
    const debouncedSearch = debounce(() => {
      if (searchQuery.value.trim().length >= 2 || selectedSource.value) {
        runSearch();
      }
    }, 500);

    // Refresh dashboard
    const refreshDashboard = async () => {
      loading.value = true;
      try {
        await fetchDashboardCounts();
        statusMessage.value = "Dashboard refreshed.";
        statusSuccess.value = true;
      } catch (e) {
        statusMessage.value =
          "Failed to refresh stats: " + (e.message || "Unknown error");
        statusSuccess.value = false;
        console.error("Error refreshing dashboard:", e);
      } finally {
        loading.value = false;
        setTimeout(() => (statusMessage.value = ""), 3000);
      }
    };

    // Show agent details
    const showAgentDetails = (agent) => {
      selectedAgent.value = agent;
    };

    // Format phone number (simple US format)
    const formatPhoneNumber = (phone) => {
      if (!phone) return "";
      // Remove non-digits
      const digits = phone.replace(/\D/g, "");
      if (digits.length === 10) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
      }
      if (digits.length === 11 && digits[0] === "1") {
        return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
      }
      return phone;
    };

    // Watch for sort option changes
    watch(sortOption, () => {
      if (searchResults.value.length > 0) {
        sortResults();
      }
    });

    // On mount, only fetch counts if store is empty. Always listen for import-completed events to refresh if needed.
    onMounted(() => {
      const storeCounts = store.getters.getAgentContactCounts || {};
      const hasCounts = Object.values(storeCounts).some((count) => count > 0);
      if (!hasCounts) {
        fetchDashboardCounts();
      }
      document.addEventListener("agent-import-completed", refreshDashboard);
    });

    return {
      loading,
      statusMessage,
      statusSuccess,
      searchQuery,
      searchResults,
      selectedAgent,
      dashboardCounts,
      dashboardSources,
      showAdvancedSearch,
      advancedSearch,
      selectedSource,
      sortOption,
      searching,
      searchedOnce,
      hasAdvancedSearchCriteria,
      hasActiveFilters,
      runSearch,
      runAdvancedSearch,
      debouncedSearch,
      toggleAdvancedSearch,
      filterBySource,
      clearSource,
      clearAllFilters,
      sortResults,
      getSourceLabel,
      getSourceClass,
      showAgentDetails,
      refreshDashboard,
      formatPhoneNumber,
      formatDate,
      prettyMetadata,
      searchTab,
      exactNameQuery,
      scanQuery,
      scanning,
      runExactNameSearch,
      runScanSearch,
      stopScan,
    };
  },
};
</script>

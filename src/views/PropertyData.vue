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
            <p class="text-lg text-gray-600">
              Searching property records for<br />
              <span class="font-medium">{{ formattedAddress }}</span>
            </p>
          </div>

          <div v-else>
            <!-- No Results Found Message -->
            <div
              v-if="errorInfo && errorInfo.type === 'NO_RESULTS'"
              class="text-center py-12"
            >
              <div
                class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6"
              >
                <svg
                  class="h-8 w-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">
                {{ errorInfo.message }}
              </h3>
              <p class="text-gray-600 mb-6 max-w-md mx-auto">
                {{ errorInfo.details }}
              </p>
              <div class="space-y-4">
                <div
                  class="bg-gray-50 rounded-lg p-4 text-left max-w-md mx-auto"
                >
                  <p class="text-sm text-gray-700 mb-2">
                    <strong>Searched for:</strong>
                  </p>
                  <p
                    class="text-sm font-mono bg-white px-3 py-2 rounded border"
                  >
                    {{ formattedAddress }}
                  </p>
                </div>
                <div class="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    @click="$router.go(-1)"
                  >
                    <svg
                      class="mr-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Try Different Address
                  </button>
                  <button
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    @click="createContractAndNavigateWithoutData"
                  >
                    Continue Without Property Data
                    <svg
                      class="ml-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div v-else-if="propertyData" class="space-y-6">
              <div class="px-4 sm:px-6 py-4 bg-primary-50 rounded-lg">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-5 w-5 text-primary"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-primary-800">
                      Property Found!
                    </p>
                    <p
                      v-if="dataSourceMessage"
                      class="text-xs text-gray-600 mt-1"
                    >
                      {{ dataSourceMessage }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Minimal Data Warning -->
              <div
                v-if="isMinimalData"
                class="px-4 sm:px-6 py-3 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-5 w-5 text-yellow-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-yellow-800">
                      Limited property data available
                    </p>
                    <p class="text-xs text-yellow-700 mt-1">
                      This property may be new or not available in public
                      records. Some details may be missing.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Property Images Gallery at the top -->
              <div class="mb-8">
                <PropertyImageGallery 
                  :images="propertyData.imageUrls || propertyData.imageURLs || (propertyData.imageUrl ? [propertyData.imageUrl] : [])"
                />
              </div>

              <!-- Property Info Bar -->
              <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 class="text-2xl sm:text-3xl font-bold text-gray-900">
                      {{ propertyData.address }}
                    </h2>
                    <p class="text-gray-600 text-lg mt-1">
                      {{ propertyData.city }}, {{ propertyData.province }}
                      {{ propertyData.postalCode }}
                    </p>
                  </div>
                  <div class="flex flex-col md:items-end gap-2">
                    <div>
                      <span
                        v-if="propertyData.mostRecentPriceAmount"
                        class="text-3xl font-bold text-primary"
                      >${{ propertyData.mostRecentPriceAmount.toLocaleString() }}</span>
                      <span v-else class="text-2xl font-bold text-gray-500">
                        Price not available
                      </span>
                    </div>
                    <div>
                      <span
                        v-if="isPropertyForSale(propertyData)"
                        class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800"
                      >
                        <i class="pi pi-tag mr-1"></i>
                        For Sale
                      </span>
                      <span
                        v-else
                        class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                      >
                        <i class="pi pi-check mr-1"></i>
                        Sold
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Listing Agent Card - Moved up to be more prominent -->
              <div
                v-if="listingAgent && listingAgent.listingAssociateName"
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
                        listingAgent.listingAssociateName
                      }}</span>
                    </p>
                    <p class="text-gray-600">
                      {{ listingAgent.firmName }}
                    </p>
                    <div class="mt-2 flex space-x-4">
                      <a
                        v-if="listingAgent.listingAssociatePhone"
                        :href="`tel:${listingAgent.listingAssociatePhone}`"
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
                          formatPhoneNumber(listingAgent.listingAssociatePhone)
                        }}
                      </a>
                      <a
                        v-if="listingAgent.listingAssociateEmail"
                        :href="`mailto:${listingAgent.listingAssociateEmail}`"
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
                        {{ listingAgent.listingAssociateEmail }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-8 sm:space-y-12">
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
                          <span v-if="propertyData.mostRecentPriceAmount"
                            >${{ propertyData.mostRecentPriceAmount }}</span
                          >
                          <span v-else>Not available</span>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <!-- Property Description Card -->
                <div
                  v-if="propertyData.descriptions[0]?.value"
                  class="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200"
                >
                  <h3 class="font-semibold text-gray-900 mb-4 text-lg">
                    Property Description
                  </h3>
                  <p class="text-gray-600">
                    {{ propertyData.descriptions[0].value }}
                  </p>
                </div>

                <!-- Recorded Transactions Card -->
                <div
                  v-if="
                    propertyData.transactions &&
                    propertyData.transactions.length > 0
                  "
                  class="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200"
                >
                  <h3 class="font-semibold text-gray-900 mb-4 text-lg">
                    Recorded Transactions
                  </h3>
                  <div class="flow-root">
                    <ul class="-mb-8">
                      <li
                        v-for="(transaction, idx) in sortedTransactions"
                        :key="idx"
                      >
                        <div class="relative pb-8">
                          <span
                            v-if="idx !== sortedTransactions.length - 1"
                            class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          ></span>
                          <div class="relative flex space-x-3">
                            <div>
                              <span
                                class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white"
                              >
                                <svg
                                  class="h-5 w-5 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                    clip-rule="evenodd"
                                  />
                                </svg>
                              </span>
                            </div>
                            <div
                              class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4"
                            >
                              <div>
                                <p class="text-sm text-gray-900">
                                  <span class="font-medium"
                                    >{{ transaction.buyerFirstName }}
                                    {{ transaction.buyerLastName }}</span
                                  >
                                  <span class="text-gray-600">
                                    purchased the property</span
                                  >
                                </p>
                                <p
                                  v-if="transaction.documentNumber"
                                  class="mt-1 text-xs text-gray-700"
                                >
                                  Document #{{ transaction.documentNumber }}
                                </p>
                              </div>
                              <div
                                class="text-right text-sm whitespace-nowrap text-gray-500"
                              >
                                <time :datetime="transaction.saleDate">{{
                                  formatDate(transaction.saleDate)
                                }}</time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Transaction History Card -->
                <div
                  v-if="uniqueStatuses && uniqueStatuses.length > 0"
                  class="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200"
                >
                  <div class="flex items-start justify-between mb-4">
                    <h3 class="font-semibold text-gray-900 text-lg">
                      Transaction History
                    </h3>
                    <span
                      :class="[
                        isPropertyForSale(propertyData)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800',
                      ]"
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {{
                        isPropertyForSale(propertyData)
                          ? "Active Listing"
                          : "Not Currently Listed"
                      }}
                    </span>
                  </div>

                  <div class="flow-root">
                    <ul class="-mb-8">
                      <li
                        v-for="(status, statusIdx) in uniqueStatuses"
                        :key="statusIdx"
                      >
                        <div class="relative pb-8">
                          <span
                            v-if="statusIdx !== uniqueStatuses.length - 1"
                            class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          ></span>
                          <div class="relative flex space-x-3">
                            <div>
                              <span
                                :class="[getStatusColor(status.type)]"
                                class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                              >
                                <svg
                                  v-if="
                                    status.type?.toLowerCase() === 'for sale' ||
                                    status.type?.toLowerCase() === 'active'
                                  "
                                  class="h-5 w-5 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
                                  />
                                </svg>
                                <svg
                                  v-else-if="
                                    status.type?.toLowerCase() === 'sold'
                                  "
                                  class="h-5 w-5 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clip-rule="evenodd"
                                  />
                                </svg>
                                <svg
                                  v-else-if="
                                    status.type?.toLowerCase() === 'pending'
                                  "
                                  class="h-5 w-5 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                    clip-rule="evenodd"
                                  />
                                </svg>
                                <svg
                                  v-else
                                  class="h-5 w-5 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clip-rule="evenodd"
                                  />
                                </svg>
                              </span>
                            </div>
                            <div
                              class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4"
                            >
                              <div>
                                <p class="text-sm text-gray-900">
                                  {{ status.type }}
                                  <span
                                    v-if="status.isUnderContract === 'true'"
                                    class="text-gray-600"
                                    >(Under Contract)</span
                                  >
                                </p>
                                <p
                                  v-if="statusMatchesPrice(status)"
                                  class="mt-1 text-sm text-gray-700"
                                >
                                  Price: ${{
                                    propertyData.prices.find(
                                      (price) =>
                                        new Date(
                                          price.firstDateSeen,
                                        ).getTime() <=
                                          new Date(status.date).getTime() +
                                            86400000 &&
                                        new Date(
                                          price.firstDateSeen,
                                        ).getTime() >=
                                          new Date(status.date).getTime() -
                                            86400000,
                                    )?.amountMax || "Not available"
                                  }}
                                </p>
                              </div>
                              <div
                                class="text-right text-sm whitespace-nowrap text-gray-500"
                              >
                                <time :datetime="status.date">{{
                                  formatDate(status.date)
                                }}</time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-else-if="errorInfo"
              class="bg-danger-50 p-6 rounded-lg space-y-4"
            >
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <svg
                    class="h-6 w-6 text-danger"
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
                  <h3 class="text-lg font-medium text-danger-800">
                    Unable to retrieve property data
                  </h3>
                  <div class="mt-2 text-sm text-danger-700">
                    <p>
                      We encountered an error while trying to fetch the property
                      information for this address.
                    </p>
                    <p class="mt-1">
                      <strong>Error type:</strong>
                      {{ errorInfo.errorData.errorType }}
                    </p>
                    <p v-if="errorInfo.errorData.statusCode">
                      <strong>Status code:</strong>
                      {{ errorInfo.errorData.statusCode }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="mt-4 pt-4 border-t border-danger-200">
                <p class="text-sm text-gray-600 mt-1">
                  You can continue by manually entering property details, or try
                  again later.
                </p>
              </div>

              <div
                class="mt-4 bg-white p-4 rounded-md border border-gray-200 max-h-40 overflow-y-auto"
              >
                <pre class="text-xs text-gray-800 overflow-x-auto">{{
                  JSON.stringify(errorInfo.errorData, null, 2)
                }}</pre>
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

            <div class="mt-8 flex justify-center space-x-4">
              <PrimeButton
                label="Go Back"
                class="p-button-secondary"
                @click="$emit('prev-step')"
              />
              <PrimeButton
                v-if="verifiedAddress !== null"
                :label="
                  propertyData && isPropertyForSale(propertyData)
                    ? 'Continue'
                    : 'Continue Anyway'
                "
                class="p-button-primary"
                @click="
                  propertyData
                    ? createContractAndNavigate()
                    : createContractAndNavigateWithoutData()
                "
              />
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { ContractAPI, ListingAgentAPI, AgentAPI } from "@/services/api.js";
import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";
import Card from "primevue/card";
import { buildDatafinityQuery } from "@/utils/addressUtils";
import {
  mapDatafinityResponseToBrokerData,
  mapDatafinityResponseToPropertyData,
  mapDatafinityResponseToSellerData,
  isPropertyForSale,
} from "@/utils/dataMapUtils";
import {
  getPropertyDataWithFallbacks,
  getDataSourceMessage,
} from "@/utils/propertyAPIFallback.js";
import LazyImage from "@/components/LazyImage.vue";
import PropertyImageGallery from "@/components/PropertyImageGallery.vue";

const apikey = import.meta.env.VITE_DATAFINITY_API_KEY;
const propertyEndpoint = import.meta.env.VITE_DATAFINITY_API_URL;
const isLocal = import.meta.env.VITE_LOCAL_PROPERTY_DATA === "true";

// Removed generateClient - using ContractAPI instead
export default {
  name: "PropertyData",
  components: {
    PrimeButton: Button,
    ProgressSpinner,
    Card,
    LazyImage,
    PropertyImageGallery,
  },
  emits: ["prev-step"],
  data() {
    return {
      loading: false,
      propertyData: null,
      errorInfo: null,
      listingAgent: null,
      dataSource: "primary",
      isMinimalData: false,
      dataSourceMessage: null,
    };
  },
  computed: {
    verifiedAddress() {
      console.log("verifiedAddress", this.$store.state.verifiedAddress);
      return this.$store.state.verifiedAddress;
    },
    propertyDataFromStore() {
      return this.$store.state.propertyData;
    },
    formattedAddress() {
      if (this.verifiedAddress) {
        const { streetLine, secondary, city, state, zipcode } =
          this.verifiedAddress;
        return `${streetLine} ${secondary}, ${city}, ${state} ${zipcode}`;
      }
      return "";
    },
    // Sort statuses by date (most recent first) and filter out entries without dates
    sortedStatuses() {
      if (!this.propertyData?.statuses) return [];
      return [...this.propertyData.statuses]
        .filter((status) => status.date && status.date.trim() !== "") // Only include statuses with valid dates
        .sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
    },
    // Sort transactions by date (most recent first) and only include transactions with names
    sortedTransactions() {
      if (!this.propertyData?.transactions) return [];
      return [...this.propertyData.transactions]
        .filter((transaction) => {
          // Only include transactions that have buyer names
          const hasFirstName =
            transaction.buyerFirstName &&
            transaction.buyerFirstName.trim() !== "";
          const hasLastName =
            transaction.buyerLastName &&
            transaction.buyerLastName.trim() !== "";
          return hasFirstName || hasLastName;
        })
        .sort((a, b) => {
          return (
            new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()
          );
        });
    },
    // Remove duplicate statuses (same type and date) and ensure proper sorting
    uniqueStatuses() {
      if (!this.sortedStatuses) return [];
      const seen = new Set();
      return this.sortedStatuses
        .filter((status) => {
          const key = `${status.type}-${status.date}`;
          if (seen.has(key)) {
            return false;
          }
          seen.add(key);
          return true;
        })
        .sort((a, b) => {
          // Ensure the final list is properly sorted by date (newest first)
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
    },
  },
  mounted() {
    this.fetchPropertyData();
  },
  methods: {
    // Log error information for debugging
    async saveErrorToFile(errorResponse, errorType) {
      try {
        // Format the error data
        const errorData = {
          timestamp: new Date().toISOString(),
          address: this.formattedAddress,
          errorType: errorType,
          statusCode: errorResponse.status,
          statusText: errorResponse.statusText,
          responseData: errorResponse.data,
          query: this.verifiedAddress
            ? buildDatafinityQuery(this.verifiedAddress)
            : null,
        };

        // Log error information to console for debugging
        console.error(`Property data fetch failed: ${errorType}`);
        console.error("Error data:", errorData);

        // Store the error info for potential display in the UI
        this.errorInfo = {
          errorData,
        };

        return null;
      } catch (e) {
        console.error("Error logging error details:", e);
        return null;
      }
    },

    async fetchPropertyData() {
      if (this.propertyDataFromStore) {
        // Property data already exists in the store, use it
        this.propertyData = this.propertyDataFromStore;
      } else if (this.verifiedAddress) {
        this.loading = true;
        try {
          if (isLocal) {
            // Use mock data for local development
            const mockData = (await import("../config/mockJaredProperty"))
              .datafinityPropertyResponse;
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulating a delay
            this.propertyData = mockData;
          } else {
            const query = buildDatafinityQuery(this.verifiedAddress);
            console.log("formattedAddress", query);

            const response = await axios.post(
              propertyEndpoint,
              {
                query,
                format: "JSON",
                num_records: 1,
                download: false,
                view: "dealdocs_property_view",
              },
              {
                headers: {
                  Authorization: `Bearer ${apikey}`,
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
              },
            );

            // Use the new fallback system to handle no records
            const fallbackResult = await this.getPropertyDataWithFallbacks(
              this.verifiedAddress,
              response,
            );

            if (fallbackResult.success) {
              this.propertyData = fallbackResult.data;
              this.dataSource = fallbackResult.source;
              this.isMinimalData = fallbackResult.isMinimal || false;

              console.log(
                `✅ Property data found via ${fallbackResult.source}:`,
                this.propertyData,
              );

              // Show user-friendly message about data source
              if (fallbackResult.source !== "primary") {
                this.dataSourceMessage = this.getDataSourceMessage(
                  fallbackResult.source,
                );
                console.log(`ℹ️ ${this.dataSourceMessage}`);
              }
            } else {
              console.error("❌ All property data sources failed");
              await this.saveErrorToFile(
                {
                  status: "ALL_SOURCES_FAILED",
                  statusText: "No property data available from any source",
                  data: {
                    query,
                    originalRecordCount: response.data.records?.length || 0,
                    numFound: response.data.num_found || 0,
                    totalCost: response.data.total_cost || 0,
                    apiResponse: response.data,
                  },
                },
                "allSourcesFailed",
              );

              // Set error state for UI
              this.propertyData = null;
              this.errorInfo = {
                type: "NO_RESULTS",
                message: "No property records found for this address",
                details: `The property database returned 0 results for this address. This property may not be available in public records, may be too new, or the address format may not match our database records.`,
                query: query,
                apiStats: {
                  numFound: response.data.num_found || 0,
                  totalCost: response.data.total_cost || 0,
                },
              };
              this.loading = false;
              return; // Exit early since we have no data to process
            }
          }

          console.log("propertyData", this.propertyData);
          let property = mapDatafinityResponseToPropertyData(this.propertyData);
          let sellers = mapDatafinityResponseToSellerData(this.propertyData);

          // Get listing agent data and store in component
          this.listingAgent = mapDatafinityResponseToBrokerData(
            this.propertyData,
          );
          console.log("Listing agent:", this.listingAgent);

          // AGENT LOOKUP: Enhance listing agent with data from agents table
          if (this.listingAgent?.listingAssociateName) {
            await this.enhanceListingAgentFromDatabase(this.listingAgent);
          }

          // Clean listing agent data before saving to store (remove internal properties)
          const { _enhancedAgentData, ...cleanListingAgentForStore } = this.listingAgent;
          
          // Merge the mapped property data (which includes imageUrls) back into propertyData
          this.propertyData = { ...this.propertyData, ...property };
          
          // also save in vuex store
          this.$store.commit("setFormDataFromContract", {
            property,
            sellers,
            listingAgent: cleanListingAgentForStore,
          });
        } catch (error) {
          console.error("Error fetching property data:", error);

          // Determine the error type
          let errorType = "unknown";
          if (error.response) {
            // The request was made and the server responded with a status code
            console.log("Response status:", error.response.status);
            console.log("Response data:", error.response.data);

            errorType = `http${error.response.status}`;
            // Save the error response to a debug file
            await this.saveErrorToFile(error.response, errorType);
          } else if (error.request) {
            // The request was made but no response was received
            console.log("No response received:", error.request);
            errorType = "noResponse";
            await this.saveErrorToFile(
              {
                status: "REQUEST_ERROR",
                statusText: "No response received",
                data: error.request,
              },
              errorType,
            );
          } else {
            // Something happened in setting up the request
            console.log("Error setting up request:", error.message);
            errorType = "requestSetup";
            await this.saveErrorToFile(
              {
                status: "CONFIG_ERROR",
                statusText: error.message,
                data: error,
              },
              errorType,
            );
          }
        }
        this.loading = false;
      }
    },

    // Return appropriate color class based on status type
    getStatusColor(statusType) {
      if (!statusType) return "bg-gray-500";

      const status = statusType.toLowerCase();
      if (
        status.includes("for sale") ||
        status.includes("active") ||
        status.includes("new")
      ) {
        return "bg-green-500";
      } else if (status.includes("sold")) {
        return "bg-blue-500";
      } else if (status.includes("pending") || status.includes("contract")) {
        return "bg-yellow-500";
      } else if (
        status.includes("price reduced") ||
        status.includes("back on market")
      ) {
        return "bg-indigo-500";
      }

      return "bg-gray-500";
    },

    // Check if there's a price that matches this status date
    statusMatchesPrice(status) {
      if (!this.propertyData?.prices || !status?.date) return false;

      return this.propertyData.prices.some((price) => {
        const priceDate = new Date(price.firstDateSeen || price.date);
        const statusDate = new Date(status.date);

        // Look for prices within 24 hours (86400000 ms) of the status date
        return Math.abs(priceDate.getTime() - statusDate.getTime()) < 86400000;
      });
    },

    // Format date for display in transaction history
    formatDate(dateString) {
      if (!dateString) return "";

      try {
        // Create a more user-friendly format
        const date = new Date(dateString);

        // Current year - show just month and day
        const currentYear = new Date().getFullYear();
        const dateYear = date.getFullYear();

        if (dateYear === currentYear) {
          // For current year, show "May 13" format
          return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
          });
        } else {
          // For previous years, show "May 13, 2024" format
          return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }
      } catch (e) {
        console.error("Date formatting error:", e);
        return dateString; // Fallback to original string
      }
    },

    // Determine if a property is currently for sale
    isPropertyForSale(propertyData) {
      return isPropertyForSale(propertyData);
    },

    // Format phone number for display
    formatPhoneNumber(phoneNumber) {
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

    async createContractAndNavigate() {
      let property, sellers, listingAgentId = null;
      try {
        property = mapDatafinityResponseToPropertyData(this.propertyData);
        sellers = mapDatafinityResponseToSellerData(this.propertyData);

        // Get listing agent data and store in component
        this.listingAgent = mapDatafinityResponseToBrokerData(
          this.propertyData,
        );
        console.log("Listing agent for contract:", this.listingAgent);

        // AGENT LOOKUP: Enhance listing agent with data from agents table
        if (this.listingAgent?.listingAssociateName) {
          await this.enhanceListingAgentFromDatabase(this.listingAgent);
        }

        // Create listing agent record if we have listing agent data
        if (this.listingAgent && this.listingAgent.listingAssociateName) {
          // Create a clean copy without internal properties for database insertion
          const { _enhancedAgentData, ...cleanListingAgent } = this.listingAgent;
          const listingAgentRecord = await ListingAgentAPI.create(cleanListingAgent);
          listingAgentId = listingAgentRecord.id;
          console.log("Created listing agent record:", listingAgentRecord);
          console.log("Enhanced agent data available for future use:", _enhancedAgentData);
        }

        // Use the field mapping utilities for consistent data structure
        const { createContractPayload } = await import('@/utils/fieldMapUtils');
        
        const vuexFormData = {
          property: property,
          sellers: sellers,
          listingAgent: this.listingAgent
        };
        
        const contractData = createContractPayload(vuexFormData, {
          user_id: this.$store.state.userId,
          listing_agent_id: listingAgentId,
          status: 'draft',
          created_at: new Date().toISOString()
        });

        const response = await ContractAPI.create(contractData);

        // Save the created contract ID in the Vuex store
        this.$store.commit("setContractId", response.id);

        // Clean listing agent data before saving to store (remove internal properties)
        const { _enhancedAgentData, ...cleanListingAgentForStore } = this.listingAgent;
        
        // Save in vuex store using the proper contract structure
        this.$store.commit("setFormDataFromContract", {
          property,
          sellers,
          listingAgent: cleanListingAgentForStore,
        });

        // Navigate to the "/QuestionFlow" route
        this.$router.replace({
          name: "FormPage",
          params: {
            id: response.id,
            sectionId: "buyers",
          },
        });
      } catch (error) {
        console.error("Error creating contract:", error);
        console.error("Error details:", {
          message: error.message,
          errors: error.errors,
          response: error.response,
          data: error.data,
        });
        // Log the variables being sent
        console.error("Contract creation variables:", {
          accountId: this.$store.state.accountId,
          property,
          sellers,
          listingAgent: this.listingAgent,
        });
        // Log property details to see dateAdded value
        console.error("Property details:", property);
        // Handle error scenario
      }
    },
    // Import the fallback functions as methods
    getPropertyDataWithFallbacks,
    getDataSourceMessage,

    async createContractAndNavigateWithoutData() {
      try {
        // Use the field mapping utilities even for minimal contract creation
        const { createContractPayload } = await import('@/utils/fieldMapUtils');
        
        const contractData = createContractPayload({}, {
          user_id: this.$store.state.userId,
          status: 'draft',
          created_at: new Date().toISOString()
        });

        const response = await ContractAPI.create(contractData);
        console.log("Contract created without data:", response);

        // Save the created contract ID in the Vuex store
        this.$store.commit("setContractId", response.id);

        // Navigate to the "/QuestionFlow" route
        this.$router.replace({
          name: "FormPage",
          params: {
            id: response.id,  // Fixed: use response.id directly
            sectionId: "buyers",
          },
        });
      } catch (error) {
        console.error("Error creating contract without data:", error);
        // Handle error scenario
      }
    },

    // AGENT ENHANCEMENT: Search agents table and enhance listing agent data
    async enhanceListingAgentFromDatabase(listingAgent) {
      try {
        console.log("🔍 Looking up agent in database:", listingAgent.listingAssociateName);

        // Search for agents by name, also try searching by firm name as fallback
        const searchResults = await AgentAPI.search(listingAgent.listingAssociateName, 5);
        console.log("🔍 Agent search results:", searchResults);

        if (searchResults && searchResults.length > 0) {
          // Find best match - exact name match preferred
          const exactMatch = searchResults.find(agent => 
            agent.name?.toLowerCase() === listingAgent.listingAssociateName?.toLowerCase()
          );
          
          const bestMatch = exactMatch || searchResults[0];
          console.log("✅ Found agent match:", bestMatch);

          // ENHANCE the listing agent with database information
          if (bestMatch.phone && !listingAgent.listingAssociatePhone) {
            listingAgent.listingAssociatePhone = bestMatch.phone;
            console.log("📞 Added phone:", bestMatch.phone);
          }

          if (bestMatch.email && !listingAgent.listingAssociateEmail) {
            listingAgent.listingAssociateEmail = bestMatch.email;
            console.log("📧 Added email:", bestMatch.email);
          }

          if (bestMatch.license_number && !listingAgent.listingAssociateLicenseNumber) {
            listingAgent.listingAssociateLicenseNumber = bestMatch.license_number;
            console.log("📋 Added license:", bestMatch.license_number);
          }

          if (bestMatch.mls_id && !listingAgent.mlsId) {
            listingAgent.mlsId = bestMatch.mls_id;
            console.log("🏠 Added MLS ID:", bestMatch.mls_id);
          }

          // Store the agent database record for later use when creating listing_agents table record
          listingAgent._enhancedAgentData = bestMatch;
          console.log("💾 Stored enhanced agent data for later use");

        } else {
          console.log("ℹ️ No agent matches found in database");
        }

      } catch (error) {
        // Fail silently as requested - don't break the flow if agent lookup fails
        console.log("⚠️ Agent lookup failed (continuing silently):", error.message);
      }
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

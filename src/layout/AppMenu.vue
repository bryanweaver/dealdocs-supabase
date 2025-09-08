<script setup>
import { ref, computed, reactive, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import AppMenuItem from "./AppMenuItem.vue";
import { useStore } from "vuex";
import { useLayout } from "@/layout/composables/layout";
import { isUserInAdminGroup } from "@/utils/authUtils";

const store = useStore();
const route = useRoute();
const { onMenuToggle, layoutState } = useLayout();
// const auth = useAuthenticator();

// Add state to track admin status
const isAdmin = ref(false);

// Check admin status when component mounts
onMounted(async () => {
  isAdmin.value = await isUserInAdminGroup();
});

const contractId = computed(() => store.state.contractId);

// Determine if we are on any data page (forms or questions)
const isDataPage = computed(() => {
  return route.path.includes("forms") || route.path.includes("questions");
});

// Note the change here: we use route.params.sectionId (not slug) per your router.
const currentSectionSlug = computed(() => route.params.sectionId || "");

// Group definitions
const propertyAndParties = [
  { name: "Property", slug: "property" },
  { name: "Buyers", slug: "buyers" },
  { name: "Sellers", slug: "sellers" },
  { name: "Homeowner Association", slug: "homeownersAssociationAddendum" },
  { name: "Residential Lease", slug: "leases" },
];

const titleAndSurvey = [
  { name: "Title", slug: "title" },
  { name: "Title Objections", slug: "titleObjections" },
  { name: "Title Notices", slug: "titleNotices" },
  { name: "Survey", slug: "survey" },
  { name: "Property Condition", slug: "propertyCondition" },
];

const termsFinanceAndClosing = [
  { name: "Finance", slug: "finance" },
  { name: "Buyer Provisions", slug: "buyerProvisions" },
  { name: "Closing", slug: "closing" },
  { name: "Possession", slug: "possession" },
  { name: "Broker Disclosure", slug: "brokerDisclosure" },
  { name: "Buyer Notices", slug: "buyerNotices" },
  { name: "Attorney", slug: "buyerAttorney" },
  { name: "Listing Agent", slug: "listingAgent" },
];

const referrals = [
  { name: "Lender Referral", slug: "lenderReferral" },
  { name: "Title Referral", slug: "titleReferral" },
];

// Helper to check if referrals section should be visible
const showReferralsSection = computed(() => {
  return (
    !!contractId.value &&
    (store.state.formData.finance?.wantsLenderReferral === true ||
      store.state.formData.title?.wantsTitleReferral === true)
  );
});

// Helper to indicate if a section is complete.
const getSectionComplete = (sectionId) => {
  if (!contractId.value) return false;
  // const sectionData = store.state.formData[sectionId];
  // console.debug(`Checking section ${sectionId}:`, {
  //   hasData: !!sectionData,
  //   data: sectionData,
  //   isComplete: store.getters.isSectionComplete(sectionId),
  // });
  return store.getters.isSectionComplete(sectionId);
};

const referralsItems = computed(() =>
  referrals.map((section) => {
    // Determine visibility based on the specific referral type
    let isVisible = false;

    if (section.slug === "lenderReferral") {
      isVisible = store.state.formData.finance?.wantsLenderReferral === true;
    } else if (section.slug === "titleReferral") {
      isVisible = store.state.formData.title?.wantsTitleReferral === true;
    }

    return {
      slug: section.slug,
      icon: "pi pi-fw pi-flag text-primary",
      label: section.name,
      to: `/contracts/${contractId.value}/forms/${section.slug}`,
      visible: isVisible,
    };
  }),
);

// Create computed properties for each section's menu items
const propertyAndPartiesItems = computed(() =>
  propertyAndParties.map((section) => ({
    slug: section.slug,
    icon: getSectionComplete(section.slug)
      ? "pi pi-fw pi-check-square text-primary"
      : "pi pi-fw pi-exclamation-circle text-yellow-500",
    label: section.name,
    to: `/contracts/${contractId.value}/forms/${section.slug}`,
    visible: !!contractId.value,
  })),
);

const titleAndSurveyItems = computed(() =>
  titleAndSurvey.map((section) => ({
    slug: section.slug,
    icon: getSectionComplete(section.slug)
      ? "pi pi-fw pi-check-square text-primary"
      : "pi pi-fw pi-exclamation-circle text-yellow-500",
    label: section.name,
    to: `/contracts/${contractId.value}/forms/${section.slug}`,
    visible: !!contractId.value,
  })),
);

const termsFinanceAndClosingItems = computed(() =>
  termsFinanceAndClosing.map((section) => ({
    slug: section.slug,
    icon: getSectionComplete(section.slug)
      ? "pi pi-fw pi-check-square text-primary"
      : "pi pi-fw pi-exclamation-circle text-yellow-500",
    label: section.name,
    to: `/contracts/${contractId.value}/forms/${section.slug}`,
    visible: !!contractId.value,
  })),
);

// Improve the active group computation to be more robust
const computeActiveGroup = () => {
  if (!isDataPage.value || !currentSectionSlug.value) return "";

  // Log for debugging
  console.log("Current section slug:", currentSectionSlug.value);

  if (propertyAndParties.some((s) => s.slug === currentSectionSlug.value))
    return "Property & Parties";
  if (titleAndSurvey.some((s) => s.slug === currentSectionSlug.value))
    return "Title & Survey";
  if (termsFinanceAndClosing.some((s) => s.slug === currentSectionSlug.value))
    return "Terms, Finance & Closing";
  if (referrals.some((s) => s.slug === currentSectionSlug.value))
    return "Referrals";
  return "";
};

const activeGroup = ref(computeActiveGroup());

// Now use these computed properties in your model
const model = reactive([
  {
    label: "All Contracts",
    icon: "pi pi-fw pi-list text-blue-500", // Changed from left arrow to list icon with blue color
    class: "all-contracts-item", // Added custom class for styling
    to: "/contracts",
    visible: computed(() => !!contractId.value),
    expanded: false,
    items: null,
  },
  {
    label: "Dashboard",
    icon: "pi pi-fw pi-chart-bar text-primary", // Changed from pi-home to pi-chart-bar for better dashboard representation
    class: "dashboard-menu-item", // Added custom class for styling
    to: computed(() => `/contracts/${contractId.value}`),
    visible: computed(() => !!contractId.value),
    expanded: false,
    items: null,
  },
  {
    label: "Property Details",
    icon: "pi pi-fw pi-home text-blue-500",
    class: "property-details-item",
    to: computed(() => `/contracts/${contractId.value}/property-details`),
    visible: computed(() => !!contractId.value),
    expanded: false,
    items: null,
  },
  {
    label: "Agents",
    icon: "pi pi-fw pi-users text-green-500",
    class: "agents-menu-item",
    visible: computed(() => isAdmin.value), // Check if user is in admin group
    expanded: false,
    items: [
      {
        label: "Directory",
        icon: "pi pi-fw pi-table text-green-500",
        to: "/agents",
        visible: true,
      },
    ],
  },
  {
    label: "Property & Parties",
    visible: computed(() => !!contractId.value),
    expanded: false,
    items: propertyAndPartiesItems,
  },
  {
    label: "Title & Survey",
    visible: computed(() => !!contractId.value),
    expanded: false,
    items: titleAndSurveyItems,
  },
  {
    label: "Terms, Finance & Closing",
    visible: computed(() => !!contractId.value),
    expanded: false,
    items: termsFinanceAndClosingItems,
  },
  {
    label: "Referrals",
    visible: showReferralsSection,
    expanded: true,
    items: referralsItems,
  },
]);

// Add this computed property to check if any menu items are visible
const anyMenuItemVisible = computed(() => {
  return model.some((item) => {
    if (!item.visible) return false;
    // For items with subitems, check if any subitems are visible
    if (item.items && Array.isArray(item.items.value)) {
      return item.items.value.some((subItem) => subItem.visible);
    }
    return true;
  });
});

// Add a ref to track previous visibility state
const previousMenuVisibility = ref(false);

// Watch for changes to the anyMenuItemVisible property
watch(
  anyMenuItemVisible,
  (isVisible, oldVisible) => {
    console.log("Menu visibility changed:", isVisible);

    // If no items are visible and the menu is currently active, collapse it
    if (!isVisible) {
      // Only toggle if the menu is currently active
      if (
        layoutState.staticMenuMobileActive ||
        layoutState.overlayMenuActive ||
        !layoutState.staticMenuDesktopInactive
      ) {
        onMenuToggle();
      }
    }
    // If items become visible and the menu is currently collapsed, expand it
    // BUT only if we have a contract selected
    else if (isVisible && !oldVisible && contractId.value) {
      // Only toggle if the menu is currently collapsed
      if (
        !layoutState.staticMenuMobileActive &&
        !layoutState.overlayMenuActive &&
        layoutState.staticMenuDesktopInactive
      ) {
        onMenuToggle();
      }
    }

    // Update previous visibility state
    previousMenuVisibility.value = isVisible;
  },
  { immediate: true },
);

// When the route changes, update the expanded property and force reactivity
watch(
  [() => route.path, () => currentSectionSlug.value],
  () => {
    const newActiveGroup = computeActiveGroup();
    console.log("Active group changed to:", newActiveGroup);

    activeGroup.value = newActiveGroup;

    // Force reactivity by creating a new array reference
    model.forEach((group) => {
      // Skip "All Contracts", "Dashboard", and "Referrals" - keep Referrals always expanded
      if (
        group.label !== "All Contracts" &&
        group.label !== "Dashboard" &&
        group.label !== "Referrals"
      ) {
        // Only set expanded true for the active group
        group.expanded = group.label === newActiveGroup;
      } else if (group.label === "Referrals") {
        // Always keep Referrals expanded when visible
        group.expanded = true;
      }
    });
  },
  { immediate: true },
);
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item.label">
      <app-menu-item
        v-if="!item.separator && item.visible"
        :item="item"
        :index="i"
        :root="true"
      />
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style scoped>
/* Your styles here */
/* Common styling for both navigation items */
.dashboard-menu-item :deep(a),
.all-contracts-item :deep(a) {
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
}

/* Dashboard specific styling */
.dashboard-menu-item :deep(a) {
  background-color: rgba(59, 130, 246, 0.1);
  border-radius: 8px;
}

.dashboard-menu-item :deep(a:hover) {
  background-color: rgba(59, 130, 246, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.dashboard-menu-item :deep(i) {
  font-size: 1.2rem;
}

/* All Contracts specific styling */
.all-contracts-item :deep(a) {
  border-left: 3px solid #3b82f6;
  padding-left: 1rem;
}

.all-contracts-item :deep(a:hover) {
  background-color: rgba(59, 130, 246, 0.05);
  color: #3b82f6;
}

.all-contracts-item :deep(i) {
  font-size: 1.2rem;
  margin-right: 0.5rem;
}

/* Property Details specific styling */
.property-details-item :deep(a) {
  background-color: rgba(59, 130, 246, 0.05);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.property-details-item :deep(a:hover) {
  background-color: rgba(59, 130, 246, 0.15);
  transform: translateY(-2px);
}

.property-details-item :deep(i) {
  font-size: 1.2rem;
  margin-right: 0.5rem;
}
</style>

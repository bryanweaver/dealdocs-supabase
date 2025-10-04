import AppLayout from "@/layout/AppLayout.vue";
import { createRouter, createWebHashHistory } from "vue-router";
import Auth from "@/components/Auth.vue";
import { useStore } from "vuex";
import { AuthService } from "@/services/auth.js";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: AppLayout,
      name: "Home",
      meta: {
        requiresAuth: true,
        title: "DocuDeals | Real Estate Contract Management",
      },
      children: [
        // Least specific routes first
        {
          path: "/",
          redirect: "/contracts",
        },
        {
          path: "/contracts",
          name: "ContractList",
          meta: {
            requiresAuth: true,
            title: "My Contracts | DocuDeals",
          },
          component: () => import("@/views/Contracts.vue"),
        },
        {
          path: "/agents",
          name: "AgentDirectory",
          meta: {
            requiresAuth: true,
            requiresAdminGroup: true,
            title: "Agent Directory | DocuDeals",
          },
          component: () => import("@/views/AgentDirectory.vue"),
        },
        {
          path: "/contracts/new",
          name: "BeginContract",
          meta: {
            requiresAuth: true,
            title: "New Contract | DocuDeals",
          },
          component: () => import("@/views/NewContractStepper.vue"),
        },
        {
          path: "/contracts/new/address-validation",
          name: "AddressValidation",
          meta: {
            requiresAuth: true,
            title: "Property Address Verification | DocuDeals",
          },
          component: () => import("@/views/AddressValidation.vue"),
        },
        {
          path: "/contracts/new/property-data",
          name: "PropertyData",
          meta: {
            requiresAuth: true,
            title: "Property Details | DocuDeals",
          },
          component: () => import("@/views/PropertyData.vue"),
        },
        // Routes with :id parameter
        {
          path: "/contracts/:id([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})",
          name: "ContractDashboard",
          meta: {
            requiresAuth: true,
            title: "Contract Dashboard | DocuDeals",
          },
          component: () => import("@/views/ContractDashboard.vue"),
        },
        {
          path: "/contracts/:id/property-details",
          name: "PropertyDetails",
          meta: {
            requiresAuth: true,
            title: "Property Details | DocuDeals",
          },
          component: () => import("@/views/detail/PropertyView.vue"),
        },
        // Most specific routes last (with multiple parameters)
        {
          path: "/contracts/:id/forms/:sectionId",
          name: "FormPage",
          meta: {
            requiresAuth: true,
            title: "Contract Form | DocuDeals",
          },
          component: () => import("@/views/FormPage.vue"),
        },
        {
          path: "/contracts/:id/question-flow/:sectionId/:questionIndex?",
          name: "QuestionFlow",
          meta: {
            requiresAuth: true,
            title: "Contract Questions | DocuDeals",
          },
          component: () => import("@/components/QuestionFlow.vue"),
        },
        {
          path: "/contracts/:id/prepare-contract-package",
          name: "PrepareContractPackage",
          meta: {
            requiresAuth: true,
            title: "Prepare Contract | DocuDeals",
          },
          component: () => import("@/views/PrepareContractPackage.vue"),
        },
        {
          path: "/contracts/:id/upload-documents",
          name: "ContractDocuments",
          meta: {
            requiresAuth: true,
            title: "Contract Documents | DocuDeals",
          },
          component: () => import("@/views/ContractDocuments.vue"),
        },
        {
          path: "/contracts/:id/generate-contract",
          name: "GenerateContract",
          meta: {
            requiresAuth: true,
            title: "Generate Contract | DocuDeals",
          },
          component: () => import("@/views/GenerateContract.vue"),
        },
      ],
    },
    {
      path: "/auth",
      name: "auth",
      component: Auth,
      meta: {
        title: "Login | DocuDeals",
      },
    },
    {
      path: "/auth/confirm",
      name: "authConfirm",
      component: Auth,
      meta: {
        title: "Email Confirmed | DocuDeals",
        isConfirmation: true
      },
    },
    {
      path: "/forgot-password",
      name: "forgotPassword",
      component: Auth,
      meta: {
        title: "Forgot Password | DocuDeals",
        isForgotPassword: true
      },
    },
    {
      path: "/reset-password",
      name: "resetPassword",
      component: Auth,
      meta: {
        title: "Reset Password | DocuDeals",
        isPasswordReset: true
      },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const store = useStore();

  // Update document title
  if (to.meta.title) {
    document.title = to.meta.title;
  } else {
    document.title = "DocuDeals | Real Estate Contract Management";
  }

  if (to.meta.requiresAuth) {
    // Check if user is authenticated with Supabase
    const isAuthenticated = await AuthService.isAuthenticated();
    if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to auth");
      return next("/auth");
    }

    // Only check for contractId on routes that need it
    // Exclude the contract list page and new contract page from this check
    if (!["ContractList", "BeginContract"].includes(to.name)) {
      const contractId = localStorage.getItem("contractId");
      if (!contractId) {
        return next("/contracts");
      }
    }
  }

  // Check for admin group membership
  if (to.meta.requiresAdminGroup) {
    try {
      // Import and use our updated isUserInAdminGroup utility
      const { isUserInAdminGroup } = await import("@/utils/authUtils");

      // Check if the user is in the admin group
      const isAdmin = await isUserInAdminGroup();
      if (!isAdmin) {
        console.log("User is not in admin group, redirecting to contracts");
        return next("/contracts");
      }
    } catch (error) {
      console.error("Error checking user groups:", error);
      return next("/contracts");
    }
  }

  console.log("Navigation:", {
    from: {
      name: from.name,
      path: from.path,
      params: from.params,
    },
    to: {
      name: to.name,
      path: to.path,
      params: to.params,
    },
  });
  
  // Clear contract ID when navigating to contracts list or starting new contract
  if (to.name === "ContractList" || to.name === "BeginContract") {
    store.commit("setContractId", null);
  }
  // Set contract ID from route params if navigating to a contract-specific page
  else if (to.params.id && to.params.id !== store.state.contractId) {
    console.log("Setting contract ID from route:", to.params.id);
    store.commit("setContractId", to.params.id);
  }
  
  next();
});

export default router;

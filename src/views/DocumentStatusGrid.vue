<template>
  <div class="w-full mx-auto">
    <Panel class="doc-status-grid">
      <template #header>
        <h3 class="text-xl font-semibold">Required Documents</h3>
      </template>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="doc in documents" :key="doc.type" class="doc-panel">
          <div class="flex items-center gap-2 mb-3">
            <i :class="doc.icon" class="text-xl"></i>
            <span class="font-medium">{{ doc.label }}</span>
          </div>
          <div class="status-indicator mb-3">
            <i
              :class="[
                doc.isUploaded
                  ? 'pi pi-check text-green-500'
                  : 'pi pi-times text-red-500',
                'text-xl',
              ]"
            ></i>
            <span>{{ doc.isUploaded ? "Uploaded" : "Required" }}</span>
          </div>
          <PrimeButton
            :label="doc.isUploaded ? 'View' : 'Upload'"
            :icon="doc.isUploaded ? 'pi pi-eye' : 'pi pi-upload'"
            class="w-full"
            :class="doc.isUploaded ? 'p-button-outlined' : 'p-button-primary'"
            @click="handleDocAction(doc)"
          />
        </div>
      </div>
    </Panel>
  </div>
</template>

<script>
import Panel from "primevue/panel";
import Button from "primevue/button";
import { useStore } from "vuex";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "DocumentStatusGrid",
  components: { Panel, PrimeButton: Button },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const documents = computed(() => [
      {
        type: "preapproval",
        label: "Pre-Approval Letter",
        icon: "pi pi-file",
        isUploaded:
          store.getters.getUploadedDocument("preapproval")?.isUploaded,
      },
      {
        type: "earnest_check",
        label: "Earnest Money",
        icon: "pi pi-dollar",
        isUploaded: store.getters.getUploadedDocument("earnest_check")?.isUploaded,
      },
      {
        type: "option_check",
        label: "Option Fee",
        icon: "pi pi-money-bill",
        isUploaded: store.getters.getUploadedDocument("option_check")?.isUploaded,
      },
    ]);

    const handleDocAction = () => {
      router.push(`${route.path}/upload-documents`);
    };

    return {
      documents,
      handleDocAction,
    };
  },
};
</script>

<style scoped>
.doc-status-grid :deep(.p-panel-header) {
  background: transparent;
  padding: 1rem;
}

.doc-panel {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 6px;
  padding: 1rem;
  transition: all 0.2s;
}

.doc-panel:hover {
  border-color: var(--primary-color);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>

<template>
  <Panel class="progress-card">
    <div class="flex flex-col md:flex-row justify-between items-center gap-4">
      <div class="stats-container">
        <div class="stat-item">
          <i class="pi pi-check-circle text-green-500 text-2xl" />
          <div class="stat-details">
            <span class="stat-number">{{ completedSections }}/{{ totalSections }}</span>
            <span class="stat-label">Sections Complete</span>
          </div>
        </div>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: `${(completedSections / totalSections) * 100}%` }"
          />
        </div>
      </div>
    </div>
  </Panel>
</template>

<script>
import Panel from "primevue/panel";

export default {
  name: "ContractProgressCard",
  components: { Panel },
  props: {
    completedSections: {
      type: Number,
      required: true,
    },
    totalSections: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style scoped>
.progress-card :deep(.p-panel-header) {
  display: none; /* Removes the header with the arrow */
}

.stats-container {
  width: 100%;
  padding: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-details {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
}

.stat-label {
  color: var(--text-color-secondary);
}

.progress-bar {
  height: 8px;
  background: var(--surface-200);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 1rem;
}

.progress-fill {
  height: 100%;
  background: var(--primary-color);
  transition: width 0.3s ease;
}
</style>

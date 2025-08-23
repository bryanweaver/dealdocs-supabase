<template>
  <div class="card go-to-card" @click="goToForms">
    <div class="card-content">
      <div class="icon-container">
        <i class="pi pi-file-edit text-white text-3xl"></i>
      </div>
      <h2>Go to Forms</h2>
      <p class="description">Complete your contract section by section</p>
      <div class="button-container">
        <span class="action-button">
          Continue <i class="pi pi-arrow-right ml-2"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  name: "GoToFormsCard",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const contractId = ref("");

    onMounted(() => {
      contractId.value = route.params.id;
    });

    const goToForms = () => {
      const firstIncompleteSection = store.getters.getFirstIncompleteSection;
      router.push({
        name: "FormPage",
        params: {
          id: contractId.value,
          sectionId: firstIncompleteSection,
        },
      });
    };

    return {
      goToForms,
    };
  },
});
</script>

<style scoped>
.go-to-card {
  background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
  color: white;
  border-radius: 12px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  height: 240px;
  /* Changed from min-height to fixed height */
  width: 100%;
  max-width: 600px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.go-to-card:hover {
  transform: translateY(-5px);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.description {
  font-size: 0.875rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
}

.button-container {
  margin-top: auto;
}

.action-button {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.action-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.go-to-card::after {
  content: "";
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 40%;
  z-index: 0;
}
</style>

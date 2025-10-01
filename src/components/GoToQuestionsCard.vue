<template>
  <div
    class="card go-to-card"
    @click="goToQuestions"
  >
    <div class="card-content">
      <div class="icon-container">
        <i class="pi pi-question-circle text-white text-3xl" />
      </div>
      <h2>Go to Questions</h2>
      <p class="description">
        Complete your contract with guided questions
      </p>
      <div class="button-container">
        <span class="action-button">
          Continue <i class="pi pi-arrow-right ml-2" />
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
    const contractId = ref("");
    const store = useStore();

    onMounted(() => {
      contractId.value = route.params.id;
    });

    const goToQuestions = () => {
      const { sectionId, questionIndex } =
        store.getters.getFirstIncompleteQuestion;
      router.push(
        `${contractId.value}/question-flow/${sectionId}?questionIndex=${questionIndex}`,
      );
    };

    return {
      goToQuestions,
    };
  },
});
</script>

<style scoped>
.go-to-card {
  background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%);
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

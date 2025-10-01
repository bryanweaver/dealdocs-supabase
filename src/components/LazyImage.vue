<template>
  <img
    v-if="isIntersecting"
    :src="src"
    :alt="alt"
    :class="imgClass"
    @load="onLoad"
    @error="onError"
  >
  <div
    v-else
    ref="placeholder"
    :class="placeholderClass"
    :style="placeholderStyle"
  >
    <slot name="placeholder">
      <div class="animate-pulse bg-gray-200 w-full h-full rounded" />
    </slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
  imgClass: {
    type: String,
    default: "",
  },
  placeholderClass: {
    type: String,
    default: "",
  },
  threshold: {
    type: Number,
    default: 0.1,
  },
  width: {
    type: Number,
    default: null,
  },
  height: {
    type: Number,
    default: null,
  },
});

const emit = defineEmits(["load", "error"]);

const placeholder = ref();
const isIntersecting = ref(false);
const hasLoaded = ref(false);
const hasError = ref(false);

let observer = null;

const placeholderStyle = computed(() => {
  const style = {};
  if (props.width) style.width = `${props.width}px`;
  if (props.height) style.height = `${props.height}px`;
  return style;
});

const onLoad = () => {
  hasLoaded.value = true;
  emit("load");
};

const onError = (error) => {
  hasError.value = true;
  emit("error", error);
};

onMounted(() => {
  if ("IntersectionObserver" in window) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isIntersecting.value = true;
            observer?.disconnect();
          }
        });
      },
      {
        threshold: props.threshold,
      },
    );

    if (placeholder.value) {
      observer.observe(placeholder.value);
    }
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    isIntersecting.value = true;
  }
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>

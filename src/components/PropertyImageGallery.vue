<template>
  <div class="property-image-gallery">
    <div v-if="images && images.length > 0" class="gallery-container">
      <div class="main-image-container">
        <img
          :src="currentImage"
          :alt="`Property image ${currentIndex + 1}`"
          class="main-image"
          @click="showFullscreen = true"
        />
        
        <button
          v-if="images.length > 1"
          class="nav-button prev"
          @click="previousImage"
          :disabled="currentIndex === 0"
        >
          <i class="pi pi-chevron-left"></i>
        </button>
        
        <button
          v-if="images.length > 1"
          class="nav-button next"
          @click="nextImage"
          :disabled="currentIndex === images.length - 1"
        >
          <i class="pi pi-chevron-right"></i>
        </button>
        
        <div v-if="images.length > 1" class="image-counter">
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>
      </div>
      
      <div v-if="images.length > 1" class="thumbnail-container">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="thumbnail"
          :class="{ active: index === currentIndex }"
          @click="currentIndex = index"
        >
          <img :src="image" :alt="`Thumbnail ${index + 1}`" />
        </div>
      </div>
    </div>
    
    <div v-else class="no-image-placeholder">
      <div class="placeholder-content">
        <i class="pi pi-image"></i>
        <p>No property images available</p>
      </div>
    </div>
    
    <Dialog
      v-model:visible="showFullscreen"
      modal
      :dismissableMask="true"
      :showHeader="false"
      :style="{ width: '90vw', maxWidth: '1200px' }"
      class="fullscreen-dialog"
    >
      <div class="fullscreen-image-container">
        <img
          :src="currentImage"
          :alt="`Property image ${currentIndex + 1}`"
          class="fullscreen-image"
        />
        <button
          v-if="images.length > 1"
          class="fullscreen-nav prev"
          @click="previousImage"
          :disabled="currentIndex === 0"
        >
          <i class="pi pi-chevron-left"></i>
        </button>
        <button
          v-if="images.length > 1"
          class="fullscreen-nav next"
          @click="nextImage"
          :disabled="currentIndex === images.length - 1"
        >
          <i class="pi pi-chevron-right"></i>
        </button>
        <button
          class="fullscreen-close"
          @click="showFullscreen = false"
        >
          <i class="pi pi-times"></i>
        </button>
        <div class="fullscreen-counter">
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Dialog from 'primevue/dialog';

const props = defineProps<{
  images: string[]
}>();

const currentIndex = ref(0);
const showFullscreen = ref(false);

const currentImage = computed(() => {
  return props.images?.[currentIndex.value] || '';
});

const nextImage = () => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++;
  }
};

const previousImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};
</script>

<style scoped>
.property-image-gallery {
  width: 100%;
}

.gallery-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  background: #f3f4f6;
  border-radius: 0.5rem;
  overflow: hidden;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.main-image:hover {
  transform: scale(1.02);
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.nav-button:hover:not(:disabled) {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-button.prev {
  left: 1rem;
}

.nav-button.next {
  right: 1rem;
}

.image-counter {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.thumbnail-container {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.5rem 0;
}

.thumbnail {
  flex-shrink: 0;
  width: 80px;
  height: 60px;
  border-radius: 0.25rem;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.thumbnail.active {
  border-color: var(--primary-color, #10b981);
}

.thumbnail:hover {
  opacity: 0.8;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image-placeholder {
  width: 100%;
  aspect-ratio: 16/9;
  background: #f3f4f6;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-content {
  text-align: center;
  color: #9ca3af;
}

.placeholder-content i {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.placeholder-content p {
  margin: 0;
  font-size: 1rem;
}

.fullscreen-dialog :deep(.p-dialog-content) {
  padding: 0;
  background: black;
}

.fullscreen-image-container {
  position: relative;
  width: 100%;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: black;
}

.fullscreen-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.fullscreen-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.2rem;
}

.fullscreen-nav:hover:not(:disabled) {
  background: white;
}

.fullscreen-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.fullscreen-nav.prev {
  left: 2rem;
}

.fullscreen-nav.next {
  right: 2rem;
}

.fullscreen-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.2rem;
}

.fullscreen-close:hover {
  background: white;
}

.fullscreen-counter {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 1.5rem;
  font-size: 1rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .nav-button {
    width: 35px;
    height: 35px;
    font-size: 0.9rem;
  }
  
  .fullscreen-nav {
    width: 40px;
    height: 40px;
  }
  
  .fullscreen-nav.prev {
    left: 1rem;
  }
  
  .fullscreen-nav.next {
    right: 1rem;
  }
}
</style>
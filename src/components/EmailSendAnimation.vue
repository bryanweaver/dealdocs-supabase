<template>
  <Dialog
    v-model:visible="visible"
    modal
    :closable="false"
    :draggable="false"
    :style="{ width: '500px' }"
    :pt="{
      root: { class: 'email-animation-dialog' },
      content: { class: 'email-animation-dialog-content' }
    }"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <i class="pi pi-send text-blue-500"></i>
        <span class="text-lg font-semibold">Sending Your Contract Package</span>
      </div>
    </template>

    <div class="email-animation-container p-4">
          <!-- Envelope Container -->
          <div class="envelope-wrapper" :class="{ 'animate-fly': phase === 'delivery' }">
            <!-- Envelope SVG -->
            <svg
              class="envelope"
              :class="{ 'envelope-flying': phase === 'delivery' }"
              viewBox="0 0 300 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <!-- Envelope Back -->
              <rect x="10" y="40" width="280" height="150" fill="#F5E6D3" stroke="#8B6F47" stroke-width="2"/>

              <!-- Envelope Flap (animated) -->
              <g v-if="phase !== 'preparation'">
                <path
                  d="M 10 40 L 150 120 L 290 40"
                  fill="#E5D6C3"
                  stroke="#8B6F47"
                  stroke-width="2"
                  :style="{ transform: flapTransform }"
                  class="envelope-flap"
                />
              </g>

              <!-- Document inside (visible during preparation) -->
              <g v-if="phase === 'preparation' || phase === 'packaging'" class="document">
                <rect x="30" y="60" width="240" height="110" fill="white" opacity="0.9"/>
                <line x1="50" y1="80" x2="250" y2="80" stroke="#333" stroke-width="1" opacity="0.3"/>
                <line x1="50" y1="100" x2="250" y2="100" stroke="#333" stroke-width="1" opacity="0.3"/>
                <line x1="50" y1="120" x2="200" y2="120" stroke="#333" stroke-width="1" opacity="0.3"/>
                <line x1="50" y1="140" x2="230" y2="140" stroke="#333" stroke-width="1" opacity="0.3"/>
              </g>

              <!-- Wax Seal (appears after packaging) -->
              <g v-if="phase === 'addressing' || phase === 'delivery'">
                <circle cx="150" cy="140" r="25" fill="#8B0000" class="seal"/>
                <text x="150" y="147" text-anchor="middle" fill="#FFD700" font-size="20" font-weight="bold">DD</text>
              </g>

              <!-- Address (typewriter effect) -->
              <g v-if="phase === 'addressing' || phase === 'delivery'">
                <text x="150" y="90" text-anchor="middle" fill="#1e3a5f" font-size="14" class="typewriter-text">
                  To: Listing Agent
                </text>
                <text x="150" y="110" text-anchor="middle" fill="#1e3a5f" font-size="12" class="typewriter-text">
                  {{ streetAddress }}
                </text>
              </g>

              <!-- Stamp -->
              <g v-if="phase === 'addressing' || phase === 'delivery'">
                <rect x="240" y="50" width="40" height="50" fill="#4169E1" class="stamp"/>
                <text x="260" y="75" text-anchor="middle" fill="white" font-size="8">EXPRESS</text>
                <text x="260" y="85" text-anchor="middle" fill="white" font-size="8">DELIVERY</text>
              </g>
            </svg>

            <!-- Particle Trail (during delivery) -->
            <div v-if="phase === 'delivery'" class="particle-container">
              <div v-for="i in 8" :key="`particle-${i}`"
                   class="particle"
                   :style="{
                     left: `${150 - i * 20}px`,
                     top: `${100 + Math.sin(i) * 10}px`,
                     animationDelay: `${i * 0.1}s`,
                     backgroundColor: particleColors[i % particleColors.length]
                   }">
              </div>
            </div>
          </div>

          <!-- Message Display -->
          <div class="message-container">
            <p class="message-text">{{ currentMessage }}</p>

            <!-- Progress indicator -->
            <div v-if="!isError && !isSuccess" class="progress-dots">
              <span v-for="i in 3" :key="`dot-${i}`" class="progress-dot" :style="{ animationDelay: `${i * 0.2}s` }">•</span>
            </div>
          </div>

          <!-- Success Confetti -->
          <div v-if="isSuccess" class="confetti-container">
            <div v-for="i in 12" :key="`confetti-${i}`"
                 class="confetti-piece"
                 :style="{
                   left: `${Math.random() * 300}px`,
                   backgroundColor: confettiColors[i % confettiColors.length],
                   animationDelay: `${Math.random() * 0.5}s`,
                   transform: `rotate(${Math.random() * 360}deg)`
                 }">
            </div>
          </div>

      <!-- Error State -->
      <div v-if="isError" class="error-actions">
        <Button
          label="Try Again"
          icon="pi pi-refresh"
          class="p-button-danger"
          @click="$emit('retry')"
        />
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-secondary"
          @click="$emit('cancel')"
        />
      </div>
    </div>
  </Dialog>
</template>

<script>
import { defineComponent, ref, computed, watch, onMounted } from 'vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { getMessageSequence, getRandomMessage } from '@/utils/emailMessages';

export default defineComponent({
  name: 'EmailSendAnimation',
  components: {
    Button,
    Dialog
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    streetAddress: {
      type: String,
      default: 'Property Address'
    }
  },
  emits: ['complete', 'retry', 'cancel'],
  setup(props, { emit }) {
    const phase = ref('preparation');
    const currentMessage = ref('');
    const isError = ref(false);
    const isSuccess = ref(false);
    const messages = ref({});

    const particleColors = ['#FFD700', '#FF6347', '#4169E1', '#32CD32', '#FF69B4'];
    const confettiColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

    const phases = ['preparation', 'packaging', 'addressing', 'delivery'];
    const phaseDurations = {
      preparation: 1500,
      packaging: 1500,
      addressing: 1500,
      delivery: 2000
    };

    const flapTransform = computed(() => {
      if (phase.value === 'preparation') return 'rotateX(0deg)';
      if (phase.value === 'packaging') return 'rotateX(-90deg)';
      return 'rotateX(-180deg)';
    });

    const handleBackdropClick = () => {
      // Don't close on backdrop click during animation
      if (isSuccess.value || isError.value) {
        emit('cancel');
      }
    };

    const startAnimation = () => {
      // Reset state
      phase.value = 'preparation';
      isError.value = false;
      isSuccess.value = false;
      messages.value = getMessageSequence();
      currentMessage.value = messages.value.preparation;

      // Progress through phases
      let currentPhaseIndex = 0;

      const nextPhase = () => {
        currentPhaseIndex++;
        if (currentPhaseIndex < phases.length) {
          phase.value = phases[currentPhaseIndex];
          currentMessage.value = messages.value[phase.value];

          setTimeout(nextPhase, phaseDurations[phase.value]);
        } else {
          // Animation complete
          isSuccess.value = true;
          currentMessage.value = messages.value.delivery;

          // Auto-close after showing success
          setTimeout(() => {
            emit('complete');
          }, 2000);
        }
      };

      setTimeout(nextPhase, phaseDurations.preparation);
    };

    const showError = () => {
      isError.value = true;
      currentMessage.value = getRandomMessage('error');
      phase.value = 'error';
    };

    watch(() => props.visible, (newVal) => {
      if (newVal) {
        startAnimation();
      }
    });

    onMounted(() => {
      if (props.visible) {
        startAnimation();
      }
    });

    // Expose error method for parent component
    const triggerError = () => {
      showError();
    };

    return {
      phase,
      currentMessage,
      isError,
      isSuccess,
      flapTransform,
      particleColors,
      confettiColors,
      handleBackdropClick,
      triggerError
    };
  }
});
</script>

<style scoped>
@import '@/assets/animations/email-send.css';

/* Dialog customization */
:deep(.email-animation-dialog) {
  max-width: 90vw;
}

:deep(.email-animation-dialog-content) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background: white;
  overflow: visible !important;
}

.email-animation-container {
  position: relative;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: visible;
}

.envelope-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 250px;
}

.animate-fly {
  animation: flyAway 2s ease-in forwards;
}

.envelope-flap {
  transform-origin: center bottom;
  transition: transform 0.6s ease;
}

.particle-container {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.message-container {
  margin-top: 2rem;
  text-align: center;
  min-height: 60px;
}

.message-text {
  font-family: Georgia, serif;
  font-size: 1.1rem;
  color: #1e3a5f;
  font-weight: 500;
  text-align: center;
  animation: messagePulse 2s ease-in-out infinite;
}

.progress-dots {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  font-size: 1.5rem;
  color: #4169E1;
}

.progress-dot {
  animation: bounce 1s infinite;
  margin: 0 0.2rem;
}

.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 10;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

/* Override dialog mask opacity */
:deep(.p-dialog-mask) {
  background-color: rgba(0, 0, 0, 0.4) !important;
  backdrop-filter: blur(2px);
}

/* Additional responsive styles */
@media (max-width: 640px) {
  :deep(.email-animation-dialog) {
    width: 95vw !important;
  }

  .email-animation-container {
    height: 350px;
  }

  .envelope {
    width: 240px;
    height: 160px;
  }

  .message-text {
    font-size: 1rem;
    padding: 0 1rem;
  }
}
</style>
<template>
  <div>
    <!-- Show loading state while iframe loads -->
    <div v-if="isLoading" class="flex justify-center items-center h-96">
      <i class="pi pi-spinner pi-spin" style="font-size: 3rem"></i>
    </div>

    <iframe
      v-show="!isLoading && !iframeError"
      :src="signingUrl"
      width="100%"
      height="800px"
      @load="handleIFrameLoad"
      @message="handleMessage"
      @error="handleIFrameError"
      allow="clipboard-read; clipboard-write; camera; microphone"
      frameborder="0"
      referrerpolicy="origin"
    />

    <!-- Error message for CSP issues -->
    <div v-if="iframeError" class="flex flex-col items-center justify-center h-96 p-8">
      <i class="pi pi-exclamation-triangle text-6xl text-orange-500 mb-4"></i>
      <h3 class="text-xl font-semibold mb-2">Unable to Load Signing Interface</h3>
      <p class="text-gray-600 text-center mb-4 max-w-md">
        The signing interface cannot be embedded. This usually means your domain needs to be whitelisted in Anvil's API settings.
      </p>
      <div class="flex gap-3">
        <Button
          label="Open in New Tab"
          icon="pi pi-external-link"
          @click="openInNewTab"
          severity="primary"
        />
        <Button
          label="Copy Signing Link"
          icon="pi pi-copy"
          @click="copySigningLink"
          severity="secondary"
        />
      </div>
      <p class="text-sm text-gray-500 mt-4">
        Domain to whitelist: {{ currentDomain }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Button from 'primevue/button';

export default {
  components: {
    Button
  },
  props: {
    signingUrl: {
      type: String,
      required: true,
    },
    currentSigner: {
      type: String,
      required: true,
    },
  },
  emits: ["update:visible", "contract-uploaded", "signer-complete"],
  data() {
    return {
      isLoading: true,
      iframeError: false,
      processedSignerCompleteEvents: new Set(),
    };
  },
  computed: {
    currentDomain() {
      return window.location.origin;
    }
  },
  methods: {
    openInNewTab() {
      window.open(this.signingUrl, '_blank');
    },
    copySigningLink() {
      navigator.clipboard.writeText(this.signingUrl);
      // You can add a toast notification here if needed
      alert('Signing link copied to clipboard!');
    },
    handleIFrameLoad() {
      console.log("EtchSignIFrame - iframe loaded with URL:", this.signingUrl);
      this.isLoading = false;
      this.iframeError = false; // Reset error state on successful load

      // Check if the URL is an embedded signing URL
      if (this.signingUrl) {
        try {
          const url = new URL(this.signingUrl);
          console.log("EtchSignIFrame - Signing URL details:", {
            hostname: url.hostname,
            pathname: url.pathname,
            isEmbedded: url.pathname.includes('/embed/') || url.searchParams.has('embed'),
            fullUrl: this.signingUrl
          });
        } catch (e) {
          console.error("EtchSignIFrame - Error parsing URL:", e);
        }
      }
    },

    handleIFrameError(event) {
      console.error("EtchSignIFrame - iframe error:", event);
      this.isLoading = false;
      this.iframeError = true;
    },

    detectCSPError() {
      // Listen for CSP errors in the console
      const originalError = console.error;
      console.error = (...args) => {
        const message = args.join(' ');
        if (message.includes('frame-ancestors') || message.includes('Content Security Policy')) {
          console.log('EtchSignIFrame - CSP error detected');
          this.iframeError = true;
          this.isLoading = false;
        }
        originalError.apply(console, args);
      };
    },

    handleMessage({ origin, data: eventObject }) {
      if (origin !== "https://app.useanvil.com") {
        console.log("EtchSignIFrame - Ignoring message from unknown origin:", origin);
        return;
      }
      if (eventObject.action === "signerLoad") {
        // The signing UI has fully loaded
        console.log("EtchSignIFrame - signerLoad", eventObject);
        this.isLoading = false;
      } else if (eventObject.action === "signerComplete") {
        const eventHash = eventObject.etchPacketEid + eventObject.signerId;
        // A signer has finished signing
        if (this.processedSignerCompleteEvents.has(eventHash)) {
          console.log("EtchSignIFrame - Ignoring duplicate signerComplete event", eventHash);
          return;
        }
        this.processedSignerCompleteEvents.add(eventHash);
        console.log("EtchSignIFrame - signerComplete", eventObject);

        this.$emit("signer-complete", {
          event: eventObject,
        });
      } else if (eventObject.action === "signerError") {
        // A signer has experienced an error
        console.log("EtchSignIFrame - signerError", eventObject);
      }
    },
  },
  computed: {
    localVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        this.$emit("update:visible", value);
      },
    },
  },
  watch: {
    signingUrl(newUrl, oldUrl) {
      console.log("EtchSignIFrame - signingUrl changed:", {
        oldUrl,
        newUrl,
        hasNewUrl: !!newUrl
      });
      if (newUrl) {
        this.isLoading = true;
      }
    }
  },
  mounted() {
    console.log("EtchSignIFrame - mounted with signingUrl:", this.signingUrl);
    window.addEventListener("message", this.handleMessage);
    if (this.signingUrl) {
      this.isLoading = true;
      // Detect CSP errors
      this.detectCSPError();

      // Set a timeout to detect if iframe fails to load
      setTimeout(() => {
        if (this.isLoading && !this.iframeError) {
          console.warn('EtchSignIFrame - Iframe took too long to load, checking for CSP issues');
          // Check if we're still loading after 5 seconds
          this.iframeError = true;
          this.isLoading = false;
        }
      }, 5000);
    }
  },
  beforeUnmount() {
    window.removeEventListener("message", this.handleMessage);
  },
};
</script>

<style scoped>
.dialog-content {
  /* Make the iframe fill the container */
  height: inherit;
}
</style>

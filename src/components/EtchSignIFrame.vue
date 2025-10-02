<template>
  <div>
    <!-- Show loading state while iframe loads -->
    <div v-if="isLoading" class="flex justify-center items-center h-96">
      <i class="pi pi-spinner pi-spin" style="font-size: 3rem"></i>
    </div>

    <iframe
      v-show="!isLoading"
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
  </div>
</template>

<script lang="ts">
export default {
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
      processedSignerCompleteEvents: new Set(),
    };
  },
  methods: {
    handleIFrameLoad() {
      console.log("EtchSignIFrame - iframe loaded with URL:", this.signingUrl);
      this.isLoading = false;

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

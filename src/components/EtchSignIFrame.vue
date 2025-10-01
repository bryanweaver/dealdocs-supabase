<template>
  <div>
    <iframe
      :src="signingUrl"
      width="100%"
      height="800px"
      @load="handleIFrameLoad"
      @message="handleMessage"
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
  setup(props, { emit }) {
    const processedSignerCompleteEvents = new Set();

    const handleIFrameLoad = () => {
      console.log("iframe loaded");
    };

    const handleMessage = async ({ origin, data: eventObject }) => {
      if (origin !== "https://app.useanvil.com") {
        console.log("Ignoring message from unknown origin:", origin);
        return;
      }
      if (eventObject.action === "signerLoad") {
        // The signing UI has fully loaded
        console.log("signerLoad", eventObject);
      } else if (eventObject.action === "signerComplete") {
        const eventHash = eventObject.etchPacketEid + eventObject.signerId;
        // A signer has finished signing
        if (processedSignerCompleteEvents.has(eventHash)) {
          console.log("Ignoring duplicate signerComplete event", eventHash);
          return;
        }
        processedSignerCompleteEvents.add(eventHash);
        console.log("signerComplete", eventObject);

        emit("signer-complete", {
          event: eventObject,
        });
      } else if (eventObject.action === "signerError") {
        // A signer has experienced an error
        console.log("signerError", eventObject);
      }
    };

    return {
      handleIFrameLoad,
      handleMessage,
    };
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
  mounted() {
    window.addEventListener("message", this.handleMessage);
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

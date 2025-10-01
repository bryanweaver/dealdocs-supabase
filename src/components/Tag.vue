<template>
  <Tag :severity="getTagSeverity(status)">
    {{ status }}
  </Tag>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Tag from "primevue/tag";

export default defineComponent({
  name: "EtchPacketTag",
  components: {
    Tag,
  },
  props: {
    status: {
      type: String,
      required: true,
    },
  },
  methods: {
    getTagSeverity(status) {
      switch (status) {
        case "draft":
        case "authoring":
        case "sent":
          return "info";
        case "waiting for signers":
          return "warn";
        case "completed":
          return "success";
        case "cancelled":
        case "expired":
        case "declined":
          return "danger";
        default:
          return null;
      }
    },
  },
});
</script>

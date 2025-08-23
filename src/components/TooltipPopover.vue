<template>
  <div class="tooltip-popover-container">
    <i
      :id="'tooltip-trigger-' + id"
      v-ripple
      class="pi pi-question-circle tooltip-icon"
      @click="togglePopover"
    ></i>

    <Popover
      :ref="'tooltipPopover'"
      :target="'tooltip-trigger-' + id"
      class="custom-tooltip-popover"
      position="right"
    >
      <!-- Try right positioning -->
      <div class="tooltip-content">
        <slot></slot>
      </div>
    </Popover>
  </div>
</template>

<script>
import Popover from "primevue/popover";

export default {
  name: "TooltipPopover",
  components: {
    Popover,
  },
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
  },
  methods: {
    togglePopover(event) {
      const popoverRef = this.$refs.tooltipPopover;

      if (popoverRef) {
        if (Array.isArray(popoverRef)) {
          if (popoverRef[0] && typeof popoverRef[0].toggle === "function") {
            popoverRef[0].toggle(event);
          }
        } else if (typeof popoverRef.toggle === "function") {
          popoverRef.toggle(event);
        }
      }
    },
  },
};
</script>

<style>
/* Using global styles to override PrimeVue styles */
.p-popover.p-component.custom-tooltip-popover {
  background-color: #333 !important;
  color: white !important;
  border-radius: 3px !important;
  width: 180px !important;
  max-width: 180px !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
  font-weight: normal !important;
  border: 1px solid #333 !important;
}

.p-popover::before {
  display: none;
}

.custom-tooltip-popover .p-popover-content {
  padding: 0.5rem !important;
  background-color: #333 !important;
}

.tooltip-popover-container {
  display: inline-block;
  position: relative;
}

.tooltip-icon {
  color: #007ad9;
  cursor: pointer;
  font-size: 1rem;
}

.tooltip-content {
  font-size: 1rem;
  line-height: 1.3;
  text-align: left;
  color: white;
}
</style>

<style scoped></style>

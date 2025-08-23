<script setup>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
// Import the layout composable from the correct path
import { useLayout } from "@/layout/composables/layout";

const { resetMenu } = useLayout();

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  index: {
    type: Number,
    default: 0,
  },
  root: {
    type: Boolean,
    default: true,
  },
  parentItemKey: {
    type: String,
    default: null,
  },
});

const route = useRoute();

const isActiveMenu = computed(() => {
  return (
    route.path ===
    (typeof props.item.to === "string" ? props.item.to : props.item.to?.path)
  );
});

function itemClick(event, item) {
  if (item.disabled) {
    event.preventDefault();
    return;
  }
  // If on mobile, close the sidebar upon selecting a link
  if (window.innerWidth <= 991) {
    resetMenu();
  }
  // Additional click logic (if any) can be added here.
}

function checkActiveRoute(item) {
  if (!item.to) return false;
  return route.path === (typeof item.to === "string" ? item.to : item.to?.path);
}

const active = ref(props.item.items ? (props.item.expanded ? 0 : null) : null);
if (props.item.items) {
  watch(
    () => props.item.expanded,
    (newValue) => {
      active.value = newValue ? 0 : null;
    },
  );
}

// Add this computed property in script section
const itemKey = computed(() => {
  return props.parentItemKey
    ? `${props.parentItemKey}-${props.index}`
    : `${props.index}`;
});
</script>

<template>
  <li v-if="item.visible">
    <!-- If the item is a direct link -->
    <router-link
      v-if="item.to && !item.items"
      :to="
        typeof item.to === 'string' ? item.to : { path: item.to?.path || '/' }
      "
      :class="[
        'p-2 hover:surface-200 cursor-pointer transition-colors duration-200 flex align-items-center no-underline',
        { 'active-route': checkActiveRoute(item) },
        { 'active-menuitem': isActiveMenu },
      ]"
      exact-active-class="active-menuitem"
      @click="itemClick($event, item)"
    >
      <i
        v-if="item.icon"
        :class="[item.icon, 'mr-2']"
        class="layout-menuitem-icon flex items-center"
      ></i>
      <span class="layout-menuitem-text flex items-center">{{
        item.label
      }}</span>
    </router-link>

    <!-- If the item has child items, render an Accordion -->
    <Accordion v-else-if="item.items" v-model:activeIndex="active" class="mb-0">
      <AccordionTab>
        <template #header>
          <div class="flex align-items-center">
            <i
              v-if="item.icon"
              :class="[item.icon, 'mr-2']"
              class="layout-menuitem-icon"
            ></i>
            <span class="layout-menuitem-text">{{ item.label }}</span>
          </div>
        </template>
        <!-- Render the child menu items recursively -->
        <AppMenuItem
          v-for="(child, childIndex) in item.items"
          :key="childIndex"
          :item="child"
          :index="childIndex"
          :parent-item-key="itemKey"
          :root="false"
        />
      </AccordionTab>
    </Accordion>

    <!-- For simple non-link headers (if needed) -->
    <div
      v-else
      :class="[
        'p-2 hover:surface-200 cursor-pointer transition-colors duration-200 flex align-items-center no-underline',
        item.class,
        { 'active-route': checkActiveRoute(item) },
      ]"
    >
      <i
        v-if="item.icon"
        :class="[item.icon, 'mr-2']"
        class="layout-menuitem-icon"
      ></i>
      <span class="layout-menuitem-text">{{ item.label }}</span>
    </div>
  </li>
</template>

<style scoped>
.layout-menuitem-icon {
  font-size: 1.25rem;
  /* Adjust if needed */
  height: 1.25rem;
  /* Match the font-size */
  line-height: 1.25rem;
  /* Match the font-size */
}

.layout-menuitem-text {
  font-size: 1rem;
  height: 1.25rem;
  /* Match the icon height */
  line-height: 1.25rem;
  /* Match the icon height */
}

/* Add these styles for active menu highlighting */
.active-menuitem {
  font-weight: bold;
  background-color: var(--surface-200);
}

.active-route {
  font-weight: bold;
  background-color: var(--surface-200);
}
</style>

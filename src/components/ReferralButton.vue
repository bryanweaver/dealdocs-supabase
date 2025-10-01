<template>
  <button
    class="referral-btn"
    :title="description"
    @click.prevent="openLink"
  >
    <span>{{ label }}</span>
    <i class="pi pi-external-link ml-2" />
  </button>
</template>

<script>
export default {
  name: "ReferralButton",
  props: {
    label: {
      type: String,
      default: "Visit Referral Link",
    },
    url: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  methods: {
    openLink() {
      if (this.url) {
        window.open(this.url, "_blank");
      }
    },
  },
};
</script>

<style scoped>
.referral-btn {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  color: #007ad9;
  border: 1px solid #007ad9;
  border-radius: 6px;
  padding: 0.5rem 1.25rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
}
.referral-btn:hover {
  background: #007ad9;
  color: #fff;
}
</style>

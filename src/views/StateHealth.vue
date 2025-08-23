<template>
  <div>
    <h1>Diagnostic Page</h1>
    <h2>Current State Variables:</h2>
    <pre>{{ stateVariables }}</pre>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "StateHealth",
  computed: {
    ...mapState(["accountId", "contractId", "verifiedAddress", "formData"]),
    stateVariables() {
      return {
        accountId: this.accountId,
        contractId: this.contractId,
        verifiedAddress: this.verifiedAddress,
        formData: this.formData,
      };
    },
  },
};
</script>

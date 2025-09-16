<template>
  <div class="contract-documents">
    <div class="grid gap-4">
      <div class="flex flex-col gap-4">
        <DocumentUploadList
          title="Pre-Approval Letter"
          document-type="preapproval"
        />
        <DocumentUploadList
          title="Proof of Earnest Check"
          document-type="earnest_check"
        />
        <DocumentUploadList
          title="Proof of Option Fee Check"
          document-type="option_check"
        />
        <!-- <DocumentUploadList
          title="Addendum Attachments"
          documentType="addendum"
        /> -->
      </div>
      <div v-if="isCompleted" class="flex justify-center pt-2 pb-4">
        <Button
          label="Let's sign the contract!"
          class="p-button-primary"
          @click="
            $router.push(
              '/contracts/' + $route.params.id + '/generate-contract',
            )
          "
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import DocumentUploadList from "../components/DocumentUploadList.vue";

export default {
  name: "ContractDocuments",
  components: {
    DocumentUploadList,
  },
  computed: {
    isCompleted() {
      return this.$store.getters.allDocsAreUploaded;
    },
  },
};
</script>

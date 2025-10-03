<template>
  <div class="document-checklist">
    <DataView :value="documents" layout="list" data-key="name">
      <template #header>
        <h2 class="text-xl font-semibold mb-4">Document Checklist</h2>
      </template>
      <template #list="slotProps">
        <div class="flex flex-col divide-y divide-gray-200">
          <div v-for="(doc, index) in slotProps.items" :key="index">
            <div
              class="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 hover:bg-gray-50 gap-3"
            >
              <div class="flex items-center">
                <div class="font-medium text-base sm:text-lg text-gray-900">
                  {{ doc.name }}
                </div>
              </div>
              <div
                v-if="doc.exists"
                class="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs sm:text-sm w-full sm:w-auto justify-center sm:justify-start"
              >
                <i class="pi pi-check text-xs sm:text-sm"></i>
                <span
                  class="ml-2 font-medium truncate max-w-[200px] sm:whitespace-normal sm:overflow-visible sm:max-w-full"
                  >{{ doc.filename }}</span
                >
              </div>
              <div
                v-else
                class="flex items-center text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs sm:text-sm w-full sm:w-auto justify-center sm:justify-start"
              >
                <i class="pi pi-times text-xs sm:text-sm"></i>
                <span class="ml-2 font-medium">Not uploaded</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </DataView>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "DocumentChecklist",
  emits: ["checklist-status", "files-for-agent-email"],
  setup(_, { emit }) {
    const store = useStore();
    const allDocuments = ref([
      {
        name: "Residential Resale Contract",
        bucket: "etch-packets",
        formId: "residential_resale_contract",
        exists: false,
        filename: null,
        filekey: null,
      },
      {
        name: "HOA Addendum",
        bucket: "etch-packets",
        formId: "homeowners_addendum",
        exists: false,
        filename: null,
        filekey: null,
        showIf: (formData) =>
          formData.homeownersAssociationAddendum?.hasHomeownersAssociation,
      },
      {
        name: "Third Party Financing Addendum",
        bucket: "etch-packets",
        formId: "third_party_finance_addendum",
        exists: false,
        filename: null,
        filekey: null,
        showIf: (formData) =>
          formData.finance?.financingType === "BYTHIRDPARTY",
      },
      {
        name: "Lender Appraisal Termination Addendum",
        bucket: "etch-packets",
        formId: "lender_appraisal_termination_addendum",
        exists: false,
        filename: null,
        filekey: null,
        showIf: (formData) => {
          const hasThirdPartyFinancing =
            formData.finance?.financingType === "BYTHIRDPARTY";
          const loanType = formData.finance?.loanType;
          return (
            hasThirdPartyFinancing &&
            !["FHA", "VA", "VAGUARANTEED"].includes(loanType)
          );
        },
      },
      {
        name: "Pre Approval Letter",
        bucket: "preapproval",
        exists: false,
        filename: null,
        filekey: null,
      },
      {
        name: "Proof of Earnest Money Check",
        bucket: "earnest_check",
        exists: false,
        filename: null,
        filekey: null,
      },
      {
        name: "Proof of Option Fee Check",
        bucket: "option_check",
        exists: false,
        filename: null,
        filekey: null,
      },
    ]);

    // Computed property for visible documents
    const documents = ref([]);

    const updateDocumentStatus = () => {
      // Filter documents based on their showIf conditions
      const filteredDocuments = allDocuments.value.filter(
        (doc) => !doc.showIf || doc.showIf(store.state.formData),
      );

      // Update the visible documents list
      documents.value = filteredDocuments;

      filteredDocuments.forEach((doc) => {
        if (doc.bucket === "etch-packets") {
          console.log("All etch packets in store:", store.state.etchPackets);

          // Look for etch packets where ALL buyers have signed
          const completedEtchPackets = store.state.etchPackets.filter((packet) => {
            console.log("Processing packet:", JSON.stringify(packet, null, 2));

            // Check if packet has signer info - try multiple possible paths
            let signers = [];

            // Try different paths to find signers
            if (packet.documentGroup?.signers) {
              signers = packet.documentGroup.signers;
              console.log("Found signers in documentGroup.signers");
            } else if (packet.signer_info?.signers) {
              signers = packet.signer_info.signers;
              console.log("Found signers in signer_info.signers");
            } else if (Array.isArray(packet.signer_info)) {
              // Sometimes signer_info might be the array directly
              signers = packet.signer_info;
              console.log("signer_info is directly an array");
            } else if (packet.signers) {
              // Or signers might be at the top level
              signers = packet.signers;
              console.log("Found signers at top level");
            }

            if (signers.length === 0) {
              console.log("No signers found in packet:", packet);
              return false;
            }

            // Check if all signers have completed status
            const allSignersCompleted = signers.every(
              (signer) => signer.status === "completed"
            );

            console.log("Packet signer status check:", {
              packetId: packet.eid || packet.etch_packet_id,
              signerCount: signers.length,
              allCompleted: allSignersCompleted,
              signerStatuses: signers.map((s) => ({
                email: s.email || s.signerEmail || "unknown",
                status: s.status
              }))
            });

            return allSignersCompleted;
          });

          if (completedEtchPackets.length > 0) {
            const latestEtchPacket = completedEtchPackets[completedEtchPackets.length - 1];
            const signers = latestEtchPacket.documentGroup?.signers || latestEtchPacket.signer_info?.signers || [];

            // Find any uploadKey that contains the formId
            const uploadKey = signers.reduce((found, signer) => {
              if (found) return found;
              return signer.uploadKeys?.find((key) => key.includes(doc.formId));
            }, null);

            // Use upload key filename if available, otherwise use a descriptive name
            const filename = uploadKey
              ? uploadKey.split("/").pop()
              : "Residential Resale Contract (Signed).pdf";

            doc.exists = true;
            doc.filename = filename;
            doc.filekey = uploadKey || latestEtchPacket.pdf_url || latestEtchPacket.eid;
          } else {
            doc.exists = false;
            doc.filename = null;
            doc.filekey = null;
          }
          } else {
            doc.exists = false;
            doc.filename = null;
            doc.filekey = null;
          }
        } else {
          // Update this section to use the new getter
          const uploadedDoc = store.getters.getUploadedDocument(doc.bucket);
          if (uploadedDoc && uploadedDoc.isUploaded) {
            doc.exists = true;
            doc.filename = uploadedDoc.name;
            doc.filekey = uploadedDoc.key;
          } else {
            doc.exists = false;
            doc.filename = null;
            doc.filekey = null;
          }
        }
      });
      // Only check documents that should be shown based on their conditions
      const visibleDocuments = documents.value.filter(
        (doc) => !doc.showIf || doc.showIf(store.state.formData)
      );

      const allDocumentsExist = visibleDocuments.every((doc) => doc.exists);
      emit("checklist-status", allDocumentsExist);

      // Only include documents that should be shown AND exist
      emit(
        "files-for-agent-email",
        visibleDocuments.filter((doc) => doc.exists),
      );
    };

    watch(
      [
        () => store.state.uploadedDocuments,
        () => store.state.etchPackets,
        () => store.state.formData,
      ],
      () => {
        updateDocumentStatus();
      },
      { deep: true },
    );

    onMounted(async () => {
      // Load etch packets from database if not already loaded
      const contractId = store.state.contractId;
      if (contractId && (!store.state.etchPackets || store.state.etchPackets.length === 0)) {
        await store.dispatch("loadEtchPacketsForContract", contractId);
      }
      updateDocumentStatus();
    });

    return {
      documents,
    };
  },
});
</script>
<style scoped>
.document-checklist {
  margin-bottom: 20px;
}

.document-name {
  margin-right: 10px;
}

.checkmark {
  color: green;
  font-size: 20px;
}

.cross {
  color: red;
  font-size: 20px;
}
</style>

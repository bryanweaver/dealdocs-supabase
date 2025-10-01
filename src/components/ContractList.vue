<template>
  <DataTable
    v-if="etchPackets.length > 0"
    :value="etchPackets"
    row-group-mode="subheader"
    group-rows-by="etchPacketEid"
    scrollable
    scroll-height="400px"
    table-style="min-width: 50rem"
  >
    <template #groupheader="slotProps">
      <div class="flex items-center gap-2 font-bold">
        <span>Created: {{ slotProps.data.createdAt }}</span>
        <span>(ID: {{ slotProps.data.etchPacketEid }})</span>
        <PrimeButton
          class="p-button-danger p-button-text p-button-rounded ml-auto"
          icon="pi pi-trash"
          @click="confirmDelete(slotProps.data.etchPacketEid)"
        />
      </div>
    </template>
    <Column
      field="signerName"
      header="Signer"
    />
    <Column
      field="signerStatus"
      header="Status"
    >
      <template #body="slotProps">
        <Tag :status="slotProps.data.signerStatus" />
      </template>
    </Column>
    <Column header="Actions">
      <template #body="slotProps">
        <div class="flex justify-center space-x-4">
          <SignContract
            v-if="slotProps.data.signerStatus !== 'completed'"
            :key="slotProps.data.key"
            label="Sign"
            size="medium"
            :eid="slotProps.data.etchPacketEid"
          />
          <PrimeButton
            class="p-button-secondary"
            label="View"
            @click="openContract(slotProps.data)"
          />
        </div>
      </template>
    </Column>
  </DataTable>
  <Dialog
    v-model:visible="displayConfirmation"
    header="Confirmation"
    :style="{ width: '350px' }"
    :modal="true"
  >
    <div class="flex items-center justify-center">
      <i
        class="pi pi-exclamation-triangle mr-4"
        style="font-size: 2rem"
      />
      <span>Are you sure you want to proceed?</span>
    </div>
    <template #footer>
      <PrimeButton
        label="No"
        icon="pi pi-times"
        text
        severity="secondary"
        @click="displayConfirmation = false"
      />
      <PrimeButton
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        outlined
        autofocus
        @click="() => deleteContract(selectedEtchPacketEid)"
      />
    </template>
  </Dialog>
  <div class="mt-4 flex justify-center">
    <SignContract
      label="Generate New Contract"
      size="large"
    />
  </div>
</template>

<script lang="ts">
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
// import FillContract from "./FillContract.vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import PrimeButton from "primevue/button";
import { formatDate } from "@/utils/dateUtils";
import { EtchAPI, StorageAPI } from "@/services/api.js";
import Tag from "./Tag.vue";

export default {
  name: "ContractList",
  components: {
    DataTable,
    Column,
    PrimeButton,
    Tag,
  },
  setup() {
    const store = useStore();
    const contracts = ref([]);

    console.log("etchPackets", store.state.etchPackets);
    const etchPackets = computed(() => {
      return store.state.etchPackets.flatMap((packet) => {
        // Find the most recently completed signer (they'll have the latest documents)
        const completedSigners = packet.documentGroup.signers.filter(s => s.status === 'completed');
        const latestCompletedSigner = completedSigners.length > 0
          ? completedSigners.reduce((latest, current) => {
              const latestDate = latest.completedAt ? new Date(latest.completedAt) : new Date(0);
              const currentDate = current.completedAt ? new Date(current.completedAt) : new Date(0);
              return currentDate > latestDate ? current : latest;
            })
          : null;

        return packet.documentGroup.signers.map((signer) => ({
          key: `${packet.eid}-${signer.email}`,
          name: packet.name,
          createdAt: formatDate(packet.createdAt, "YYYY-MM-DD"),
          signerName: signer.name,
          signerStatus: signer.status,
          etchPacketEid: packet.eid,
          // Use the latest completed signer's documents for viewing (they have all signatures)
          // If no one has completed yet, use this signer's documents
          uploadKeys: latestCompletedSigner?.uploadKeys || signer.uploadKeys || [],
        }));
      });
    });

    console.log(etchPackets.value);
    const displayConfirmation = ref(false);
    const selectedEtchPacketEid = ref("");

    const fetchEtchPackets = async () => {
      const contractId = store.state.contractId;
      
      try {
        // Fetch etch packets from Supabase
        const etchPackets = await EtchAPI.list(contractId);
        
        // Fetch associated files from storage
        const contractsWithFiles = await Promise.all(
          etchPackets.map(async (packet) => {
            const folderPath = `accounts/${store.state.accountId}/contracts/${contractId}/etch-packets/${packet.etch_packet_id}/`;
            
            try {
              const files = await StorageAPI.list(folderPath);
              return files.map(file => ({
                key: `${folderPath}${file.name}`,
                filetype: file.name.split(".").pop().toLowerCase(),
                name: new Date(packet.created_at).toLocaleString([], {
                  year: "numeric",
                  month: "numeric", 
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                }),
                metadata: null,
                etchPacketEid: packet.etch_packet_id,
              }));
            } catch (error) {
              console.warn('No files found for packet:', packet.etch_packet_id);
              return [];
            }
          })
        );
        
        contracts.value = contractsWithFiles.flat();
        console.log("contracts", contracts.value);
      } catch (error) {
        console.error('Error fetching etch packets:', error);
      }
    };

    const openContract = async (data) => {
      // Open contract files using Supabase Storage signed URLs
      try {
        for (const uploadKey of data.uploadKeys) {
          const signedUrl = await StorageAPI.getSignedUrl(uploadKey, 'contracts', 3600);
          window.open(signedUrl, "_blank");
        }
      } catch (error) {
        console.error('Error getting signed URLs:', error);
        toast.add({
          severity: 'error',
          summary: 'Access Error',
          detail: 'Unable to access the contract files. Please try again.',
          life: 3000
        });
      }
    };

    const confirmDelete = (etchPacketEid) => {
      selectedEtchPacketEid.value = etchPacketEid;
      displayConfirmation.value = true;
    };

    const deleteEtchPacketFromDocumentDb = async (etchPacketEid) => {
      // Delete the etch packet from the store
      store.commit("deleteEtchPacket", { etchPacketEid });

      // Delete the etch packet from Supabase
      try {
        const etchPacket = await EtchAPI.getByEtchPacketId(etchPacketEid);
        if (etchPacket) {
          // In Supabase, we don't delete records, we mark them as inactive or use soft delete
          await EtchAPI.update(etchPacket.id, {
            status: 'deleted',
            deleted_at: new Date().toISOString()
          });
        }
        console.log(
          `Deleted etch packet from Supabase with eid: ${etchPacketEid}`,
        );
      } catch (err) {
        console.error(
          `Error deleting etch packet from Supabase with eid: ${etchPacketEid}`,
          err,
        );
      }
    };

    const deleteContract = async (etchPacketEid) => {
      // Delete all contracts matching this etchPacketEid from Supabase Storage
      const accountId = store.state.accountId;
      const contractId = store.state.contractId;
      const folderPath = `accounts/${accountId}/contracts/${contractId}/etch-packets/${etchPacketEid}/`;

      try {
        const files = await StorageAPI.list(folderPath);
        
        if (files.length > 0) {
          const filePaths = files.map(file => `${folderPath}${file.name}`);
          await StorageAPI.delete(filePaths, 'contracts');
        }

        console.log(
          `Deleted all contracts for etchPacketEid: ${etchPacketEid}`,
        );
      } catch (err) {
        console.error(
          `Error deleting contracts for etchPacketEid: ${etchPacketEid}`,
          err,
        );
      }

      await deleteEtchPacketFromDocumentDb(etchPacketEid);
      displayConfirmation.value = false;
    };

    onMounted(fetchEtchPackets);

    return {
      contracts,
      etchPackets,
      selectedEtchPacketEid,
      openContract,
      confirmDelete,
      deleteContract,
      fetchEtchPackets,
      displayConfirmation,
      formatDate,
    };
  },
};
</script>

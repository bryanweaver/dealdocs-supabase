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
    <Column field="signerName" header="Signer"></Column>
    <Column field="signerStatus" header="Status">
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
      <i class="pi pi-exclamation-triangle mr-4" style="font-size: 2rem" />
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
    <SignContract label="Generate New Contract" size="large" />
  </div>
</template>

<script lang="ts">
import { ref, onMounted, computed } from "vue";
import { list, remove, getUrl } from "aws-amplify/storage";
import { useStore } from "vuex";
// import FillContract from "./FillContract.vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import PrimeButton from "primevue/button";
import { formatDate } from "@/utils/dateUtils";
import { generateClient } from "aws-amplify/api";
import { deleteEtchPacket } from "@/graphql/mutations";
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
        return packet.documentGroup.signers.map((signer) => ({
          key: `${packet.eid}-${signer.email}`,
          name: packet.name,
          createdAt: formatDate(packet.createdAt, "YYYY-MM-DD"),
          signerName: signer.name,
          signerStatus: signer.status,
          etchPacketEid: packet.eid,
          uploadKeys: signer.uploadKeys,
        }));
      });
    });

    console.log(etchPackets.value);
    const displayConfirmation = ref(false);
    const selectedEtchPacketEid = ref("");

    const fetchEtchPackets = async () => {
      const accountId = store.state.accountId;
      const contractId = store.state.contractId;
      const input = {
        prefix: `accounts/${accountId}/contracts/${contractId}/etch-packets/`,
      };
      const result = await list(input);
      contracts.value = await Promise.all(
        result.items.map(async (item) => {
          const getUrlInput = {
            key: item.key,
            options: {
              validateObjectExistence: true,
              expiresIn: 3600 // 1 hour expiration
            }
          };
          const urlResult = await getUrl(getUrlInput);
          // Note: Metadata is not available via getUrl in v6
          const metadata = null;
          return {
            key: item.key,
            filetype: item.key.split(".").pop().toLowerCase(),
            name: new Date(item.lastModified).toLocaleString([], {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            }),
            metadata,
            etchPacketEid: item.key.split("etch-packets/")[1].split("/")[0],
          };
        }),
      );
      console.log("contracts", contracts.value);
    };

    const openContract = async (data) => {
      const signedUrlOutputs = await Promise.all(
        data.uploadKeys.map(async (uploadKey) => {
          return await getUrl({
            key: uploadKey,
            options: {
              validateObjectExistence: true,
            },
          });
        }),
      );

      signedUrlOutputs.forEach((signedUrlOutput) => {
        window.open(
          signedUrlOutput.url.toString(),
          signedUrlOutput.url.toString(),
          "_blank",
        );
      });
    };

    const confirmDelete = (etchPacketEid) => {
      selectedEtchPacketEid.value = etchPacketEid;
      displayConfirmation.value = true;
    };

    const deleteEtchPacketFromDocumentDb = async (etchPacketEid) => {
      const client = generateClient();
      // Delete the etch packet from the store
      store.commit("deleteEtchPacket", { etchPacketEid });

      // Delete the etch packet from the API
      try {
        const deleteEtchPacketInput = {
          input: {
            eid: etchPacketEid,
          },
        };
        await client.graphql({
          query: deleteEtchPacket,
          variables: deleteEtchPacketInput,
        });
        console.log(
          `Deleted etch packet from documentDB with eid: ${etchPacketEid}`,
        );
      } catch (err) {
        console.error(
          `Error deleting etch packet from documentDB with eid: ${etchPacketEid}`,
          err,
        );
      }
    };

    const deleteContract = async (etchPacketEid) => {
      // Delete all contracts matching this etchPacketEid from AWS
      const accountId = store.state.accountId;
      const contractId = store.state.contractId;
      const prefix = `accounts/${accountId}/contracts/${contractId}/etch-packets/${etchPacketEid}/`;

      try {
        const listInput = { prefix };
        const listOutput = await list(listInput);

        await Promise.all(
          listOutput.items.map(async (item) => {
            const deleteInput = { key: item.key };
            await remove(deleteInput);
          }),
        );

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

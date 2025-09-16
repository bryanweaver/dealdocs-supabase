<template>
  <DataTable
    v-if="etchPackets.length > 0"
    :value="etchPackets"
    row-group-mode="subheader"
    group-rows-by="createdAt"
    sort-mode="single"
    sort-field="createdAt"
    size="small"
    scrollable
  >
    <template #groupheader="slotProps">
      <div class="flex font-bold items-center gap-2">
        <span>Created: {{ slotProps.data.createdAt }}</span>
        <!-- <span>(ID: {{ slotProps.data.etchPacketEid }})</span> -->
        <PrimeButton
          class="p-button-danger p-button-text p-button-rounded ml-auto"
          icon="pi pi-trash"
          @click="confirmDelete(slotProps.data.etchPacketEid)"
        />
      </div>
    </template>
    <Column field="createdAt" header="Created At"></Column>
    <Column field="signerName" header="Signer"></Column>
    <Column field="signerStatus" header="Status">
      <template #body="slotProps">
        <Tag :status="slotProps.data.signerStatus" />
      </template>
    </Column>
    <Column header="Actions" class="w-24 !text-end">
      <template #body="slotProps">
        <div class="flex gap-3">
          <SignContract
            v-if="slotProps.data.signerStatus !== 'completed'"
            :key="slotProps.data.key"
            label="Sign"
            size="medium"
            :eid="slotProps.data.etchPacketEid"
            @etch-packet-created="fetchEtchPackets"
            @etch-packet-updated="fetchEtchPackets"
          />
          <PrimeButton
            class="p-button-secondary"
            label="View"
            @click="viewSignedDocument(slotProps.data)"
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
    <SignContract 
      label="Generate New Contract" 
      size="large"
      @etch-packet-created="fetchEtchPackets"
    />
  </div>
</template>

<script lang="ts">
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import { formatDate } from "@/utils/dateUtils";
import { EtchAPI, StorageAPI } from "@/services/api.js";
import Tag from "@/components/Tag.vue";
import SignContract from "@/components/SignContract.vue";
import { useToast } from "primevue/usetoast";

export default {
  name: "GenerateContract",
  components: {
    DataTable,
    Column,
    PrimeButton: Button,
    Tag,
    SignContract,
  },
  setup() {
    const store = useStore();
    const contracts = ref([]);
    const toast = useToast();
    const dbEtchPackets = ref([]);

    // Use database etch packets instead of Vuex state
    const etchPackets = computed(() => {
      if (dbEtchPackets.value.length > 0) {
        // Use data from database
        return dbEtchPackets.value.flatMap((packet) => {
          const signerInfo = packet.signer_info || {};
          const signers = signerInfo.signers || [];
          
          if (signers.length === 0) {
            // If no signers in signer_info, create a single entry
            return [{
              key: packet.etch_packet_id,
              name: packet.etch_packet_id,
              createdAt: formatDate(packet.created_at, "YYYY-MM-DD hh:mm A"),
              signerName: packet.signer_email || 'Unknown',
              signerStatus: packet.status || 'pending',
              etchPacketEid: packet.etch_packet_id,
              pdfUrl: packet.pdf_url,
              signedPdfUrl: packet.signed_pdf_url
            }];
          }
          
          return signers.map((signer) => ({
            key: `${packet.etch_packet_id}-${signer.email}`,
            name: packet.etch_packet_id,
            createdAt: formatDate(packet.created_at, "YYYY-MM-DD hh:mm A"),
            signerName: signer.name || signer.email,
            signerStatus: signer.status || packet.status || 'pending',
            etchPacketEid: packet.etch_packet_id,
            pdfUrl: packet.pdf_url,
            signedPdfUrl: packet.signed_pdf_url
          }));
        });
      } else if (store.state.etchPackets && store.state.etchPackets.length > 0) {
        // Fallback to Vuex state if available
        return store.state.etchPackets.flatMap((packet) => {
          // Check if documentGroup exists
          if (!packet.documentGroup || !packet.documentGroup.signers) {
            return [];
          }
          return packet.documentGroup.signers.map((signer) => ({
            key: `${packet.eid}-${signer.email}`,
            name: packet.name,
            createdAt: formatDate(packet.createdAt, "YYYY-MM-DD hh:mm A"),
            signerName: signer.name,
            signerStatus: signer.status,
            etchPacketEid: packet.eid,
            uploadKeys: signer.uploadKeys,
          }));
        });
      }
      return [];
    });

    console.log(etchPackets.value);
    const displayConfirmation = ref(false);
    const selectedEtchPacketEid = ref("");

    const fetchEtchPackets = async () => {
      const contractId = store.state.contractId;
      
      if (!contractId) {
        console.warn('No contract ID available');
        dbEtchPackets.value = [];
        return;
      }
      
      try {
        // Fetch etch packets from Supabase
        const packets = await EtchAPI.list(contractId);
        console.log("Raw packets from database:", packets);
        
        // Just use the packets as-is since we're doing hard delete
        dbEtchPackets.value = packets || [];
        console.log("Fetched etch packets from database:", dbEtchPackets.value);
        
        // Fetch associated files from storage
        const contractsWithFiles = await Promise.all(
          dbEtchPackets.value.map(async (packet) => {
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
        dbEtchPackets.value = [];
      }
    };

    const viewSignedDocument = async (data) => {
      // Fetch and view signed documents
      try {
        console.log('Viewing signed document for:', data);
        
        // First check if we have stored PDF URLs in the database
        const etchPacket = await EtchAPI.getByEtchPacketId(data.etchPacketEid);
        console.log('Etch packet from database:', etchPacket);
        
        // Check if all signers have completed
        const allSignersCompleted = data.signerStatus === 'completed' || 
          (etchPacket?.signer_info?.signers?.every(s => s.status === 'completed'));
        
        if (allSignersCompleted) {
          // Call the document-group edge function to fetch/store documents
          try {
            const { AuthService } = await import('@/services/auth.js');
            const session = await AuthService.getSession();
            
            let response;
            try {
              response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/document-group`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${session?.access_token}`,
                },
                body: JSON.stringify({
                  etchPacketEid: data.etchPacketEid,
                  accountId: store.state.accountId,
                  contractId: store.state.contractId
                })
              });
            } catch (networkError) {
              console.error('Network error calling edge function:', networkError);
              toast.add({
                severity: 'error',
                summary: 'Connection Error',
                detail: 'Unable to connect to document service. Please ensure Supabase functions are running.',
                life: 5000
              });
              throw networkError;
            }
            
            // Check if response is OK (status 200-299)
            if (!response.ok) {
              console.error('Edge function returned error status:', response.status, response.statusText);
              
              // Special handling for service unavailable or gateway errors
              if (response.status === 502 || response.status === 503 || response.status === 504) {
                toast.add({
                  severity: 'error',
                  summary: 'Service Unavailable',
                  detail: 'Document service is not running. Please ensure Supabase functions are deployed and running.',
                  life: 5000
                });
              } else {
                toast.add({
                  severity: 'error',
                  summary: 'Document Service Error',
                  detail: `Failed to fetch documents: ${response.statusText || 'Unknown error'}`,
                  life: 5000
                });
              }
              throw new Error(`Edge function error: ${response.status} ${response.statusText}`);
            }
            
            const { documents } = await response.json();
            console.log('Fetched documents from Anvil:', documents);
            
            // Open all signed documents
            if (documents && documents.length > 0) {
                console.log(`Opening ${documents.length} documents...`);
                console.log('Documents received:', documents);
                
                // Ensure all URLs are valid before opening
                const validDocs = documents.filter(doc => doc && doc.signedUrl);
                console.log(`Found ${validDocs.length} documents with valid URLs`);
                
                if (validDocs.length === 0) {
                  console.error('No documents with valid URLs found');
                  toast.add({
                    severity: 'warning',
                    summary: 'No Valid Documents',
                    detail: 'Documents were found but URLs are missing',
                    life: 4000
                  });
                  return;
                }
                
                // Open all documents with staggered delays
                validDocs.forEach((doc, index) => {
                  // Use immediate timeout for first doc to maintain user interaction context
                  const delay = index === 0 ? 0 : index * 500;
                  
                  setTimeout(() => {
                    console.log(`Opening document ${index + 1}/${validDocs.length}: ${doc.fileName} - ${doc.signedUrl.substring(0, 100)}...`);
                    const newWindow = window.open(doc.signedUrl, `_blank_${index}`);
                    if (!newWindow) {
                      console.warn(`Failed to open window for document ${index + 1}: ${doc.fileName} - popup may be blocked`);
                    }
                  }, delay);
                });
                
                toast.add({
                  severity: 'success',
                  summary: 'Documents Found',
                  detail: `Opening ${validDocs.length} document(s) - Please allow popups if blocked`,
                  life: 5000
                });
                return;
              }
          } catch (err) {
            console.error('Error fetching from document-group function:', err);
          }
        }
        
        // Check multiple storage locations for documents
        const storagePaths = [
          `signed-documents/${data.etchPacketEid}/`, // New path from document-group function
          `accounts/${store.state.accountId}/contracts/${store.state.contractId}/etch-packets/${data.etchPacketEid}/` // Legacy path
        ];
        
        for (const folderPath of storagePaths) {
          try {
            const files = await StorageAPI.list(folderPath, 'contracts');
            console.log(`Found files in ${folderPath}:`, files);
            
            if (files && files.length > 0) {
              // Open all PDF files found
              const pdfFiles = files.filter(file => file.name.toLowerCase().endsWith('.pdf'));
              
              if (pdfFiles.length > 0) {
                console.log(`Found ${pdfFiles.length} PDFs in storage, opening...`);
                
                // Get all signed URLs first
                const signedUrls = await Promise.all(
                  pdfFiles.map(async file => {
                    const filePath = `${folderPath}${file.name}`;
                    const signedUrl = await StorageAPI.getSignedUrl(filePath, 'contracts', 3600);
                    return { name: file.name, url: signedUrl };
                  })
                );
                
                // Open each document with a delay to avoid popup blocking
                signedUrls.forEach((doc, index) => {
                  const delay = index === 0 ? 0 : index * 500;
                  setTimeout(() => {
                    console.log(`Opening document ${index + 1}/${signedUrls.length}: ${doc.name}`);
                    const newWindow = window.open(doc.url, `_blank_${index}`);
                    if (!newWindow) {
                      console.warn(`Failed to open window for document ${index + 1}: ${doc.name} - popup may be blocked`);
                    }
                  }, delay); // 500ms delay between each window
                });
                
                toast.add({
                  severity: 'success',
                  summary: 'Documents Found',
                  detail: `Opening ${pdfFiles.length} document(s)`,
                  life: 3000
                });
                return;
              }
            }
          } catch (storageError) {
            console.warn(`No documents in ${folderPath}:`, storageError);
          }
        }
        
        // If we have a signed_pdf_url in the database, use it
        if (etchPacket?.signed_pdf_url) {
          window.open(etchPacket.signed_pdf_url, "_blank");
          return;
        }
        
        // If nothing found and not all signers completed, show info
        if (!allSignersCompleted) {
          toast.add({
            severity: 'info',
            summary: 'Signing In Progress',
            detail: 'Not all signers have completed. Documents will be available once all parties have signed.',
            life: 4000
          });
        } else {
          toast.add({
            severity: 'warning',
            summary: 'No Documents Found',
            detail: 'Documents may still be processing. Please try again in a moment.',
            life: 4000
          });
        }
      } catch (error) {
        console.error('Error viewing signed document:', error);
        toast.add({
          severity: 'error',
          summary: 'View Error',
          detail: 'Unable to access the document. Please try again.',
          life: 3000
        });
      }
    };

    const confirmDelete = (etchPacketEid) => {
      selectedEtchPacketEid.value = etchPacketEid;
      displayConfirmation.value = true;
    };

    const deleteEtchPacketFromDocumentDb = async (etchPacketEid) => {
      console.log(`Starting deletion of etch packet: ${etchPacketEid}`);
      
      // Delete the etch packet from the store if it exists
      if (store.state.etchPackets) {
        store.commit("deleteEtchPacket", { etchPacketEid });
      }

      // Delete the etch packet from Supabase
      try {
        const etchPacket = await EtchAPI.getByEtchPacketId(etchPacketEid);
        console.log(`Found etch packet in database:`, etchPacket);
        
        if (etchPacket && etchPacket.id) {
          // Actually delete the record from database
          console.log(`Deleting etch packet with database ID: ${etchPacket.id}`);
          await EtchAPI.delete(etchPacket.id);
          
          // Verify deletion
          const checkDeleted = await EtchAPI.getByEtchPacketId(etchPacketEid);
          if (checkDeleted) {
            console.error(`Etch packet ${etchPacketEid} still exists after deletion!`);
            toast.add({
              severity: 'error',
              summary: 'Delete Failed',
              detail: 'The packet could not be deleted from the database.',
              life: 3000
            });
            return false;
          }
          
          console.log(
            `Successfully deleted etch packet from Supabase with eid: ${etchPacketEid}`,
          );
          
          toast.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Etch packet deleted successfully.',
            life: 3000
          });
          
          // Return true to indicate successful deletion
          return true;
        } else {
          console.log(`Etch packet ${etchPacketEid} not found in database`);
          // Remove from UI if it somehow exists there but not in DB
          return true;
        }
      } catch (err) {
        console.error(
          `Error deleting etch packet from Supabase with eid: ${etchPacketEid}`,
          err,
        );
        toast.add({
          severity: 'error',
          summary: 'Delete Failed',
          detail: err.message || 'Unable to delete the etch packet. Please try again.',
          life: 3000
        });
        return false;
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

      // Delete from database and wait for completion
      const deleted = await deleteEtchPacketFromDocumentDb(etchPacketEid);
      
      // Close dialog
      displayConfirmation.value = false;
      
      // Refresh the list after deletion completes
      if (deleted) {
        await fetchEtchPackets();
      }
    };

    onMounted(fetchEtchPackets);

    return {
      contracts,
      etchPackets,
      selectedEtchPacketEid,
      viewSignedDocument,
      confirmDelete,
      deleteContract,
      fetchEtchPackets,
      displayConfirmation,
      formatDate,
    };
  },
};
</script>

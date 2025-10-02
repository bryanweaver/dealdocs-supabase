<template>
  <!-- Loading indicator -->
  <div
    v-if="isLoadingContract"
    class="flex items-center justify-center p-6"
  >
    <i
      class="pi pi-spin pi-spinner text-4xl"
      style="color: var(--primary-color)"
    />
    <span class="ml-3 text-lg">Loading contract data...</span>
  </div>

  <!-- Empty State - No contracts yet -->
  <div
    v-else-if="etchPackets.length === 0 && !isLoadingContract"
    class="empty-state-container"
  >
    <div class="empty-state-card">
      <i class="pi pi-file-pdf empty-state-icon" />
      <h2 class="empty-state-title">No Contracts Generated Yet</h2>
      <p class="empty-state-description">
        Ready to create your contract? Click below to generate and sign your real estate purchase offer.
      </p>
      <div class="empty-state-button-container">
        <SignContract
          label="Generate and eSign Your Contract"
          size="large"
          class="empty-state-button"
          @etch-packet-created="fetchEtchPackets"
        />
      </div>
    </div>
  </div>

  <!-- Existing Contracts View -->
  <div v-else class="contracts-container">
    <!-- Header Section -->
    <div class="contracts-header">
      <div class="header-content">
        <h1 class="contracts-title">Your Contracts</h1>
        <p class="contracts-subtitle">
          Manage your generated contracts, view signing status, and access signed documents
        </p>
      </div>
    </div>

    <!-- Contracts Table -->
    <DataTable
      :value="etchPackets"
      row-group-mode="subheader"
      group-rows-by="createdAt"
      sort-mode="single"
      sort-field="createdAt"
      size="small"
      scrollable
      class="contracts-table"
    >
    <template #groupheader="slotProps">
      <div class="flex font-bold items-center gap-2">
        <span>Created: {{ slotProps.data.createdAt }}</span>
        <!-- <span>(ID: {{ slotProps.data.etchPacketEid }})</span> -->
        <div class="ml-auto flex items-center gap-2">
          <PrimeButton
            v-if="slotProps.data.signerStatus === 'completed'"
            class="p-button-info p-button-sm"
            :icon="loadingDocuments ? 'pi pi-spin pi-spinner' : 'pi pi-file-pdf'"
            label="View Documents"
            severity="info"
            :loading="loadingDocuments"
            @click="toggleDocumentList(slotProps.data.etchPacketEid)"
          />
          <PrimeButton
            class="p-button-danger p-button-text p-button-rounded"
            icon="pi pi-trash"
            @click="confirmDelete(slotProps.data.etchPacketEid)"
          />
        </div>
      </div>
    </template>
    <Column
      field="createdAt"
      header="Created At"
    />
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
        <div class="flex gap-2 items-center">
          <SignContract
            v-if="slotProps.data.signerStatus !== 'completed'"
            :key="slotProps.data.key"
            label="Sign"
            size="small"
            :eid="slotProps.data.etchPacketEid"
            @etch-packet-created="fetchEtchPackets"
            @etch-packet-updated="fetchEtchPackets"
          />
        </div>
      </template>
    </Column>
    </DataTable>
  </div>
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

  <!-- Documents Dialog -->
  <Dialog
    v-model:visible="showDocumentsDialog"
    header="Signed Documents"
    :style="{ width: '600px' }"
    :modal="true"
  >
    <div
      v-if="selectedPacketDocuments.length > 0"
      class="space-y-3"
    >
      <div
        v-for="doc in selectedPacketDocuments"
        :key="doc.fileName"
        class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
      >
        <div class="flex items-center gap-3">
          <i class="pi pi-file-pdf text-2xl text-red-600" />
          <div>
            <p class="font-semibold">
              {{ formatDocumentName(doc.fileName) }}
            </p>
            <p class="text-sm text-gray-500">
              {{ doc.type === 'signed' ? 'Signed Document' : 'Generated Document' }}
            </p>
          </div>
        </div>
        <PrimeButton
          icon="pi pi-external-link"
          label="Open"
          class="p-button-sm"
          @click="openDocument(doc)"
        />
      </div>
    </div>
    <div
      v-else
      class="text-center py-8"
    >
      <i class="pi pi-inbox text-4xl text-gray-400 mb-3" />
      <p class="text-gray-500">
        No documents available yet
      </p>
    </div>
  </Dialog>

  <!-- Generate Another Contract Button (only when there are existing contracts) -->
  <div
    v-if="!isLoadingContract && etchPackets.length > 0"
    class="generate-another-container"
  >
    <div class="generate-another-card">
      <p class="generate-another-text">Need to create another contract?</p>
      <div class="generate-another-button-wrapper">
        <SignContract
          label="Generate Another Contract"
          size="large"
          class="generate-another-button"
          @etch-packet-created="fetchEtchPackets"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import { formatDate } from "@/utils/dateUtils";
import { ContractAPI, EtchAPI, StorageAPI } from "@/services/api.js";
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
    const route = useRoute();
    const contracts = ref([]);
    const toast = useToast();
    const dbEtchPackets = ref([]);
    const isLoadingContract = ref(false);

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
              createdAt: packet.created_at ? formatDate(packet.created_at, "YYYY-MM-DD hh:mm A") : 'Recently',
              signerName: packet.signer_email || 'Pending',
              signerStatus: packet.status || 'pending',
              etchPacketEid: packet.etch_packet_id,
              pdfUrl: packet.pdf_url,
              signedPdfUrl: packet.signed_pdf_url,
              documentUrls: packet.document_urls || []
            }];
          }
          
          return signers.map((signer) => ({
            key: `${packet.etch_packet_id}-${signer.email}`,
            name: packet.etch_packet_id,
            createdAt: packet.created_at ? formatDate(packet.created_at, "YYYY-MM-DD hh:mm A") : 'Recently',
            signerName: signer.name || signer.email || 'Pending',
            signerStatus: signer.status || packet.status || 'pending',
            etchPacketEid: packet.etch_packet_id,
            pdfUrl: packet.pdf_url,
            signedPdfUrl: packet.signed_pdf_url,
            documentUrls: packet.document_urls || []
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
    const showDocumentsDialog = ref(false);
    const selectedPacketDocuments = ref([]);
    const loadingDocuments = ref(false);

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

        // Check if we have stored document paths (not URLs, as URLs expire)
        if (etchPacket?.document_urls && etchPacket.document_urls.length > 0) {
          console.log('Found stored document paths:', etchPacket.document_urls);

          // Generate fresh signed URLs for each stored document path
          try {
            const freshUrls = await Promise.all(
              etchPacket.document_urls.map(async (doc) => {
                // Generate a fresh signed URL valid for 1 hour
                const signedUrl = await StorageAPI.getSignedUrl(doc.path, 'contracts', 3600);
                return {
                  ...doc,
                  url: signedUrl
                };
              })
            );

            // Open all documents with fresh URLs
            freshUrls.forEach((doc, index) => {
              const delay = index === 0 ? 0 : index * 500;
              setTimeout(() => {
                console.log(`Opening document ${index + 1}: ${doc.type} - ${doc.path}`);
                const newWindow = window.open(doc.url, `_blank_${index}`);
                if (!newWindow) {
                  console.warn(`Failed to open window for document ${index + 1} - popup may be blocked`);
                }
              }, delay);
            });

            toast.add({
              severity: 'success',
              summary: 'Documents Found',
              detail: `Opening ${freshUrls.length} document(s)`,
              life: 3000
            });
            return;
          } catch (urlError) {
            console.error('Error generating fresh signed URLs:', urlError);
            // Fall through to try other methods
          }
        }
        
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

            // Show documents in dialog instead of auto-opening
            if (documents && documents.length > 0) {
                console.log(`Found ${documents.length} documents`);

                // Filter out certificates and invalid docs
                const validDocs = documents.filter(doc =>
                  doc && doc.signedUrl &&
                  !doc.fileName.toLowerCase().includes('anvil certificate') &&
                  !doc.fileName.toLowerCase().includes('certificate')
                );

                console.log(`Filtered to ${validDocs.length} valid documents`);

                if (validDocs.length === 0) {
                  toast.add({
                    severity: 'warning',
                    summary: 'No Valid Documents',
                    detail: 'Documents were found but URLs are missing',
                    life: 4000
                  });
                  return;
                }

                // Format documents for the dialog
                const formattedDocs = validDocs.map(doc => ({
                  type: 'signed',
                  path: doc.storagePath,
                  fileName: doc.fileName,
                  freshUrl: doc.signedUrl // Use freshUrl since it's already fresh from Anvil
                }));

                // Show the documents dialog
                selectedPacketDocuments.value = formattedDocs;
                showDocumentsDialog.value = true;

                toast.add({
                  severity: 'success',
                  summary: 'Documents Ready',
                  detail: `Found ${formattedDocs.length} document(s) - click to open`,
                  life: 3000
                });

                // Refresh the etch packets list to get updated document_urls
                await fetchEtchPackets();
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

    const formatDocumentName = (fileName) => {
      if (!fileName) return 'Document';

      // Remove timestamp and extension
      let name = fileName.replace(/_signed_\d+\.pdf$/i, '');
      name = name.replace(/\.pdf$/i, '');

      // Replace underscores with spaces and capitalize
      name = name.replace(/_/g, ' ');

      // Special formatting for known document types
      const formatMap = {
        'residential resale contract': 'Residential Resale Contract',
        'third party finance addendum': 'Third Party Finance Addendum',
        'lender appraisal termination addendum': 'Lender Appraisal Termination Addendum',
        'homeowners addendum': 'Homeowners Association Addendum',
        'anvil certificate': 'Anvil Certificate',
        'contract': 'Main Contract'
      };

      const lowerName = name.toLowerCase();
      for (const [key, value] of Object.entries(formatMap)) {
        if (lowerName.includes(key)) {
          return value;
        }
      }

      // Capitalize first letter of each word
      return name.replace(/\b\w/g, (l) => l.toUpperCase());
    };

    const toggleDocumentList = async (etchPacketEid) => {
      console.log('toggleDocumentList called with:', etchPacketEid);

      loadingDocuments.value = true;

      try {
        // Always fetch the latest packet data to ensure we have current document_urls
        await fetchEtchPackets();

        // Fetch documents for this packet
        const packet = dbEtchPackets.value.find(p => p.etch_packet_id === etchPacketEid);
        console.log('Found packet:', packet);
        console.log('Packet document_urls:', packet?.document_urls);

        if (packet && packet.document_urls && packet.document_urls.length > 0) {
          // Generate fresh signed URLs for all documents
          try {
            const docsWithFreshUrls = await Promise.all(
              packet.document_urls
                .filter(doc => !doc.fileName?.toLowerCase().includes('anvil certificate'))
                .map(async (doc) => {
                  // Generate a fresh signed URL valid for 1 hour
                  const freshUrl = await StorageAPI.getSignedUrl(doc.path, 'contracts', 3600);
                  return {
                    ...doc,
                    freshUrl // Store the fresh URL separately to preserve original
                  };
                })
            );

            selectedPacketDocuments.value = docsWithFreshUrls;
            showDocumentsDialog.value = true;
          } catch (error) {
            console.error('Error generating fresh URLs for documents:', error);
            toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Unable to load document links. Please try again.',
              life: 3000
            });
          }
        } else {
          // Fetch documents from storage or Anvil - this will populate document_urls
          await viewSignedDocument({ etchPacketEid, signerStatus: 'completed' });
        }
      } finally {
        loadingDocuments.value = false;
      }
    };

    const openDocument = async (doc) => {
      // Always generate a fresh signed URL when opening
      try {
        const freshUrl = doc.freshUrl || await StorageAPI.getSignedUrl(doc.path, 'contracts', 3600);
        window.open(freshUrl, '_blank');
      } catch (error) {
        console.error('Error opening document:', error);
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to open document. Please try again.',
          life: 3000
        });
      }
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

    // Load contract if not already loaded
    const loadContractIfNeeded = async () => {
      const contractIdFromRoute = route.params.id;
      const contractIdInStore = store.state.contractId;

      console.log('GenerateContract - Route ID:', contractIdFromRoute);
      console.log('GenerateContract - Store contract ID:', contractIdInStore);
      console.log('GenerateContract - Store has form data:', !!store.state.property);

      // Check if we need to load the contract
      // Either: no contract ID in store, or different contract ID, or missing form data
      if (!contractIdInStore ||
          contractIdInStore !== contractIdFromRoute ||
          !store.state.property?.address) {

        console.log('Loading contract from database...');
        isLoadingContract.value = true;

        try {
          const contract = await ContractAPI.get(contractIdFromRoute);
          console.log('Loaded contract:', contract);

          // Use the selectContract action to load all the data properly
          store.dispatch('selectContract', contract);

          toast.add({
            severity: 'success',
            summary: 'Contract Loaded',
            detail: 'Contract data has been loaded successfully.',
            life: 3000
          });
        } catch (error) {
          console.error('Error loading contract:', error);
          toast.add({
            severity: 'error',
            summary: 'Load Failed',
            detail: 'Unable to load contract data. Please try again.',
            life: 5000
          });
        } finally {
          isLoadingContract.value = false;
        }
      }
    };

    onMounted(async () => {
      await loadContractIfNeeded();
      await fetchEtchPackets();
    });

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
      showDocumentsDialog,
      selectedPacketDocuments,
      formatDocumentName,
      toggleDocumentList,
      openDocument,
      dbEtchPackets,
      isLoadingContract,
      loadingDocuments,
    };
  },
};
</script>

<style scoped>
/* Contracts View Styles */
.contracts-container {
  min-height: 60vh;
}

.contracts-header {
  background: linear-gradient(135deg, var(--surface-0) 0%, var(--surface-50) 100%);
  border-bottom: 2px solid var(--surface-200);
  padding: 2rem 1rem;
  margin-bottom: 2rem;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.contracts-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.contracts-subtitle {
  font-size: 1.125rem;
  color: var(--text-color-secondary);
  margin: 0;
}

.contracts-table {
  max-width: 1200px;
  margin: 0 auto 2rem;
  padding: 0 1rem;
}

/* Generate Another Contract Section */
.generate-another-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 1rem 2rem;
  margin-top: 2rem;
}

.generate-another-card {
  text-align: center;
  max-width: 600px;
  width: 100%;
  padding: 2.5rem 2rem;
  background: var(--surface-0);
  border-radius: 12px;
  border: 2px dashed var(--surface-300);
}

.generate-another-text {
  font-size: 1.125rem;
  color: var(--text-color-secondary);
  margin-bottom: 1.5rem;
}

.generate-another-button-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.generate-another-button :deep(.p-button) {
  padding: 1rem 2.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 8px;
  min-width: 320px;
  transition: all 0.3s ease;
}

.generate-another-button :deep(.p-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(var(--primary-color-rgb), 0.3);
}

/* Empty State Styles */
.empty-state-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem;
}

.empty-state-card {
  text-align: center;
  max-width: 500px;
  padding: 3rem 2rem;
  background: var(--surface-0);
  border-radius: 12px;
  border: 2px dashed var(--surface-300);
}

.empty-state-icon {
  font-size: 5rem;
  color: var(--primary-300);
  margin-bottom: 1.5rem;
  display: block;
}

.empty-state-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.empty-state-description {
  font-size: 1rem;
  color: var(--text-color-secondary);
  margin-bottom: 2rem;
  line-height: 1.5;
}

/* Center the button container */
.empty-state-button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

/* Make the button more prominent in empty state */
.empty-state-button :deep(.p-button) {
  padding: 1rem 2.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 8px;
  min-width: 320px;
  transition: all 0.3s ease;
  display: inline-block;
}

.empty-state-button :deep(.p-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(var(--primary-color-rgb), 0.3);
}

/* Dark mode adjustments */
.dark .contracts-header {
  background: linear-gradient(135deg, var(--surface-800) 0%, var(--surface-900) 100%);
  border-bottom-color: var(--surface-700);
}

.dark .generate-another-card {
  background: var(--surface-800);
  border-color: var(--surface-600);
}

.dark .empty-state-card {
  background: var(--surface-800);
  border-color: var(--surface-600);
}

.dark .empty-state-icon {
  color: var(--primary-400);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .empty-state-container {
    min-height: 50vh;
    padding: 1rem;
  }

  .empty-state-card {
    padding: 2rem 1.5rem;
  }

  .empty-state-icon {
    font-size: 4rem;
  }

  .empty-state-title {
    font-size: 1.5rem;
  }

  .empty-state-button :deep(.p-button) {
    min-width: 240px;
    padding: 0.875rem 2rem;
  }
}
</style>

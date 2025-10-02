<template>
  <div :key="documentType">
    <h2 class="text-2xl font-bold m-3">
      {{ title }}
    </h2>
    <div v-if="uploads.length > 0">
      <DataTable
        :value="uploads"
        responsive-layout="scroll"
        class="document-upload-table"
      >
        <Column
          field="date"
          header="Date"
          :style="{ width: '20%' }"
        />
        <Column
          field="name"
          header="Name"
          :style="{ width: '40%' }"
        />
        <Column
          field="filetype"
          header="Type"
          :style="{ width: '10%' }"
        >
          <template #body="slotProps">
            <div class="flex justify-start">
              <span
                class="p-2 fiv-viv fiv-size-lg"
                :class="`fiv-icon-${slotProps.data.filetype}`"
              />
            </div>
          </template>
        </Column>
        <Column
          header="Actions"
          :style="{ width: '30%' }"
        >
          <template #body="slotProps">
            <div class="flex justify-start space-x-2">
              <PrimeButton
                class="p-button-primary p-button-sm"
                label="View"
                @click="openUpload(slotProps.data.key)"
              />
              <PrimeButton
                class="p-button-danger p-button-sm"
                label="Delete"
                @click="confirmDelete(slotProps.data.key)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
    <div v-else>
      <label
        :for="`dropzone-file-${documentType}`"
        class="flex flex-col items-center justify-center w-full h-full p-4 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        <div class="flex flex-col items-center justify-center">
          <svg
            class="w-8 h-8 mb-2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p class="mb-1 text-xs text-gray-500 dark:text-gray-400">
            <span class="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">(MAX. 10MB)</p>
        </div>
        <input
          :id="`dropzone-file-${documentType}`"
          type="file"
          class="hidden"
          @change="handleFileChange"
        >
      </label>
    </div>

    <!-- Add Upload Progress Bar -->
    <div
      v-if="uploadProgress > 0 && uploadProgress < 100"
      class="mt-4 w-full"
    >
      <ProgressBar
        :value="uploadProgress"
        :show-value="false"
        class="h-2 w-full"
        :style="{ width: '100%' }"
      />
      <!-- <div class="text-center text-sm text-gray-600 mt-1">
        Uploading: {{ uploadProgress }}%
      </div> -->
    </div>

    <!-- Add Confirmation Dialog -->
    <PrimeDialog
      v-model:visible="showDeleteDialog"
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
          @click="showDeleteDialog = false"
        />
        <PrimeButton
          label="Yes"
          icon="pi pi-check"
          severity="danger"
          outlined
          autofocus
          @click="handleDeleteConfirm"
        />
      </template>
    </PrimeDialog>

    <!-- Document Viewer Dialog -->
    <PrimeDialog
      v-model:visible="showDocumentViewer"
      :header="currentDocumentName"
      :style="{ width: '90vw', height: '90vh' }"
      :modal="true"
      :maximizable="true"
      :dismissableMask="true"
    >
      <div class="document-viewer-container">
        <div v-if="documentLoading" class="flex justify-center items-center h-full">
          <i class="pi pi-spinner pi-spin" style="font-size: 3rem" />
        </div>
        <iframe
          v-else-if="currentDocumentUrl"
          :key="currentDocumentKey + '_' + Date.now()"
          :src="currentDocumentUrl"
          class="w-full h-full"
          style="min-height: 70vh; border: none;"
        />
        <div v-else class="flex justify-center items-center h-full">
          <p>Unable to load document</p>
        </div>
      </div>
      <template #footer>
        <PrimeButton
          label="Download"
          icon="pi pi-download"
          class="p-button-secondary"
          @click="downloadDocument"
        />
        <PrimeButton
          label="Close"
          icon="pi pi-times"
          @click="closeDocumentViewer"
        />
      </template>
    </PrimeDialog>
    <Toast />
  </div>
</template>

<script lang="ts">
import { StorageAPI, DocumentAPI } from "@/services/api.js";
import { defineComponent, ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import PrimeButton from "primevue/button";
import PrimeDialog from "primevue/dialog";
import ProgressBar from "primevue/progressbar";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

export default defineComponent({
  name: "DocumentUploadList",
  components: {
    DataTable,
    Column,
    PrimeButton,
    PrimeDialog,
    ProgressBar,
    Toast,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    documentType: {
      type: String,
      required: true,
    },
  },
  setup() {
    const uploadProgress = ref(0);
    const showDeleteDialog = ref(false);
    const pendingDeleteKey = ref(null);
    const toast = useToast();

    // Document viewer state
    const showDocumentViewer = ref(false);
    const currentDocumentUrl = ref(null);
    const currentDocumentName = ref('');
    const currentDocumentKey = ref(null);
    const documentLoading = ref(false);

    return {
      uploadProgress,
      showDeleteDialog,
      pendingDeleteKey,
      toast,
      showDocumentViewer,
      currentDocumentUrl,
      currentDocumentName,
      currentDocumentKey,
      documentLoading,
    };
  },
  data() {
    return {
      file: null,
      accountId: this.$store.state.accountId,
      contractId: this.$store.state.contractId,
    };
  },
  computed: {
    uploads() {
      const doc = this.$store.getters.getUploadedDocument(this.documentType);
      // Only treat it as an uploaded document if a valid key exists.
      return doc && doc.key ? [doc] : [];
    },
  },
  watch: {
    "$store.state.accountId": {
      handler(newVal) {
        this.accountId = newVal;
      },
      immediate: true,
    },
    "$store.state.contractId": {
      handler(newVal) {
        this.contractId = newVal;
      },
      immediate: true,
    },
    documentType: {
      handler(newVal) {
        console.log(`documentType changed to: ${newVal}`);
      },
      immediate: true,
    },
  },
  // mounted() {
  //   console.log(
  //     `Mounted DocumentUploadList with documentType: ${this.documentType}`
  //   );
  //   // Optionally, dispatch an action to initially fetch uploads from the backend/store.
  //   this.$store.dispatch("fetchUploads", {
  //     accountId: this.accountId,
  //     contractId: this.contractId,
  //     documentType: this.documentType,
  //   });
  // },
  methods: {
    handleFileChange(e) {
      const selectedFile = e.target.files[0];

      // Check file size - 10MB limit
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
      if (selectedFile && selectedFile.size > MAX_FILE_SIZE) {
        // Show error using toast service
        this.toast.add({
          severity: "error",
          summary: "File Too Large",
          detail: `The file size (${(selectedFile.size / (1024 * 1024)).toFixed(2)}MB) exceeds the 10MB limit. Please select a smaller file.`,
          life: 5000,
        });

        // Reset the input field
        e.target.value = "";
        return;
      }

      this.file = selectedFile;
      this.handleFileUpload();
    },
    async handleFileUpload() {
      console.log(`Uploading file to documentType: ${this.documentType}`);
      const file = this.file;
      const now = new Date().getTime();
      const key = `accounts/${this.accountId}/contracts/${this.contractId}/${this.documentType}/${now}-${file.name}`;

      this.uploadProgress = 10;
      
      try {
        // Upload file to Supabase Storage
        const result = await StorageAPI.upload(
          file,
          key,
          'contracts'
        );
        
        this.uploadProgress = 70;
        console.log("Successfully saved document to storage", result);
        
        // Save document metadata to database
        const documentRecord = {
          contract_id: this.contractId,
          storage_path: result.path,  // Required field in database
          file_path: result.path,      // Also include for compatibility
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          document_type: this.documentType,
          storage_url: result.publicUrl,
          is_current_version: true
        };
        
        const savedDoc = await DocumentAPI.create(documentRecord);
        this.uploadProgress = 90;
        
        const document = {
          key: result.path,
          filetype: result.path.split(".").pop().toLowerCase(),
          date: new Date(now).toLocaleString([], {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          }),
          name: result.path.split("/").pop().split("-").slice(1).join("-"),
          documentType: this.documentType,
          id: savedDoc.id
        };

        this.$store.dispatch("uploadDocument", {
          documentType: this.documentType,
          document: document,
          isUploaded: true,
        });

        this.uploadProgress = 100;
        
        // Show success message
        this.toast.add({
          severity: "success",
          summary: "Upload Complete",
          detail: `${file.name} has been uploaded successfully.`,
          life: 3000,
        });
        
        // Reset after brief delay to show completion
        setTimeout(() => {
          this.uploadProgress = 0;
        }, 2000);

      } catch (error) {
        console.error("Error uploading file:", error);
        this.toast.add({
          severity: "error",
          summary: "Upload Failed",
          detail: "Failed to upload the file. Please try again.",
          life: 5000,
        });
        this.uploadProgress = 0;
      } finally {
        this.file = null;
      }
    },

    confirmDelete(key) {
      this.pendingDeleteKey = key;
      this.showDeleteDialog = true;
    },

    async handleDeleteConfirm() {
      if (this.pendingDeleteKey) {
        await this.deleteUpload(this.pendingDeleteKey);
        this.pendingDeleteKey = null;
      }
      this.showDeleteDialog = false;
    },
    async openUpload(uploadKey) {
      try {
        // Close any existing viewer first to ensure clean state
        if (this.showDocumentViewer) {
          this.closeDocumentViewer();
          await new Promise(resolve => setTimeout(resolve, 50));
        }

        // Reset state before opening
        this.currentDocumentUrl = null;
        this.currentDocumentName = '';
        this.currentDocumentKey = null;
        this.documentLoading = true;

        // Find the document name from uploads
        const doc = this.uploads.find(u => u.key === uploadKey);
        this.currentDocumentName = doc ? doc.name : 'Document';
        this.currentDocumentKey = uploadKey;

        // Show dialog after setting initial state
        this.showDocumentViewer = true;

        // Small delay to ensure dialog is rendered
        await new Promise(resolve => setTimeout(resolve, 100));

        // Get a fresh signed URL for the document
        const signedUrl = await StorageAPI.getSignedUrl(uploadKey, 'contracts', 3600);

        // Set the URL and stop loading
        this.currentDocumentUrl = signedUrl;
        this.documentLoading = false;
      } catch (error) {
        console.error('Error getting signed URL:', error);
        this.documentLoading = false;
        this.showDocumentViewer = false;
        this.currentDocumentUrl = null;
        this.$toast.add({
          severity: 'error',
          summary: 'Access Error',
          detail: 'Unable to access the file. Please try again.',
          life: 3000
        });
      }
    },
    async deleteUpload(uploadKey) {
      // Delete from Supabase Storage
      await StorageAPI.delete(uploadKey, 'contracts');
      
      // Find the document record to delete from database
      const upload = this.uploads.find(u => u.key === uploadKey);
      if (upload && upload.id) {
        await DocumentAPI.delete(upload.id);
      }
      
      // Update store
      this.$store.dispatch("deleteUpload", {
        documentType: this.documentType,
        uploadKey: uploadKey,
      });
      
      // Reset the state for this document type in the store
      this.$store.commit("deleteUpload", {
        contractId: this.contractId,
        documentType: this.documentType
      });
    },
    // Document viewer methods
    closeDocumentViewer() {
      this.showDocumentViewer = false;
      // Reset all state when closing
      this.currentDocumentUrl = null;
      this.currentDocumentName = '';
      this.currentDocumentKey = null;
      this.documentLoading = false;
    },
    async downloadDocument() {
      if (this.currentDocumentKey) {
        try {
          // Generate a fresh signed URL for download
          const downloadUrl = await StorageAPI.getSignedUrl(this.currentDocumentKey, 'contracts', 3600);

          // Fetch the file as a blob
          const response = await fetch(downloadUrl);
          const blob = await response.blob();

          // Create a blob URL and trigger download
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = this.currentDocumentName || 'document';
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Clean up the blob URL
          setTimeout(() => URL.revokeObjectURL(blobUrl), 100);

          this.$toast.add({
            severity: 'success',
            summary: 'Download Complete',
            detail: 'Your document has been downloaded.',
            life: 3000
          });
        } catch (error) {
          console.error('Error downloading document:', error);
          this.$toast.add({
            severity: 'error',
            summary: 'Download Error',
            detail: 'Unable to download the document. Please try again.',
            life: 3000
          });
        }
      }
    },
  },
});
</script>

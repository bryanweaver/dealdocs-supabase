<template>
  <div :key="documentType">
    <h2 class="text-2xl font-bold m-3">{{ title }}</h2>
    <div v-if="uploads.length > 0">
      <DataTable :value="uploads" responsive-layout="scroll">
        <Column field="date" header="Date"></Column>
        <Column field="name" header="Name"></Column>
        <Column field="filetype" header="Type">
          <template #body="slotProps">
            <span
              class="p-2 fiv-viv fiv-size-lg"
              :class="`fiv-icon-${slotProps.data.filetype}`"
            ></span>
          </template>
        </Column>
        <Column header="Actions">
          <template #body="slotProps">
            <div class="flex justify-center space-x-4">
              <PrimeButton
                class="p-button-primary"
                label="Open"
                @click="openUpload(slotProps.data.key)"
              />
              <PrimeButton
                class="p-button-danger"
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
            ></path>
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
        />
      </label>
    </div>

    <!-- Add Upload Progress Bar -->
    <div v-if="uploadProgress > 0 && uploadProgress < 100" class="mt-4 w-full">
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
        <i class="pi pi-exclamation-triangle mr-4" style="font-size: 2rem" />
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
import { useToast } from "primevue/usetoast";

export default defineComponent({
  name: "DocumentUploadList",
  components: {
    DataTable,
    Column,
    PrimeButton,
    PrimeDialog,
    ProgressBar,
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

    return {
      uploadProgress,
      showDeleteDialog,
      pendingDeleteKey,
      toast,
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

      this.uploadProgress = 0;
      
      // Upload file to Supabase Storage
      const result = await StorageAPI.upload(
        file,
        key,
        'contracts'
      );
      
      // Simulate progress for now - Supabase doesn't have built-in progress tracking
      // You could implement this with chunked uploads if needed
      this.uploadProgress = 100;

      console.log("successfully saved document", result);
      
      // Save document metadata to database
      const documentRecord = {
        contract_id: this.contractId,
        file_path: result.path,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        document_type: this.documentType,
        storage_url: result.publicUrl,
        is_current_version: true
      };
      
      const savedDoc = await DocumentAPI.create(documentRecord);
      
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

      this.file = null;
      this.uploadProgress = 0;
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
      // Get public URL for the file
      const publicUrl = StorageAPI.getPublicUrl(uploadKey, 'contracts');
      window.open(
        publicUrl,
        publicUrl,
        "_blank",
      );
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
      this.$store.dispatch("uploadDocument", {
        documentType: this.documentType,
        document: {
          isUploaded: false,
          eTag: null,
          key: null,
          date: null,
          size: null,
        },
        isUploaded: false,
      });
    },
  },
});
</script>

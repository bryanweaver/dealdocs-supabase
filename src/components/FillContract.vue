<!-- FillContract.vue -->
<template>
  <div>
    <Button
      :disabled="!isContractComplete || loading"
      :class="{ 'opacity-50 cursor-not-allowed': !isContractComplete }"
      :loading="loading"
      icon="pi pi-upload"
      label="Fill PDF Form (shouldn't work)"
      @click="fillPDFForm"
    />
  </div>
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { computed, ref } from "vue";
import { mapAll2017Fields } from "../utils/dataMapUtils";
import { StorageAPI } from "@/services/api.js";
import { AuthService } from "@/services/auth.js";
import Button from "primevue/button";

const store = useStore();
const emit = defineEmits(["contract-uploaded"]);
const loading = ref(false);

const accountId = computed(() => store.state.accountId);
const contractId = computed(() => store.state.contractId);
const templateId = import.meta.env.VITE_ANVIL_20_17_FORM_ID;
const templateTitle = import.meta.env.VITE_ANVIL_20_17_FORM_TITLE;

const fillPDFForm = async () => {
  loading.value = true;
  const dataToWrite = mapAll2017Fields(store.state.formData);
  console.log("dataToWrite", dataToWrite);
  try {
    const input = {
      templateId,
      title: templateTitle,
      fontSize: 10,
      textColor: "#ff0000",
      data: dataToWrite,
    };
    // Call Supabase Edge Function for PDF filling
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/anvil-fill`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await AuthService.getSession())?.access_token}`
      },
      body: JSON.stringify(input)
    });
    
    const responseBody = await response.json();
    const { statusCode, data, errors } = responseBody;

    if (statusCode === 200) {
      const pdfArrayBuffer = new Uint8Array(data.data).buffer;
      const pdfBlob = new Blob([pdfArrayBuffer], { type: "application/pdf" });
      const now = new Date().getTime();
      // Save the PDF to Supabase Storage
      const key = `contracts/${accountId.value}/${contractId.value}/etch-packets/${now}.pdf`;
      const result = await StorageAPI.upload(
        pdfBlob,
        key,
        'contracts'
      );
      console.log("Successfully saved PDF to Supabase Storage:", result);
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
      emit("contract-uploaded");
    } else if (statusCode >= 400) {
      console.warn("Validation errors");
      if (errors && Array.isArray(errors)) {
        console.warn(errors[0]);
      } else {
        console.warn("some error");
      }
    }
  } catch (e) {
    console.error("Error filling PDF:", e);
  } finally {
    loading.value = false;
  }
};
</script>

<script lang="ts">
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["isContractComplete"]),
  },
};
</script>

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
import { post } from "aws-amplify/api";
import { computed, ref } from "vue";
import { mapAll2017Fields } from "../utils/dataMapUtils";
import { uploadData } from "aws-amplify/storage";
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
    const command = post({
      apiName: "api0ca09615",
      path: "/anvil/fill",
      options: {
        body: input,
        headers: {
          "Content-Type": "application/json",
        },
      },
    });

    const response = await command.response;
    const responseBody = await response.body.json();
    const { statusCode, data, errors } = responseBody;

    if (statusCode === 200) {
      const pdfArrayBuffer = new Uint8Array(data.data).buffer;
      const pdfBlob = new Blob([pdfArrayBuffer], { type: "application/pdf" });
      const now = new Date().getTime();
      // Save the PDF to S3
      const result = await uploadData({
        key: `contracts/${accountId.value}/${contractId.value}/etch-packets/${now}.pdf`,
        data: pdfBlob,
        options: {
          contentType: "application/pdf",
          // accessLevel: "protected",
          metadata: {
            templateId,
            templateTitle,
          },
          onProgress: ({ transferredBytes, totalBytes }) => {
            if (totalBytes) {
              console.log(
                `Upload progress ${Math.round(
                  (transferredBytes / totalBytes) * 100,
                )} %`,
              );
            }
          },
        },
      }).result;
      console.log("Successfully saved PDF to S3:", result);
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

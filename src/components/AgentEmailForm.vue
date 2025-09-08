<template>
  <div class="agent-email-form">
    <div class="card flex flex-col gap-6 p-6">
      <div class="text-l font-bold mb-4 text-center">Send Email</div>
      <div class="form-container">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label for="to-email" class="font-semibold">To:</label>
            <InputText
              id="to-email"
              v-model="toEmail"
              type="email"
              placeholder="Enter email address"
              class="w-full"
            />
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label for="comments" class="font-semibold">Comments:</label>
          <Textarea
            id="comments"
            v-model="comments"
            rows="6"
            placeholder="Enter your comments"
            class="w-full"
          />
        </div>
      </div>

      <div class="flex justify-end">
        <Button
          label="Send"
          class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md"
          :loading="isSending"
          :disabled="isSending"
          @click="sendEmail"
        >
          <template #loading>
            <i class="pi pi-spin pi-spinner mr-2"></i>
            Sending...
          </template>
        </Button>
      </div>

      <!-- Only show this section when there are previous email records -->
      <div v-if="emailRecords.length" class="mt-6">
        <div class="text-l font-bold mb-4 text-center">
          Previously Sent Emails
        </div>
        <table class="min-w-full bg-white">
          <thead>
            <tr>
              <th class="px-4 py-2 border text-left">Agent</th>
              <th class="px-4 py-2 border text-left">Comments</th>
              <th class="px-4 py-2 border text-left">Status</th>
              <th class="px-4 py-2 border text-left">Sent</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in emailRecords" :key="record.id">
              <td class="px-4 py-2 border">
                {{ record.agentName }} ({{ record.agentEmail }})
              </td>
              <td class="px-4 py-2 border">{{ record.comments }}</td>
              <td class="px-4 py-2 border">{{ record.status }}</td>
              <td class="px-4 py-2 border">
                {{ formatDate(record.createdAt, "YYYY-MM-DD hh:mm A") }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Toast />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { EmailAPI } from "@/services/api.js";
import { AuthService } from "@/services/auth.js";
import { formatDate } from "@/utils/dateUtils";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

export default defineComponent({
  name: "AgentEmailForm",
  components: {
    Toast,
  },
  props: {
    filesForAgentEmail: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const toast = useToast();
    const accountId = store.state.accountId;
    const contractId = store.state.contractId;
    const streetAddress = store.state.formData.property.streetAddress;

    const toEmail = ref("");
    const comments = ref("");
    const emailRecords = ref([]);
    const isSending = ref(false);

    // Function to fetch the email records for the current contract
    const fetchEmailRecords = async () => {
      try {
        const records = await EmailAPI.list(contractId);
        emailRecords.value = records.map(record => ({
          id: record.id,
          agentName: record.agent_name,
          agentEmail: record.agent_email,
          comments: record.comments,
          status: record.status,
          createdAt: record.sent_at
        }));
      } catch (error) {
        console.error("Error fetching email records", error);
      }
    };

    // Fetch on component mount
    onMounted(() => {
      fetchEmailRecords();
    });

    const sendEmail = async () => {
      if (!toEmail.value) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "Please enter a recipient email address.",
          life: 3000,
        });
        return;
      }

      isSending.value = true;
      try {
        console.log("Sending email to:", toEmail.value);
        console.log("Comments:", comments.value);
        console.log("Files:", props.filesForAgentEmail);
        console.log("Account ID:", accountId);
        console.log("Contract ID:", contractId);
        console.log("Street Address:", streetAddress);

        const contractFiles = props.filesForAgentEmail
          .filter((file) => file.bucket === "etch-packets")
          .map((file) => file.filekey);

        const otherFiles = props.filesForAgentEmail.reduce((map, file) => {
          if (file.bucket !== "etch-packets") {
            map[file.bucket] = file.filekey;
          }
          return map;
        }, {});

        const emailPayload = {
          contractId,
          agentEmail: toEmail.value,
          agentName: toEmail.value.split('@')[0], // Extract name from email for now
          comments: comments.value,
          contractFiles,
          preApprovalFile: otherFiles["preapproval"] || "",
          earnestFile: otherFiles["earnest"] || "",
          optionFile: otherFiles["optionfee"] || "",
          subject: `Contract Package for ${streetAddress}`,
          body: `Please find attached the contract package for ${streetAddress}. ${comments.value}`,
        };

        console.log("Email payload:", emailPayload);

        // Call Supabase Edge Function for email sending
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await AuthService.getSession())?.access_token}`
          },
          body: JSON.stringify(emailPayload)
        });

        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to send email');
        }

        console.log("Email sent:", result);

        // Reset form fields after sending
        toEmail.value = "";
        comments.value = "";

        // Refresh the email records list after sending a new email
        fetchEmailRecords();

        // Show success toast
        toast.add({
          severity: "success",
          summary: "Email Sent",
          detail: "The email has been sent successfully.",
          life: 3000,
        });
      } catch (error) {
        console.error("Error sending email", error);

        // Show error toast
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to send the email. Please try again.",
          life: 3000,
        });
      } finally {
        isSending.value = false;
      }
    };

    return {
      formatDate,
      toEmail,
      comments,
      sendEmail,
      emailRecords,
      isSending,
    };
  },
});
</script>

<style scoped>
.agent-email-form {
  height: calc(100% - 120px);
  /* Adjust the height as needed */
}

.form-container {
  overflow-y: auto;
  max-height: calc(100% - 120px);
  /* Adjust the max-height as needed */
}
</style>

<template>
  <div class="agent-email-form">
    <!-- Email Send Animation -->
    <EmailSendAnimation
      ref="emailAnimation"
      :visible="showAnimation"
      :street-address="streetAddress"
      @complete="handleAnimationComplete"
      @retry="retryEmail"
      @cancel="cancelAnimation"
    />

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
              <th class="px-4 py-2 border text-left">Sent To</th>
              <th class="px-4 py-2 border text-left">Comments</th>
              <th class="px-4 py-2 border text-left">Status</th>
              <th class="px-4 py-2 border text-left">Date Sent</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in emailRecords" :key="record.id">
              <td class="px-4 py-2 border">
                {{ record.agentEmail || 'Unknown' }}
              </td>
              <td class="px-4 py-2 border">{{ record.comments || 'No comments' }}</td>
              <td class="px-4 py-2 border">
                <span :class="getStatusClass(record.status)">
                  {{ record.status || 'Sent' }}
                </span>
              </td>
              <td class="px-4 py-2 border">
                {{ formatDate(record.createdAt, "MM/DD/YYYY hh:mm A") }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Toast position="bottom-center" />
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
import EmailSendAnimation from "./EmailSendAnimation.vue";

export default defineComponent({
  name: "AgentEmailForm",
  components: {
    Toast,
    EmailSendAnimation,
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
    const showAnimation = ref(false);
    const emailAnimation = ref(null);
    const pendingEmailPayload = ref(null);

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

      // Prepare the email payload first
      const contractFiles = props.filesForAgentEmail
        .filter((file) => file.bucket === "etch-packets")
        .map((file) => file.filekey);

      const otherFiles = props.filesForAgentEmail.reduce((map, file) => {
        if (file.bucket !== "etch-packets") {
          map[file.bucket] = file.filekey;
        }
        return map;
      }, {});

      pendingEmailPayload.value = {
        contractId,
        agentEmail: toEmail.value,
        agentName: toEmail.value.split('@')[0], // Extract name from email for now
        comments: comments.value,
        contractFiles,
        preApprovalFile: otherFiles["preapproval"] || "",
        earnestFile: otherFiles["earnest"] || "",
        optionFile: otherFiles["optionfee"] || "",
        subject: `Contract Package for ${streetAddress}`,
        body: `Please find attached the contract package for ${streetAddress}.`,
      };

      // Show animation and handle actual sending
      isSending.value = true;
      showAnimation.value = true;

      // Wait a bit to sync with animation phases
      setTimeout(async () => {
        try {
          console.log("Sending email to:", toEmail.value);
          console.log("Email payload:", pendingEmailPayload.value);

          // Call Supabase Edge Function for email sending
          const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${(await AuthService.getSession())?.access_token}`
            },
            body: JSON.stringify(pendingEmailPayload.value)
          });

          const result = await response.json();

          if (!response.ok) {
            // Trigger error animation
            if (emailAnimation.value) {
              emailAnimation.value.triggerError();
            }
            throw new Error(result.error || 'Failed to send email');
          }

          console.log("Email sent:", result);

          // Animation will auto-complete and trigger handleAnimationComplete
        } catch (error) {
          console.error("Error sending email:", error);
          // Error animation is already triggered above
          isSending.value = false;
        }
      }, 3000); // Start actual send midway through animation
    };

    const handleAnimationComplete = () => {
      showAnimation.value = false;
      isSending.value = false;

      // Reset form fields after successful send
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
    };

    const retryEmail = () => {
      // Reset animation and try again
      showAnimation.value = false;
      isSending.value = false;

      // Retry sending after a brief delay
      setTimeout(() => {
        sendEmail();
      }, 100);
    };

    const cancelAnimation = () => {
      showAnimation.value = false;
      isSending.value = false;
      pendingEmailPayload.value = null;
    };

    const getStatusClass = (status) => {
      switch(status?.toLowerCase()) {
        case 'sent':
        case 'success':
          return 'text-green-600 font-semibold';
        case 'failed':
        case 'error':
          return 'text-red-600 font-semibold';
        case 'pending':
          return 'text-yellow-600 font-semibold';
        default:
          return 'text-gray-600';
      }
    };

    return {
      formatDate,
      toEmail,
      comments,
      sendEmail,
      emailRecords,
      isSending,
      showAnimation,
      emailAnimation,
      streetAddress,
      handleAnimationComplete,
      retryEmail,
      cancelAnimation,
      getStatusClass,
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

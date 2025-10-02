<template>
  <div class="flex">
    <div class="flex justify-center items-center flex-col">
      <template v-if="!isContractComplete">
        <p class="text-center text-gray-600 mb-4 max-w-lg">
          We need some more data to be able to generate a proper offer contract
          for you, so please
          <router-link
            :to="`/contracts/${contractId}/forms/${firstIncompleteSection}`"
            class="text-primary hover:underline"
          >
            head back over to the data forms
          </router-link>
          so we can gather all of the info we need.
        </p>
      </template>
      <PrimeButton
        :disabled="!isContractComplete || loading"
        :class="{ 'opacity-50 cursor-not-allowed': !isContractComplete }"
        :loading="loading"
        :icon="eid ? 'pi pi-pencil' : 'pi pi-plus'"
        :label="label"
        :size="size"
        class="font-bold sign-contract-btn"
        @click="fetchEsignUrl"
      />
    </div>
    <Dialog
      v-model:visible="showIframeDialog"
      :modal="true"
      position="bottom"
      :style="{ width: '90vw', height: '85vh', zIndex: 9999 }"
      :dismissable-mask="true"
      :draggable="false"
      :resizable="false"
      :base-z-index="9000"
      @show="onDialogShow"
      @hide="onDialogHide"
    >
      <EtchSignIFrame
        v-if="signingUrl"
        :signing-url="signingUrl"
        :current-signer="currentSigner"
        @signer-complete="handleSignerComplete"
      />
      <div v-else class="flex justify-center items-center h-96">
        <p class="text-gray-500">Loading signing interface...</p>
      </div>
    </Dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import EtchSignIFrame from "./EtchSignIFrame.vue";
import PrimeButton from "primevue/button";
import Dialog from "primevue/dialog";
import {
  mapAll2017Fields,
  mapAllHOAAddendumFields,
  mapAllLenderAppraisalTerminationAddendumFields,
  mapAllThirdPartyFinanceAddendumFields,
} from "../utils/dataMapUtils";
import { base64ToArrayBuffer } from "@/utils/pdfUtils";
import { EtchAPI, StorageAPI } from "@/services/api.js";
import { AuthService } from "@/services/auth.js";
import { FinancingType, LoanType } from "@/types/enums.js";

const templateTitle = import.meta.env.VITE_ANVIL_20_17_FORM_TITLE;
const templateId = import.meta.env.VITE_ANVIL_20_17_FORM_ID;
const hoaTemplateId = import.meta.env.VITE_ANVIL_HOA_FORM_ID;
const hoaTemplateTitle = import.meta.env.VITE_ANVIL_HOA_FORM_TITLE;
const thirdPartyTemplateId = import.meta.env.VITE_ANVIL_THIRD_PARTY_FORM_ID;
const thirdPartyTemplateTitle = import.meta.env
  .VITE_ANVIL_THIRD_PARTY_FORM_TITLE;
const appraisalAddendumTemplateId = import.meta.env
  .VITE_ANVIL_APPRAISAL_ADDENDUM_FORM_ID;
const appraisalAddendumTemplateTitle = import.meta.env
  .VITE_ANVIL_APPRAISAL_ADDENDUM_FORM_TITLE;


export default {
  name: "SignContract",
  components: {
    PrimeButton,
    EtchSignIFrame,
    Dialog,
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: "large",
    },
    eid: {
      type: String,
      required: false,
      default: "",
    },
  },
  emits: ["contract-uploaded", "etch-packet-created", "etch-packet-updated"],

  data() {
    return {
      iframeUrl: null,
      showIframeDialog: false,
      loading: false,
      signingUrl: "",
      currentSigner: "",
      signers: [],
    };
  },
  computed: {
    ...mapGetters(["isContractComplete", "getFirstIncompleteSection"]),
    firstIncompleteSection() {
      const section = this.getFirstIncompleteSection;
      console.log("First incomplete section:", section);
      return section;
    },
    formData() {
      return this.$store.state.formData;
    },
    accountId() {
      return this.$store.state.accountId;
    },
    contractId() {
      return this.$store.state.contractId;
    },
    // Remove computed userId to avoid async issues
    // userId() {
    //   return AuthService.getUser().then(user => user?.id);
    // },
  },
  methods: {
    onDialogShow() {
      console.log('SignContract - Dialog shown, signingUrl:', this.signingUrl);
      console.log('SignContract - Dialog visibility state:', {
        showIframeDialog: this.showIframeDialog,
        hasSigningUrl: !!this.signingUrl,
        currentSigner: this.currentSigner
      });
    },
    onDialogHide() {
      console.log('SignContract - Dialog hidden');
    },
    async handleSignerComplete({ event }) {
      console.log("Signer completed:", event.completedSignerEid);

      // Find the index of the etchPacket in the store based on the etchPacketEid
      const etchPacketIndex = this.$store.state.etchPackets.findIndex(
        (packet) => packet.eid === event.etchPacketEid,
      );

      const body = {
        documentGroupEid: event.documentGroupEid,
        etchPacketEid: event.etchPacketEid,
        accountId: this.$store.state.accountId,
        contractId: this.$store.state.contractId
      };
      let uploadKeys = [];
      
      // Fetch the signed document group from the edge function
      try {
        const session = await AuthService.getSession();
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/document-group`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`
          },
          body: JSON.stringify(body)
        });
        
        const statusCode = response.status;
        const responseBody = await response.json();

        if (statusCode === 200) {
          // Documents are now stored in Supabase storage by the edge function
          // We just need to track the storage paths
          if (responseBody.documents && responseBody.documents.length > 0) {
            for (const document of responseBody.documents) {
              if (document.storagePath) {
                uploadKeys.push(document.storagePath);
                console.log("Document stored at:", document.storagePath);
              }
            }
          }
          
          // Update document group info if we have it
          if (responseBody.documentGroup && etchPacketIndex !== -1) {
            // Update the etch packet in store with latest document group info
            this.$store.commit("updateEtchPacketDocumentGroup", {
              etchPacketIndex,
              documentGroup: responseBody.documentGroup
            });
          }
        } else if (statusCode >= 400) {
          console.warn("Error fetching documents:", responseBody.error);
        }
      } catch (error) {
        console.error('Error fetching document group:', error);
        // Don't return - continue to update status even if document fetch fails
      }

      console.log("etchPacketIndex", etchPacketIndex);

      if (etchPacketIndex !== -1) {
        // Find the index of the signer in the etchPacket based on the signerEid
        const signerIndex = this.$store.state.etchPackets[
          etchPacketIndex
        ].documentGroup.signers.findIndex(
          (signer) => signer.eid === event.signerEid,
        );

        if (signerIndex !== -1) {
          // Update the signer status in the store
          // AND INCLUDE THE PDF URL
          this.$store.commit("updateSignerStatus", {
            etchPacketIndex,
            signerIndex,
            status: event.signerStatus,
            uploadKeys: uploadKeys,
          });
        }
      }

      const updatedEtchPacket = this.$store.state.etchPackets[etchPacketIndex];

      // Save the updated etchPacket to Supabase
      await this.saveEtchPacket(updatedEtchPacket);
      
      // Emit event to refresh the list
      this.$emit('etch-packet-updated');

      // Close the dialog since signing is complete for this signer
      this.showIframeDialog = false;
    },
    async fetchEsignUrl() {
      // Prevent double-clicks
      if (this.loading) {
        console.log('Already loading, skipping duplicate call');
        return;
      }
      
      this.loading = true;
      const body = this.getPayload();
      try {
        // Call Supabase Edge Function for e-signing
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/esign`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await AuthService.getSession())?.access_token}`
          },
          body: JSON.stringify(body)
        });
        
        const responseBody = await response.json();
        console.log('SignContract - Edge function response:', responseBody);

        const {
          signingUrl: url,
          currentSigner: signer,
          createEtchPacket: etchPacket,
        } = responseBody;

        console.log('SignContract - Extracted values:', {
          url,
          signer,
          hasEtchPacket: !!etchPacket
        });

        if (etchPacket) {
          this.$store.commit("updateEtchPacket", { etchPacket });
        }

        if (url && signer) {
          console.log('SignContract - Opening signing dialog with URL:', url);

          // Check URL format
          try {
            const urlObj = new URL(url);
            console.log('SignContract - URL validation:', {
              hostname: urlObj.hostname,
              pathname: urlObj.pathname,
              protocol: urlObj.protocol,
              isAnvilUrl: urlObj.hostname.includes('anvil'),
            });
          } catch (e) {
            console.error('SignContract - Invalid URL format:', e);
          }

          this.signingUrl = url;
          this.currentSigner = signer;

          // Force Vue to update before showing dialog
          this.$nextTick(() => {
            this.showIframeDialog = true;
            console.log('SignContract - Dialog triggered:', {
              showIframeDialog: this.showIframeDialog,
              signingUrl: this.signingUrl,
              currentSigner: this.currentSigner
            });
          });
        } else {
          console.error("Error: Missing signing URL or signer information", { url, signer, responseBody });
          // Show user-friendly error
          this.$toast?.add({
            severity: 'error',
            summary: 'Unable to Generate Contract',
            detail: 'The signing URL could not be generated. Please try again.',
            life: 5000
          });
        }
      } catch (e) {
        console.error("Error filling PDF:", e);
      } finally {
        this.loading = false;
      }
    },
    getPayload() {
      console.log('SignContract - formData from store:', JSON.stringify(this.$store.state.formData, null, 2));
      console.log('SignContract - buyers data:', this.$store.state.formData.buyers);
      console.log('SignContract - sellers data:', this.$store.state.formData.sellers);

      const contractData = mapAll2017Fields(this.$store.state.formData);

      const hasHOA =
        this.$store.state.formData.homeownersAssociationAddendum
          ?.hasHomeownersAssociation;
      const hoaAddendumData = hasHOA
        ? mapAllHOAAddendumFields(this.$store.state.formData)
        : null;

      const hasThirdPartyFinancing =
        this.$store.state.formData.finance?.financingType ===
        FinancingType.BYTHIRDPARTY;
      const thirdPartyFinancingData = hasThirdPartyFinancing
        ? mapAllThirdPartyFinanceAddendumFields(this.$store.state.formData)
        : null;

      const requiresAppraisalAddendum =
        hasThirdPartyFinancing &&
        ![LoanType.FHA, LoanType.VA, LoanType.VAGUARANTEED].includes(
          this.$store.state.formData.finance?.loanType,
        );
      const appraisalAddendumData = requiresAppraisalAddendum
        ? mapAllLenderAppraisalTerminationAddendumFields(
            this.$store.state.formData,
          )
        : null;

      console.log("contractData", contractData);

      if (hasHOA) {
        console.log("hoaAddendumData", hoaAddendumData);
      }

      if (hasThirdPartyFinancing) {
        console.log("thirdPartyFinancingData", thirdPartyFinancingData);
      }

      if (requiresAppraisalAddendum) {
        console.log("appraisaleAddendumData", appraisalAddendumData);
      }

      const contractFillData = {
        templateId,
        title: templateTitle,
        fontSize: 10,
        textColor: "#0000FF",
        data: contractData,
      };

      const files = [
        {
          id: "contract2017",
          castEid: templateId,
          filename: `residential_resale_contract_signed_${new Date().getTime()}.pdf`,
        },
      ];

      const payloads = {
        contract2017: contractFillData,
      };

      if (hasHOA) {
        files.push({
          id: "hoaAddendum",
          castEid: hoaTemplateId,
          filename: `homeowners_addendum_signed_${new Date().getTime()}.pdf`,
        });

        payloads.hoaAddendum = {
          templateId: hoaTemplateId,
          title: hoaTemplateTitle,
          fontSize: 10,
          textColor: "#0000FF",
          data: hoaAddendumData,
        };
      }

      if (hasThirdPartyFinancing) {
        files.push({
          id: "thirdPartyFinanceAddendum",
          castEid: thirdPartyTemplateId,
          filename: `third_party_finance_addendum_signed_${new Date().getTime()}.pdf`,
        });

        payloads.thirdPartyFinanceAddendum = {
          templateId: thirdPartyTemplateId,
          title: thirdPartyTemplateTitle,
          fontSize: 10,
          textColor: "#0000FF",
          data: thirdPartyFinancingData,
        };
      }

      if (requiresAppraisalAddendum) {
        files.push({
          id: "lenderAppraisalTerminationAddendum",
          castEid: appraisalAddendumTemplateId,
          filename: `lender_appraisal_termination_addendum_signed_${new Date().getTime()}.pdf`,
        });

        payloads.lenderAppraisalTerminationAddendum = {
          templateId: appraisalAddendumTemplateId,
          title: appraisalAddendumTemplateTitle,
          fontSize: 10,
          textColor: "#0000FF",
          data: appraisalAddendumData,
        };
      }

      const signersInput = this.getSignersInput();
      this.signers = signersInput.signers;
      this.currentSigner = signersInput.currentSigner;

      const eid = this.eid;
      const currentEtchPacket = this.$store.state.etchPackets.find(
        (packet) => packet.eid === eid,
      );

      return {
        userId: this.contractId, // Use contract ID instead of user ID
        accountId: this.accountId,
        name: "Residential Resale Contract for Signing",
        isDraft: false,
        isTest: true,
        files,
        data: {
          payloads,
        },
        signers: signersInput.signers,
        currentSigner: signersInput.currentSigner,
        etchPacket: currentEtchPacket,
      };
    },
    getSignersInput() {
      const buyers = this.formData["buyers"];
      const hasMultipleSigners = buyers.hasSecondaryParty;
      const hasHOA =
        this.$store.state.formData.homeownersAssociationAddendum
          ?.hasHomeownersAssociation;
      const hasThirdPartyFinancing =
        this.$store.state.formData.finance?.financingType ===
        FinancingType.BYTHIRDPARTY;
      const requiresAppraisalAddendum =
        hasThirdPartyFinancing &&
        ![LoanType.FHA, LoanType.VA, LoanType.VAGUARANTEED].includes(
          this.$store.state.formData.finance?.loanType,
        );

      console.log("hasMultipleSigners", hasMultipleSigners);

      const primaryBuyerFields = [
        { fileId: "contract2017", fieldId: "buyer1InitialPage122" },
        { fileId: "contract2017", fieldId: "buyer1InitialPage242" },
        { fileId: "contract2017", fieldId: "buyer1InitialPage359" },
        { fileId: "contract2017", fieldId: "buyer1InitialPage470" },
        { fileId: "contract2017", fieldId: "buyer1InitialPage584" },
        { fileId: "contract2017", fieldId: "buyer1InitialPage696" },
        { fileId: "contract2017", fieldId: "buyer1InitialPage7101" },
        { fileId: "contract2017", fieldId: "buyer1InitialPage8159" },
        { fileId: "contract2017", fieldId: "buyer1Signature168" },
      ];

      const secondaryBuyerFields = [
        { fileId: "contract2017", fieldId: "buyer2InitialPage123" },
        { fileId: "contract2017", fieldId: "buyer2InitialPage243" },
        { fileId: "contract2017", fieldId: "buyer2InitialPage360" },
        { fileId: "contract2017", fieldId: "buyer2InitialPage471" },
        { fileId: "contract2017", fieldId: "buyer2InitialPage585" },
        { fileId: "contract2017", fieldId: "buyer2InitialPage697" },
        { fileId: "contract2017", fieldId: "buyer2InitialPage7102" },
        { fileId: "contract2017", fieldId: "buyer2InitialPage8160" },
        { fileId: "contract2017", fieldId: "buyer2Signature166" },
      ];

      if (hasHOA) {
        primaryBuyerFields.push({
          fileId: "hoaAddendum",
          fieldId: "signature113",
        });
        secondaryBuyerFields.push({
          fileId: "hoaAddendum",
          fieldId: "signature315",
        });
      }

      if (hasThirdPartyFinancing) {
        primaryBuyerFields.push(
          {
            fileId: "thirdPartyFinanceAddendum",
            fieldId: "signature13",
          },
          {
            fileId: "thirdPartyFinanceAddendum",
            fieldId: "buyer1Initials37",
          },
        );
        secondaryBuyerFields.push(
          {
            fileId: "thirdPartyFinanceAddendum",
            fieldId: "signature243",
          },
          {
            fileId: "thirdPartyFinanceAddendum",
            fieldId: "buyer2Initials38",
          },
        );
      }

      if (requiresAppraisalAddendum) {
        primaryBuyerFields.push({
          fileId: "lenderAppraisalTerminationAddendum",
          fieldId: "buyerSignature",
        });
        secondaryBuyerFields.push({
          fileId: "lenderAppraisalTerminationAddendum",
          fieldId: "buyerSignature1",
        });
      }

      const signers = hasMultipleSigners
        ? [
            {
              id: "primaryBuyerSigner",
              email: buyers.email,
              name: `${buyers.primaryName}`,
              routingOrder: 1,
              signerType: "embedded",
              fields: primaryBuyerFields,
            },
            {
              id: "secondaryBuyerSigner",
              email: buyers.secondaryEmail,
              name: `${buyers.secondaryName}`,
              routingOrder: 2,
              signerType: "embedded",
              fields: secondaryBuyerFields,
            },
          ]
        : [
            {
              id: "primaryBuyerSigner",
              email: buyers.email,
              name: `${buyers.primaryName || ''}`, // Use primaryName instead of split fields
              routingOrder: 1,
              signerType: "embedded",
              fields: primaryBuyerFields,
            },
          ];

      const currentEtchPacket = this.$store.state.etchPackets.find(
        (packet) => packet.eid === this.eid,
      );

      console.log('getSignersInput - currentEtchPacket:', currentEtchPacket);
      console.log('getSignersInput - local signers:', signers);

      let incompleteSigner;
      if (currentEtchPacket) {
        const sortedSigners = currentEtchPacket.documentGroup.signers.sort(
          (a, b) => a.signingOrder - b.signingOrder,
        );

        console.log('getSignersInput - sortedSigners from Anvil:', sortedSigners);

        incompleteSigner = sortedSigners.find(
          (signer) => signer.status !== "completed",
        );

        console.log('getSignersInput - incompleteSigner:', incompleteSigner);

        // Try to match by aliasId first, then by email as fallback
        let currentSigner = incompleteSigner
          ? signers.find((signer) => signer.id === incompleteSigner.aliasId)
          : null;

        // If no match by aliasId, try matching by email
        if (!currentSigner && incompleteSigner) {
          currentSigner = signers.find((signer) =>
            signer.email.toLowerCase() === incompleteSigner.email.toLowerCase()
          );
          console.log('getSignersInput - matched by email:', currentSigner);
        }

        console.log('getSignersInput - final currentSigner:', currentSigner);

        return {
          signers,
          currentSigner: currentSigner ? currentSigner.id : signers[0].id,
        };
      } else {
        console.log('getSignersInput - no etch packet, using first signer');
        return {
          signers,
          currentSigner: signers[0].id,
        };
      }
    },
    async saveEtchPacket(etchPacket) {
      try {
        // Check if etch packet exists
        const existing = await EtchAPI.getByEtchPacketId(etchPacket.eid);
        
        if (existing) {
          // Update existing etch packet
          const result = await EtchAPI.update(existing.id, {
            signer_info: etchPacket.documentGroup, // Changed from document_group to signer_info
            status: etchPacket.status || 'pending'
          });
          console.log("Updated etchPacket:", result);
        } else {
          // Extract signer emails for database
          const signerEmails = etchPacket.documentGroup?.signers?.map(s => s.email) || [];
          const primarySignerEmail = signerEmails[0] || null;
          
          // Create new etch packet
          const result = await EtchAPI.create({
            etch_packet_id: etchPacket.eid,
            contract_id: this.contractId,
            signer_info: etchPacket.documentGroup, // Changed from document_group to signer_info
            signer_email: primarySignerEmail, // Add primary signer email for indexing
            status: etchPacket.status || 'pending',
            created_at: new Date().toISOString()
          });
          console.log("Created etchPacket:", result);
          this.$emit('etch-packet-created', result);
        }
      } catch (error) {
        console.error('Error saving etch packet:', error);
      }
    },
  },
};
</script>

<style scoped>
/* Add more space between icon and text */
.sign-contract-btn :deep(.p-button-icon-left) {
  margin-right: 0.75rem;
}
</style>

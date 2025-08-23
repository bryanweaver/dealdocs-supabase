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
            >head back over to the data forms</router-link
          >
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
        class="font-bold"
        @click="fetchEsignUrl"
      />
    </div>
    <Dialog
      v-model:visible="showIframeDialog"
      class="min-h-[200px]"
      :modal="true"
      :position="'bottom'"
      :style="{ width: '100%', height: '80%' }"
      :dismissable-mask="true"
      :draggable="false"
      :resizable="false"
    >
      <EtchSignIFrame
        :signing-url="signingUrl"
        :current-signer="currentSigner"
        @signer-complete="handleSignerComplete"
      />
    </Dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import EtchSignIFrame from "./EtchSignIFrame.vue";
import PrimeButton from "primevue/button";
import {
  mapAll2017Fields,
  mapAllHOAAddendumFields,
  mapAllLenderAppraisalTerminationAddendumFields,
  mapAllThirdPartyFinanceAddendumFields,
} from "../utils/dataMapUtils";
import { generateClient, post } from "aws-amplify/api";
import { uploadData } from "aws-amplify/storage";
import { base64ToArrayBuffer } from "@/utils/pdfUtils";
import { useAuthenticator } from "@aws-amplify/ui-vue";
import { createEtchPacket, updateEtchPacket } from "@/graphql/mutations";
import { getEtchPacket } from "@/graphql/queries";
import { FinancingType, LoanType } from "@/API";

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

const auth = useAuthenticator();

export default {
  name: "SignContract",
  components: {
    PrimeButton,
    EtchSignIFrame,
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
  emits: ["contract-uploaded"],

  data() {
    return {
      iframeUrl: null,
      showIframeDialog: false,
      loading: false,
      signingUrl: "",
      currentSigner: "",
      signers: [],
      auth,
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
    userId() {
      return this.auth.user?.userId;
    },
  },
  methods: {
    async handleSignerComplete({ event }) {
      console.log("Signer completed:", event.completedSignerEid);

      // Find the index of the etchPacket in the store based on the etchPacketEid
      const etchPacketIndex = this.$store.state.etchPackets.findIndex(
        (packet) => packet.eid === event.etchPacketEid,
      );

      //TODO: need to update the etchPacket in store
      const body = {
        documentGroupEid: event.documentGroupEid,
      };
      // Fetch the signed document group from the Lambda function
      const command = post({
        apiName: "api0ca09615",
        path: "/document-group/",
        options: {
          body,
          headers: {
            "Content-Type": "text/html",
          },
        },
      });

      const response = await command.response;
      const { statusCode } = response;
      const responseBody = await response.body.json();
      let uploadKeys = [];

      if (statusCode === 200) {
        for (const document of responseBody.documents) {
          const pdfArrayBuffer = base64ToArrayBuffer(document.fileData);
          const pdfBlob = new Blob([pdfArrayBuffer], {
            type: "application/pdf",
          });

          const uploadKey = `accounts/${this.accountId}/contracts/${this.contractId}/etch-packets/${event.etchPacketEid}/${document.fileName}`;
          uploadKeys.push(uploadKey);

          // Save the PDF to S3
          const result = await uploadData({
            key: uploadKey,
            data: pdfBlob,
            options: {
              contentType: "application/pdf",
              // accessLevel: "protected",
              metadata: {
                templateId,
                templateTitle,
                documentGroupEid: event.documentGroupEid,
                etchPacketEid: event.etchPacketEid,
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
        }
      } else if (statusCode >= 400) {
        console.warn("Validation errors");
        console.warn("some error");
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
            uploadKeys,
          });
        }
      }

      const updatedEtchPacket = this.$store.state.etchPackets[etchPacketIndex];

      // Save the updated etchPacket to the document DB
      await this.saveEtchPacket(updatedEtchPacket);

      // if (event.nextSignerEid) {
      //   // There is a next signer, fetch their signing URL
      //   this.currentSigner = event.nextSignerEid;
      //   // this.fetchEsignUrl();
      // } else {
      //   // All signers have completed
      //   this.showIframeDialog = false;
      //   // Handle final completion (e.g., save the fully signed PDF to S3, update contract status)
      // }
    },
    async fetchEsignUrl() {
      this.loading = true;
      const body = this.getPayload();
      try {
        const command = post({
          apiName: "api0ca09615",
          path: "/esign/",
          options: {
            body,
            headers: {
              "Content-Type": "text/html",
            },
          },
        });

        const response = await command.response;
        const responseBody = await response.body.json();

        const {
          signingUrl: url,
          currentSigner: signer,
          createEtchPacket: etchPacket,
        } = responseBody;

        if (etchPacket) {
          this.$store.commit("updateEtchPacket", { etchPacket });
        }

        if (url && signer) {
          this.signingUrl = url;
          this.currentSigner = signer;
          this.showIframeDialog = true;
        } else {
          console.error("Error filling PDF");
          // ... (keep existing error handling)
        }
      } catch (e) {
        console.error("Error filling PDF:", e);
      } finally {
        this.loading = false;
      }
    },
    getPayload() {
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
        userId: this.userId,
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
              name: `${buyers.primaryFirstName} ${buyers.primaryMi} ${buyers.primaryLastName}`,
              routingOrder: 1,
              signerType: "embedded",
              fields: primaryBuyerFields,
            },
          ];

      const currentEtchPacket = this.$store.state.etchPackets.find(
        (packet) => packet.eid === this.eid,
      );
      let incompleteSigner;
      if (currentEtchPacket) {
        const sortedSigners = currentEtchPacket.documentGroup.signers.sort(
          (a, b) => a.signingOrder - b.signingOrder,
        );
        incompleteSigner = sortedSigners.find(
          (signer) => signer.status !== "completed",
        );
        const currentSigner = incompleteSigner
          ? signers.find((signer) => signer.id === incompleteSigner.aliasId)
          : null;
        return {
          signers,
          currentSigner: currentSigner.id,
        };
      } else {
        return {
          signers,
          currentSigner: signers[0].id,
        };
      }
    },
    async saveEtchPacket(etchPacket) {
      const client = generateClient();
      const { data } = await client.graphql({
        query: getEtchPacket,
        variables: {
          eid: etchPacket.eid,
        },
      });

      if (data?.getEtchPacket) {
        // If the etchPacket exists, update it
        const { data } = await client.graphql({
          query: updateEtchPacket,
          variables: {
            input: {
              eid: etchPacket.eid,
              documentGroup: etchPacket.documentGroup,
              contractId: this.contractId,
            },
          },
        });
        console.log("Updated etchPacket:", data.updateEtchPacket);
      } else {
        // If the etchPacket doesn't exist, create it
        const { data } = await client.graphql({
          query: createEtchPacket,
          variables: {
            input: {
              eid: etchPacket.eid,
              documentGroup: etchPacket.documentGroup,
              contractId: this.contractId,
            },
          },
        });
        console.log("Created etchPacket:", data.createEtchPacket);
      }
    },
  },
};
</script>

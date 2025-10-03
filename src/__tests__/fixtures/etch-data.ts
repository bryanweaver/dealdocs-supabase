/**
 * Test data factories for Etch/E-signature related data structures
 */
// import { EtchPacket, Signer } from "@/API"; // Deprecated - using Supabase types

// Define interface types for test fixtures that match the expected shape
interface TestSigner {
  fields?: Array<{
    fieldType: string;
    fieldId: string;
    required: boolean;
  }>;
  uploadKeys?: string[];
}

interface TestEtchPacket extends Partial<EtchPacket> {
  archivedAt?: Date | null;
  completedAt?: Date | null;
  createdAt?: Date;
  detailsUrl?: string;
  isTest?: boolean;
  numberRemainingSigners?: number;
  updatedAt?: Date;
  webhookUrl?: string;
}

export const mockSigner: TestSigner = {
  aliasId: "signer-001",
  eid: "etch-signer-123",
  email: "john.smith@email.com",
  name: "John Smith",
  routingOrder: 1,
  signActionType: "sign",
  status: "pending",
  fields: [
    {
      fieldType: "signature",
      fieldId: "buyer-signature-1",
      required: true,
    },
    {
      fieldType: "date",
      fieldId: "buyer-date-1",
      required: true,
    },
  ],
  uploadKeys: [],
};

export const mockCompletedSigner: TestSigner = {
  ...mockSigner,
  status: "completed",
  uploadKeys: ["s3://bucket/signed-doc-123.pdf"],
};

export const mockSellerSigner: TestSigner = {
  aliasId: "seller-001",
  eid: "etch-seller-456",
  email: "robert.johnson@email.com",
  name: "Robert Johnson",
  routingOrder: 2,
  signActionType: "sign",
  status: "pending",
  fields: [
    {
      fieldType: "signature",
      fieldId: "seller-signature-1",
      required: true,
    },
    {
      fieldType: "date",
      fieldId: "seller-date-1",
      required: true,
    },
  ],
  uploadKeys: [],
};

export const mockEtchPacket: TestEtchPacket = {
  archivedAt: null,
  completedAt: null,
  createdAt: new Date("2024-01-15T10:00:00Z"),
  detailsUrl: "https://app.useanvil.com/etch/abc123",
  documentGroup: {
    eid: "doc-group-789",
    files: [
      {
        downloadURL: "https://app.useanvil.com/api/download/contract-123.pdf",
        filename: "contract-123.pdf",
        name: "Real Estate Purchase Contract",
        type: "application/pdf",
      },
    ],
    signers: [mockSigner, mockSellerSigner],
    status: "pending",
  },
  eid: "etch-packet-789",
  isTest: true,
  name: "Contract for 1234 Maple Drive",
  numberRemainingSigners: 2,
  status: "pending",
  updatedAt: new Date("2024-01-15T10:00:00Z"),
  webhookUrl: "https://api.dealdocs.com/webhooks/etch",
};

export const mockCompletedEtchPacket: TestEtchPacket = {
  ...mockEtchPacket,
  completedAt: new Date("2024-01-16T14:30:00Z"),
  documentGroup: {
    ...mockEtchPacket.documentGroup,
    signers: [
      mockCompletedSigner,
      { ...mockSellerSigner, status: "completed" },
    ],
    status: "completed",
  },
  numberRemainingSigners: 0,
  status: "completed",
  updatedAt: new Date("2024-01-16T14:30:00Z"),
};

export const mockSignerCompleteEvent = {
  action: "signer.complete",
  signerStatus: "completed",
  signerEid: "etch-signer-123",
  nextSignerEid: "etch-seller-456",
  documentGroupStatus: "pending",
  documentGroupEid: "doc-group-789",
  etchPacketEid: "etch-packet-789",
};

export const mockDocumentGroupCompleteEvent = {
  action: "documentGroup.complete",
  signerStatus: "completed",
  signerEid: "etch-seller-456",
  nextSignerEid: null,
  documentGroupStatus: "completed",
  documentGroupEid: "doc-group-789",
  etchPacketEid: "etch-packet-789",
};

/**
 * Factory function to create EtchPacket with overrides
 */
export function createMockEtchPacket(
  overrides: Partial<TestEtchPacket> = {},
): TestEtchPacket {
  return {
    ...mockEtchPacket,
    ...overrides,
    eid: overrides.eid || `etch-packet-${Date.now()}`,
    documentGroup: {
      ...mockEtchPacket.documentGroup,
      ...overrides.documentGroup,
      eid: overrides.documentGroup?.eid || `doc-group-${Date.now()}`,
    },
  };
}

/**
 * Factory function to create Signer with overrides
 */
export function createMockSigner(overrides: Partial<TestSigner> = {}): TestSigner {
  return {
    ...mockSigner,
    ...overrides,
    eid: overrides.eid || `etch-signer-${Date.now()}`,
  };
}

/**
 * Create test data for various signing scenarios
 */
export const signingScenarios = {
  // Single buyer signing
  singleBuyer: createMockEtchPacket({
    documentGroup: {
      eid: "single-buyer-doc",
      files: [
        {
          downloadURL: "https://app.useanvil.com/api/download/single-buyer.pdf",
          filename: "single-buyer-contract.pdf",
          name: "Real Estate Purchase Contract - Single Buyer",
          type: "application/pdf",
        },
      ],
      signers: [mockSigner],
      status: "pending",
    },
    numberRemainingSigners: 1,
  }),

  // Multiple signers scenario
  multipleSigners: createMockEtchPacket({
    documentGroup: {
      eid: "multiple-signers-doc",
      files: [
        {
          downloadURL:
            "https://app.useanvil.com/api/download/multiple-signers.pdf",
          filename: "multiple-signers-contract.pdf",
          name: "Real Estate Purchase Contract - Multiple Parties",
          type: "application/pdf",
        },
      ],
      signers: [
        mockSigner,
        mockSellerSigner,
        createMockSigner({
          aliasId: "co-buyer-001",
          eid: "etch-cobuyer-789",
          email: "jane.smith@email.com",
          name: "Jane Smith",
          routingOrder: 3,
        }),
      ],
      status: "pending",
    },
    numberRemainingSigners: 3,
  }),

  // Failed signing scenario
  failedSigning: createMockEtchPacket({
    status: "failed",
    documentGroup: {
      eid: "failed-signing-doc",
      files: [
        {
          downloadURL: "https://app.useanvil.com/api/download/failed.pdf",
          filename: "failed-contract.pdf",
          name: "Failed Contract Signing",
          type: "application/pdf",
        },
      ],
      signers: [
        createMockSigner({ status: "failed" }),
        createMockSigner({ status: "pending", routingOrder: 2 }),
      ],
      status: "failed",
    },
    numberRemainingSigners: 2,
  }),
};

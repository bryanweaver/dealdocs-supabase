export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      agents: {
        Row: {
          address: string | null
          brokerage: string | null
          city: string | null
          created_at: string
          email: string | null
          facebook_url: string | null
          id: string
          is_active: boolean
          is_verified: boolean
          last_contacted: string | null
          license_number: string | null
          linkedin_url: string | null
          mls_id: string | null
          name: string
          phone: string | null
          search_vector: unknown | null
          specialties: string[] | null
          state: string
          twitter_url: string | null
          updated_at: string
          website: string | null
          zip: string | null
          bio: string | null
        }
        Insert: {
          address?: string | null
          brokerage?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          facebook_url?: string | null
          id?: string
          is_active?: boolean
          is_verified?: boolean
          last_contacted?: string | null
          license_number?: string | null
          linkedin_url?: string | null
          mls_id?: string | null
          name: string
          phone?: string | null
          specialties?: string[] | null
          state?: string
          twitter_url?: string | null
          updated_at?: string
          website?: string | null
          zip?: string | null
          bio?: string | null
        }
        Update: {
          address?: string | null
          brokerage?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          facebook_url?: string | null
          id?: string
          is_active?: boolean
          is_verified?: boolean
          last_contacted?: string | null
          license_number?: string | null
          linkedin_url?: string | null
          mls_id?: string | null
          name?: string
          phone?: string | null
          specialties?: string[] | null
          state?: string
          twitter_url?: string | null
          updated_at?: string
          website?: string | null
          zip?: string | null
          bio?: string | null
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          changed_fields: string[] | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
          timestamp: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          changed_fields?: string[] | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name: string
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          changed_fields?: string[] | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_documents: {
        Row: {
          access_level: string
          contract_id: string
          created_at: string
          description: string | null
          document_type: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          id: string
          is_current_version: boolean
          is_public: boolean
          replaced_by: string | null
          storage_bucket: string
          storage_path: string
          uploaded_at: string
          uploaded_by: string | null
          version: number
        }
        Insert: {
          access_level?: string
          contract_id: string
          created_at?: string
          description?: string | null
          document_type?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_current_version?: boolean
          is_public?: boolean
          replaced_by?: string | null
          storage_bucket?: string
          storage_path: string
          uploaded_at?: string
          uploaded_by?: string | null
          version?: number
        }
        Update: {
          access_level?: string
          contract_id?: string
          created_at?: string
          description?: string | null
          document_type?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_current_version?: boolean
          is_public?: boolean
          replaced_by?: string | null
          storage_bucket?: string
          storage_path?: string
          uploaded_at?: string
          uploaded_by?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "contract_documents_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_documents_replaced_by_fkey"
            columns: ["replaced_by"]
            isOneToOne: false
            referencedRelation: "contract_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          additional_info: Json
          buyer_name: string | null
          contract_date: string | null
          created_at: string
          financial_details: Json
          id: string
          legacy_id: string | null
          legal_sections: Json
          marked_questions: string[]
          mls_number: string | null
          parties: Json
          pdf_generated_at: string | null
          pdf_url: string | null
          progress: Json
          property_address: string | null
          property_info: Json
          seller_name: string | null
          signed_at: string | null
          signed_pdf_url: string | null
          status: string
          title_closing: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          additional_info?: Json
          buyer_name?: string | null
          contract_date?: string | null
          created_at?: string
          financial_details?: Json
          id?: string
          legacy_id?: string | null
          legal_sections?: Json
          marked_questions?: string[]
          mls_number?: string | null
          parties?: Json
          pdf_generated_at?: string | null
          pdf_url?: string | null
          progress?: Json
          property_address?: string | null
          property_info?: Json
          seller_name?: string | null
          signed_at?: string | null
          signed_pdf_url?: string | null
          status?: string
          title_closing?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          additional_info?: Json
          buyer_name?: string | null
          contract_date?: string | null
          created_at?: string
          financial_details?: Json
          id?: string
          legacy_id?: string | null
          legal_sections?: Json
          marked_questions?: string[]
          mls_number?: string | null
          parties?: Json
          pdf_generated_at?: string | null
          pdf_url?: string | null
          progress?: Json
          property_address?: string | null
          property_info?: Json
          seller_name?: string | null
          signed_at?: string | null
          signed_pdf_url?: string | null
          status?: string
          title_closing?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      email_packets: {
        Row: {
          attachments: Json
          clicked_at: string | null
          contract_id: string
          email_body: string | null
          email_type: string | null
          id: string
          ip_address: unknown | null
          opened_at: string | null
          recipient_email: string
          recipient_name: string | null
          sent_at: string
          ses_message_id: string | null
          status: string
          subject: string | null
          tracking_pixel_viewed: boolean
          user_agent: string | null
        }
        Insert: {
          attachments?: Json
          clicked_at?: string | null
          contract_id: string
          email_body?: string | null
          email_type?: string | null
          id?: string
          ip_address?: unknown | null
          opened_at?: string | null
          recipient_email: string
          recipient_name?: string | null
          sent_at?: string
          ses_message_id?: string | null
          status?: string
          subject?: string | null
          tracking_pixel_viewed?: boolean
          user_agent?: string | null
        }
        Update: {
          attachments?: Json
          clicked_at?: string | null
          contract_id?: string
          email_body?: string | null
          email_type?: string | null
          id?: string
          ip_address?: unknown | null
          opened_at?: string | null
          recipient_email?: string
          recipient_name?: string | null
          sent_at?: string
          ses_message_id?: string | null
          status?: string
          subject?: string | null
          tracking_pixel_viewed?: boolean
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_packets_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      etch_packets: {
        Row: {
          anvil_cast_id: string | null
          completed_at: string | null
          contract_id: string
          created_at: string
          etch_packet_id: string
          expires_at: string | null
          id: string
          pdf_url: string | null
          sent_at: string | null
          signer_email: string | null
          signer_info: Json
          signer_name: string | null
          signed_pdf_url: string | null
          status: string
          viewed_at: string | null
          webhook_payload: Json
        }
        Insert: {
          anvil_cast_id?: string | null
          completed_at?: string | null
          contract_id: string
          created_at?: string
          etch_packet_id: string
          expires_at?: string | null
          id?: string
          pdf_url?: string | null
          sent_at?: string | null
          signer_email?: string | null
          signer_info?: Json
          signer_name?: string | null
          signed_pdf_url?: string | null
          status?: string
          viewed_at?: string | null
          webhook_payload?: Json
        }
        Update: {
          anvil_cast_id?: string | null
          completed_at?: string | null
          contract_id?: string
          created_at?: string
          etch_packet_id?: string
          expires_at?: string | null
          id?: string
          pdf_url?: string | null
          sent_at?: string | null
          signer_email?: string | null
          signer_info?: Json
          signer_name?: string | null
          signed_pdf_url?: string | null
          status?: string
          viewed_at?: string | null
          webhook_payload?: Json
        }
        Relationships: [
          {
            foreignKeyName: "etch_packets_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      contract_summaries: {
        Row: {
          buyer_name: string | null
          contract_date: string | null
          created_at: string | null
          document_count: number | null
          email_packet_count: number | null
          etch_packet_count: number | null
          id: string | null
          latest_etch_status: string | null
          mls_number: string | null
          property_address: string | null
          property_city: string | null
          property_state: string | null
          purchase_price: number | null
          seller_name: string | null
          status: string | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_contract_progress: {
        Args: {
          contract_row: unknown
        }
        Returns: number
      }
      search_agents: {
        Args: {
          search_term: string
          limit_count?: number
        }
        Returns: {
          brokerage: string | null
          city: string | null
          email: string | null
          id: string
          mls_id: string | null
          name: string
          phone: string | null
          rank: number
          state: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Additional TypeScript types for the application
export interface ContractFormData {
  id?: string
  property_info: {
    address?: string
    city?: string
    state?: string
    zipCode?: string
    county?: string
    mlsNumber?: string
    legalDescription?: string
    yearBuilt?: string
    squareFeet?: string
    lotSize?: string
    bedrooms?: string
    bathrooms?: string
  }
  parties: {
    primaryBuyer?: {
      name?: string
      email?: string
      phone?: string
      address?: string
    }
    secondaryBuyer?: {
      name?: string
      email?: string
    }
    primarySeller?: {
      name?: string
      email?: string
      phone?: string
      address?: string
    }
    secondarySeller?: {
      name?: string
      email?: string
    }
  }
  financial_details: {
    purchasePrice?: number
    earnestMoney?: number
    downPayment?: number
    loanAmount?: number
    optionFee?: number
    effectiveDate?: string
    closingDate?: string
    optionPeriodEnd?: string
    inspectionPeriod?: string
    financingType?: string
    loanType?: string
    interestRate?: string
  }
  title_closing: {
    titleCompany?: {
      name?: string
      address?: string
    }
    escrowOfficer?: string
  }
  legal_sections: {
    surveyRequired?: boolean
  }
  additional_info?: Record<string, any>
  progress?: Record<string, boolean>
  marked_questions?: string[]
}

export interface AgentSearchResult {
  id: string
  name: string
  email?: string
  phone?: string
  mls_id?: string
  brokerage?: string
  city?: string
  state?: string
  rank?: number
  isVerified?: boolean
  contactInfo?: string
  displayName?: string
}

export interface EtchPacketData {
  id: string
  contract_id: string
  etch_packet_id: string
  status: 'pending' | 'sent' | 'viewed' | 'signed' | 'completed' | 'cancelled' | 'expired'
  signer_email?: string
  signer_name?: string
  pdf_url?: string
  signed_pdf_url?: string
  created_at: string
  sent_at?: string
  viewed_at?: string
  completed_at?: string
  expires_at?: string
  signer_info?: {
    name?: string
    email?: string
    signURL?: string
    signedAt?: string
  }
}

export interface EmailPacketData {
  id: string
  contract_id: string
  recipient_email: string
  recipient_name?: string
  email_type: 'listing_agent' | 'buyer' | 'seller' | 'title_company' | 'lender'
  sent_at: string
  opened_at?: string
  clicked_at?: string
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained' | 'failed'
  subject?: string
  ses_message_id?: string
}
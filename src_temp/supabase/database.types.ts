export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      agent_memory: {
        Row: {
          agent_type: string
          contact_id: string | null
          content: string
          created_at: string | null
          id: string
          memory_type: string
          metadata: Json | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          agent_type?: string
          contact_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          memory_type?: string
          metadata?: Json | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          agent_type?: string
          contact_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          memory_type?: string
          metadata?: Json | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_memory_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_memory_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_drafts: {
        Row: {
          ai_model: string | null
          case_id: string | null
          content: string
          created_at: string | null
          created_by: string
          draft_type: string | null
          id: string
          metadata: Json | null
          prompt_used: string | null
          status: string | null
          tenant_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          ai_model?: string | null
          case_id?: string | null
          content: string
          created_at?: string | null
          created_by: string
          draft_type?: string | null
          id?: string
          metadata?: Json | null
          prompt_used?: string | null
          status?: string | null
          tenant_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          ai_model?: string | null
          case_id?: string | null
          content?: string
          created_at?: string | null
          created_by?: string
          draft_type?: string | null
          id?: string
          metadata?: Json | null
          prompt_used?: string | null
          status?: string | null
          tenant_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_drafts_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_drafts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          tenant_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          tenant_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          tenant_id?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          all_day: boolean | null
          case_id: string | null
          color: string | null
          created_at: string | null
          created_by: string
          description: string | null
          end_at: string | null
          id: string
          location: string | null
          metadata: Json | null
          recurrence_rule: string | null
          start_at: string
          tenant_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          all_day?: boolean | null
          case_id?: string | null
          color?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          end_at?: string | null
          id?: string
          location?: string | null
          metadata?: Json | null
          recurrence_rule?: string | null
          start_at: string
          tenant_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          all_day?: boolean | null
          case_id?: string | null
          color?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          end_at?: string | null
          id?: string
          location?: string | null
          metadata?: Json | null
          recurrence_rule?: string | null
          start_at?: string
          tenant_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      case_documents: {
        Row: {
          ai_summary: string | null
          case_id: string
          created_at: string | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          metadata: Json | null
          tenant_id: string
          uploaded_by: string | null
        }
        Insert: {
          ai_summary?: string | null
          case_id: string
          created_at?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          metadata?: Json | null
          tenant_id: string
          uploaded_by?: string | null
        }
        Update: {
          ai_summary?: string | null
          case_id?: string
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          metadata?: Json | null
          tenant_id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_documents_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_documents_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      case_movements: {
        Row: {
          case_id: string
          created_at: string | null
          description: string | null
          external_id: string | null
          id: string
          metadata: Json | null
          occurred_at: string
          source: string | null
          tenant_id: string
          title: string
        }
        Insert: {
          case_id: string
          created_at?: string | null
          description?: string | null
          external_id?: string | null
          id?: string
          metadata?: Json | null
          occurred_at?: string
          source?: string | null
          tenant_id: string
          title: string
        }
        Update: {
          case_id?: string
          created_at?: string | null
          description?: string | null
          external_id?: string | null
          id?: string
          metadata?: Json | null
          occurred_at?: string
          source?: string | null
          tenant_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_movements_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_movements_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      case_notes: {
        Row: {
          author_id: string
          case_id: string
          content: string
          created_at: string | null
          id: string
          is_private: boolean | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          case_id: string
          content: string
          created_at?: string | null
          id?: string
          is_private?: boolean | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          case_id?: string
          content?: string
          created_at?: string | null
          id?: string
          is_private?: boolean | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_notes_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_notes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          area: Database["public"]["Enums"]["case_area"]
          assigned_to: string | null
          case_number: string | null
          contact_id: string | null
          court: string | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          status: Database["public"]["Enums"]["case_status"]
          tags: string[] | null
          tenant_id: string
          title: string
          updated_at: string | null
          urgency: Database["public"]["Enums"]["urgency_level"]
          value_estimate: number | null
        }
        Insert: {
          area?: Database["public"]["Enums"]["case_area"]
          assigned_to?: string | null
          case_number?: string | null
          contact_id?: string | null
          court?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          status?: Database["public"]["Enums"]["case_status"]
          tags?: string[] | null
          tenant_id: string
          title: string
          updated_at?: string | null
          urgency?: Database["public"]["Enums"]["urgency_level"]
          value_estimate?: number | null
        }
        Update: {
          area?: Database["public"]["Enums"]["case_area"]
          assigned_to?: string | null
          case_number?: string | null
          contact_id?: string | null
          court?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          status?: Database["public"]["Enums"]["case_status"]
          tags?: string[] | null
          tenant_id?: string
          title?: string
          updated_at?: string | null
          urgency?: Database["public"]["Enums"]["urgency_level"]
          value_estimate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cases_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          address: Json | null
          cpf_cnpj: string | null
          created_at: string | null
          deleted_at: string | null
          email: string | null
          full_name: string
          id: string
          lead_score: number | null
          notes: string | null
          phone: string | null
          tags: string[] | null
          tenant_id: string
          type: Database["public"]["Enums"]["contact_type"]
          updated_at: string | null
        }
        Insert: {
          address?: Json | null
          cpf_cnpj?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          lead_score?: number | null
          notes?: string | null
          phone?: string | null
          tags?: string[] | null
          tenant_id: string
          type?: Database["public"]["Enums"]["contact_type"]
          updated_at?: string | null
        }
        Update: {
          address?: Json | null
          cpf_cnpj?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          lead_score?: number | null
          notes?: string | null
          phone?: string | null
          tags?: string[] | null
          tenant_id?: string
          type?: Database["public"]["Enums"]["contact_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          assigned_to: string | null
          channel: Database["public"]["Enums"]["channel_type"]
          contact_id: string | null
          created_at: string | null
          deleted_at: string | null
          external_id: string | null
          id: string
          is_ai_active: boolean | null
          last_message_at: string | null
          metadata: Json | null
          status: Database["public"]["Enums"]["conversation_status"]
          subject: string | null
          tags: string[] | null
          tenant_id: string
          unread_count: number | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          channel: Database["public"]["Enums"]["channel_type"]
          contact_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          external_id?: string | null
          id?: string
          is_ai_active?: boolean | null
          last_message_at?: string | null
          metadata?: Json | null
          status?: Database["public"]["Enums"]["conversation_status"]
          subject?: string | null
          tags?: string[] | null
          tenant_id: string
          unread_count?: number | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          channel?: Database["public"]["Enums"]["channel_type"]
          contact_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          external_id?: string | null
          id?: string
          is_ai_active?: boolean | null
          last_message_at?: string | null
          metadata?: Json | null
          status?: Database["public"]["Enums"]["conversation_status"]
          subject?: string | null
          tags?: string[] | null
          tenant_id?: string
          unread_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      court_fees: {
        Row: {
          amount: number
          case_id: string
          created_at: string | null
          description: string
          due_date: string | null
          guide_number: string | null
          id: string
          metadata: Json | null
          paid_at: string | null
          status: Database["public"]["Enums"]["court_fee_status"]
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          case_id: string
          created_at?: string | null
          description: string
          due_date?: string | null
          guide_number?: string | null
          id?: string
          metadata?: Json | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["court_fee_status"]
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          case_id?: string
          created_at?: string | null
          description?: string
          due_date?: string | null
          guide_number?: string | null
          id?: string
          metadata?: Json | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["court_fee_status"]
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "court_fees_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "court_fees_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      court_holidays: {
        Row: {
          court: string | null
          created_at: string | null
          date: string
          id: string
          name: string
          recurring: boolean | null
          scope: string
          state: string | null
        }
        Insert: {
          court?: string | null
          created_at?: string | null
          date: string
          id?: string
          name: string
          recurring?: boolean | null
          scope?: string
          state?: string | null
        }
        Update: {
          court?: string | null
          created_at?: string | null
          date?: string
          id?: string
          name?: string
          recurring?: boolean | null
          scope?: string
          state?: string | null
        }
        Relationships: []
      }
      deadlines: {
        Row: {
          alert_sent: boolean | null
          business_days: number | null
          case_id: string
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          is_suspended: boolean | null
          metadata: Json | null
          start_date: string
          suspension_reason: string | null
          tenant_id: string
          title: string
          type: Database["public"]["Enums"]["deadline_type"]
          updated_at: string | null
        }
        Insert: {
          alert_sent?: boolean | null
          business_days?: number | null
          case_id: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          is_suspended?: boolean | null
          metadata?: Json | null
          start_date: string
          suspension_reason?: string | null
          tenant_id: string
          title: string
          type?: Database["public"]["Enums"]["deadline_type"]
          updated_at?: string | null
        }
        Update: {
          alert_sent?: boolean | null
          business_days?: number | null
          case_id?: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          is_suspended?: boolean | null
          metadata?: Json | null
          start_date?: string
          suspension_reason?: string | null
          tenant_id?: string
          title?: string
          type?: Database["public"]["Enums"]["deadline_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deadlines_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deadlines_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      document_embeddings: {
        Row: {
          chunk_index: number | null
          content: string
          created_at: string | null
          embedding: string | null
          id: string
          metadata: Json | null
          source_id: string | null
          source_type: string
          tenant_id: string
        }
        Insert: {
          chunk_index?: number | null
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          source_id?: string | null
          source_type?: string
          tenant_id: string
        }
        Update: {
          chunk_index?: number | null
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          source_id?: string | null
          source_type?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_embeddings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      follow_up_executions: {
        Row: {
          contact_id: string
          conversation_id: string | null
          created_at: string | null
          error_message: string | null
          executed_at: string | null
          id: string
          metadata: Json | null
          rule_id: string
          scheduled_at: string
          status: string
          tenant_id: string
        }
        Insert: {
          contact_id: string
          conversation_id?: string | null
          created_at?: string | null
          error_message?: string | null
          executed_at?: string | null
          id?: string
          metadata?: Json | null
          rule_id: string
          scheduled_at: string
          status?: string
          tenant_id: string
        }
        Update: {
          contact_id?: string
          conversation_id?: string | null
          created_at?: string | null
          error_message?: string | null
          executed_at?: string | null
          id?: string
          metadata?: Json | null
          rule_id?: string
          scheduled_at?: string
          status?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_up_executions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_up_executions_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_up_executions_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "follow_up_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_up_executions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      follow_up_rules: {
        Row: {
          channel: Database["public"]["Enums"]["channel_type"]
          conditions: Json | null
          created_at: string | null
          created_by: string | null
          delay_days: number
          delay_hours: number | null
          id: string
          is_active: boolean | null
          message_template: string
          name: string
          sort_order: number | null
          stage: Database["public"]["Enums"]["follow_up_stage"]
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          channel?: Database["public"]["Enums"]["channel_type"]
          conditions?: Json | null
          created_at?: string | null
          created_by?: string | null
          delay_days?: number
          delay_hours?: number | null
          id?: string
          is_active?: boolean | null
          message_template: string
          name: string
          sort_order?: number | null
          stage: Database["public"]["Enums"]["follow_up_stage"]
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          channel?: Database["public"]["Enums"]["channel_type"]
          conditions?: Json | null
          created_at?: string | null
          created_by?: string | null
          delay_days?: number
          delay_hours?: number | null
          id?: string
          is_active?: boolean | null
          message_template?: string
          name?: string
          sort_order?: number | null
          stage?: Database["public"]["Enums"]["follow_up_stage"]
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "follow_up_rules_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          case_id: string | null
          contact_id: string | null
          created_at: string | null
          created_by: string
          deleted_at: string | null
          description: string | null
          due_date: string | null
          id: string
          invoice_number: string | null
          items: Json | null
          metadata: Json | null
          paid_at: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          case_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          created_by: string
          deleted_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          items?: Json | null
          metadata?: Json | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          case_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          created_by?: string
          deleted_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          items?: Json | null
          metadata?: Json | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      macros: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          steps: Json
          tenant_id: string
          trigger_type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          steps?: Json
          tenant_id: string
          trigger_type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          steps?: Json
          tenant_id?: string
          trigger_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "macros_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      message_tags: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          name: string
          tenant_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          name: string
          tenant_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          name?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_tags_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string | null
          content_type: string | null
          conversation_id: string
          created_at: string | null
          external_id: string | null
          id: string
          is_ai_generated: boolean | null
          media_type: string | null
          media_url: string | null
          metadata: Json | null
          sender_id: string | null
          sender_type: string
          tenant_id: string
        }
        Insert: {
          content?: string | null
          content_type?: string | null
          conversation_id: string
          created_at?: string | null
          external_id?: string | null
          id?: string
          is_ai_generated?: boolean | null
          media_type?: string | null
          media_url?: string | null
          metadata?: Json | null
          sender_id?: string | null
          sender_type?: string
          tenant_id: string
        }
        Update: {
          content?: string | null
          content_type?: string | null
          conversation_id?: string
          created_at?: string | null
          external_id?: string | null
          id?: string
          is_ai_generated?: boolean | null
          media_type?: string | null
          media_url?: string | null
          metadata?: Json | null
          sender_id?: string | null
          sender_type?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      nps_surveys: {
        Row: {
          case_id: string | null
          channel: Database["public"]["Enums"]["channel_type"] | null
          contact_id: string
          created_at: string | null
          feedback: string | null
          id: string
          responded_at: string | null
          score: number | null
          sent_at: string
          tenant_id: string
        }
        Insert: {
          case_id?: string | null
          channel?: Database["public"]["Enums"]["channel_type"] | null
          contact_id: string
          created_at?: string | null
          feedback?: string | null
          id?: string
          responded_at?: string | null
          score?: number | null
          sent_at?: string
          tenant_id: string
        }
        Update: {
          case_id?: string | null
          channel?: Database["public"]["Enums"]["channel_type"] | null
          contact_id?: string
          created_at?: string | null
          feedback?: string | null
          id?: string
          responded_at?: string | null
          score?: number | null
          sent_at?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nps_surveys_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nps_surveys_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nps_surveys_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_orders: {
        Row: {
          amount: number
          case_id: string
          collected_at: string | null
          contact_id: string | null
          created_at: string | null
          description: string
          id: string
          issued_at: string
          metadata: Json | null
          order_number: string | null
          status: Database["public"]["Enums"]["payment_order_status"]
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          case_id: string
          collected_at?: string | null
          contact_id?: string | null
          created_at?: string | null
          description: string
          id?: string
          issued_at?: string
          metadata?: Json | null
          order_number?: string | null
          status?: Database["public"]["Enums"]["payment_order_status"]
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          case_id?: string
          collected_at?: string | null
          contact_id?: string | null
          created_at?: string | null
          description?: string
          id?: string
          issued_at?: string
          metadata?: Json | null
          order_number?: string | null
          status?: Database["public"]["Enums"]["payment_order_status"]
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_orders_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_orders_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_orders_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      private_notes: {
        Row: {
          author_id: string
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          tenant_id: string
        }
        Insert: {
          author_id: string
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          tenant_id: string
        }
        Update: {
          author_id?: string
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "private_notes_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "private_notes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string
          id: string
          role: string | null
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name: string
          id: string
          role?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string
          id?: string
          role?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      quick_replies: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          shortcut: string | null
          tenant_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          shortcut?: string | null
          tenant_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          shortcut?: string | null
          tenant_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quick_replies_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      skills_library: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          input_schema: Json | null
          is_active: boolean | null
          name: string
          prompt_template: string
          tenant_id: string
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          input_schema?: Json | null
          is_active?: boolean | null
          name: string
          prompt_template: string
          tenant_id: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          input_schema?: Json | null
          is_active?: boolean | null
          name?: string
          prompt_template?: string
          tenant_id?: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "skills_library_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          case_id: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string
          description: string | null
          due_date: string | null
          id: string
          priority: Database["public"]["Enums"]["urgency_level"]
          status: Database["public"]["Enums"]["task_status"]
          tenant_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          case_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["urgency_level"]
          status?: Database["public"]["Enums"]["task_status"]
          tenant_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          case_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["urgency_level"]
          status?: Database["public"]["Enums"]["task_status"]
          tenant_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_members: {
        Row: {
          created_at: string | null
          id: string
          role: string
          tenant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: string
          tenant_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_members_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string | null
          id: string
          name: string
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          settings?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      case_area:
        | "civil"
        | "trabalhista"
        | "criminal"
        | "tributario"
        | "previdenciario"
        | "familia"
        | "empresarial"
        | "consumidor"
        | "ambiental"
        | "administrativo"
        | "outro"
      case_status:
        | "novo"
        | "em_andamento"
        | "aguardando_prazo"
        | "aguardando_cliente"
        | "aguardando_julgamento"
        | "suspenso"
        | "arquivado"
        | "encerrado"
      channel_type: "whatsapp" | "email" | "chat" | "telefone"
      contact_type:
        | "cliente"
        | "lead"
        | "testemunha"
        | "perito"
        | "parte_contraria"
        | "advogado_externo"
        | "outro"
      conversation_status:
        | "aberta"
        | "em_atendimento"
        | "aguardando_hitl"
        | "resolvida"
        | "arquivada"
      court_fee_status: "pendente" | "paga" | "compensada" | "vencida"
      deadline_type: "peremptorio" | "diligencial" | "convencional"
      follow_up_stage:
        | "lead_novo"
        | "pre_consulta"
        | "cliente_ativo"
        | "pos_venda"
      invoice_status: "rascunho" | "enviada" | "paga" | "vencida" | "cancelada"
      payment_order_status:
        | "expedido"
        | "aguardando_levantamento"
        | "levantado"
        | "devolvido"
      task_status: "pendente" | "em_progresso" | "concluida" | "cancelada"
      urgency_level: "baixa" | "media" | "alta" | "critica"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      case_area: [
        "civil",
        "trabalhista",
        "criminal",
        "tributario",
        "previdenciario",
        "familia",
        "empresarial",
        "consumidor",
        "ambiental",
        "administrativo",
        "outro",
      ],
      case_status: [
        "novo",
        "em_andamento",
        "aguardando_prazo",
        "aguardando_cliente",
        "aguardando_julgamento",
        "suspenso",
        "arquivado",
        "encerrado",
      ],
      channel_type: ["whatsapp", "email", "chat", "telefone"],
      contact_type: [
        "cliente",
        "lead",
        "testemunha",
        "perito",
        "parte_contraria",
        "advogado_externo",
        "outro",
      ],
      conversation_status: [
        "aberta",
        "em_atendimento",
        "aguardando_hitl",
        "resolvida",
        "arquivada",
      ],
      court_fee_status: ["pendente", "paga", "compensada", "vencida"],
      deadline_type: ["peremptorio", "diligencial", "convencional"],
      follow_up_stage: [
        "lead_novo",
        "pre_consulta",
        "cliente_ativo",
        "pos_venda",
      ],
      invoice_status: ["rascunho", "enviada", "paga", "vencida", "cancelada"],
      payment_order_status: [
        "expedido",
        "aguardando_levantamento",
        "levantado",
        "devolvido",
      ],
      task_status: ["pendente", "em_progresso", "concluida", "cancelada"],
      urgency_level: ["baixa", "media", "alta", "critica"],
    },
  },
} as const


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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_credentials: {
        Row: {
          access_code: string
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_code: string
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_code?: string
          created_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_login_logs: {
        Row: {
          created_at: string
          email: string | null
          id: string
          reason: string | null
          success: boolean
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          reason?: string | null
          success?: boolean
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          reason?: string | null
          success?: boolean
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      agent_applications: {
        Row: {
          city: string
          created_at: string
          email: string
          experience: string | null
          full_name: string
          id: string
          phone: string
          status: string
          user_id: string | null
          why: string | null
        }
        Insert: {
          city: string
          created_at?: string
          email: string
          experience?: string | null
          full_name: string
          id?: string
          phone: string
          status?: string
          user_id?: string | null
          why?: string | null
        }
        Update: {
          city?: string
          created_at?: string
          email?: string
          experience?: string | null
          full_name?: string
          id?: string
          phone?: string
          status?: string
          user_id?: string | null
          why?: string | null
        }
        Relationships: []
      }
      coach_posts: {
        Row: {
          author_id: string
          body: string
          created_at: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      credit_ledger: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          id: string
          pickup_request_id: string | null
          reason: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          id?: string
          pickup_request_id?: string | null
          reason: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          id?: string
          pickup_request_id?: string | null
          reason?: string
          user_id?: string
        }
        Relationships: []
      }
      pickup_requests: {
        Row: {
          address: string
          category_id: string | null
          city: string | null
          created_at: string
          credits_awarded: number
          estimated_weight_kg: number
          id: string
          notes: string | null
          preferred_date: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          category_id?: string | null
          city?: string | null
          created_at?: string
          credits_awarded?: number
          estimated_weight_kg: number
          id?: string
          notes?: string | null
          preferred_date?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          category_id?: string | null
          city?: string | null
          created_at?: string
          credits_awarded?: number
          estimated_weight_kg?: number
          id?: string
          notes?: string | null
          preferred_date?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pickup_requests_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "waste_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          total_credits: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          total_credits?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          total_credits?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      waste_categories: {
        Row: {
          created_at: string
          credits_per_kg: number
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          credits_per_kg?: number
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          credits_per_kg?: number
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "agent" | "user"
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
      app_role: ["admin", "agent", "user"],
    },
  },
} as const

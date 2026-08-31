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
      banner_content: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          text: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          text?: string
          updated_at?: string
        }
        Relationships: []
      }
      banner_images: {
        Row: {
          alt_text: string
          created_at: string
          display_order: number
          id: string
          image_url: string
          is_active: boolean
          link_url: string | null
          updated_at: string
        }
        Insert: {
          alt_text?: string
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          is_active?: boolean
          link_url?: string | null
          updated_at?: string
        }
        Update: {
          alt_text?: string
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          is_active?: boolean
          link_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          additional_message: string | null
          booking_date: string
          booking_time: string
          created_at: string
          customer_name: string
          driver_id: string | null
          drop_location: string
          id: string
          mobile_number: string
          pickup_location: string
          status: string
          trip_type: string
          updated_at: string
          vehicle_type: string
        }
        Insert: {
          additional_message?: string | null
          booking_date: string
          booking_time: string
          created_at?: string
          customer_name: string
          driver_id?: string | null
          drop_location: string
          id?: string
          mobile_number: string
          pickup_location: string
          status?: string
          trip_type: string
          updated_at?: string
          vehicle_type: string
        }
        Update: {
          additional_message?: string | null
          booking_date?: string
          booking_time?: string
          created_at?: string
          customer_name?: string
          driver_id?: string | null
          drop_location?: string
          id?: string
          mobile_number?: string
          pickup_location?: string
          status?: string
          trip_type?: string
          updated_at?: string
          vehicle_type?: string
        }
        Relationships: []
      }
      cars: {
        Row: {
          category: string
          created_at: string
          description: string | null
          features: string[] | null
          id: string
          image: string | null
          is_active: boolean | null
          name: string
          price: string
          rating: number | null
          type: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          image?: string | null
          is_active?: boolean | null
          name: string
          price: string
          rating?: number | null
          type: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          image?: string | null
          is_active?: boolean | null
          name?: string
          price?: string
          rating?: number | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      customer_bookings: {
        Row: {
          booking_date: string
          booking_time: string
          commission_amount: number | null
          created_at: string
          distance_km: number | null
          driver_earnings: number | null
          driver_id: string | null
          drop_location: string
          estimated_fare: number | null
          id: string
          notes: string | null
          pickup_location: string
          status: string
          trip_type: string
          updated_at: string
          user_id: string
          vehicle_type: string
        }
        Insert: {
          booking_date: string
          booking_time: string
          commission_amount?: number | null
          created_at?: string
          distance_km?: number | null
          driver_earnings?: number | null
          driver_id?: string | null
          drop_location: string
          estimated_fare?: number | null
          id?: string
          notes?: string | null
          pickup_location: string
          status?: string
          trip_type?: string
          updated_at?: string
          user_id: string
          vehicle_type: string
        }
        Update: {
          booking_date?: string
          booking_time?: string
          commission_amount?: number | null
          created_at?: string
          distance_km?: number | null
          driver_earnings?: number | null
          driver_id?: string | null
          drop_location?: string
          estimated_fare?: number | null
          id?: string
          notes?: string | null
          pickup_location?: string
          status?: string
          trip_type?: string
          updated_at?: string
          user_id?: string
          vehicle_type?: string
        }
        Relationships: []
      }
      driver_applications: {
        Row: {
          created_at: string
          experience_years: number | null
          id: string
          license_number: string
          status: string
          updated_at: string
          user_id: string
          vehicle_info: string | null
        }
        Insert: {
          created_at?: string
          experience_years?: number | null
          id?: string
          license_number: string
          status?: string
          updated_at?: string
          user_id: string
          vehicle_info?: string | null
        }
        Update: {
          created_at?: string
          experience_years?: number | null
          id?: string
          license_number?: string
          status?: string
          updated_at?: string
          user_id?: string
          vehicle_info?: string | null
        }
        Relationships: []
      }
      driver_wallets: {
        Row: {
          available_balance: number
          created_at: string
          driver_id: string
          id: string
          lifetime_earnings: number
          pending_balance: number
          total_earnings: number
          total_withdrawn: number
          updated_at: string
        }
        Insert: {
          available_balance?: number
          created_at?: string
          driver_id: string
          id?: string
          lifetime_earnings?: number
          pending_balance?: number
          total_earnings?: number
          total_withdrawn?: number
          updated_at?: string
        }
        Update: {
          available_balance?: number
          created_at?: string
          driver_id?: string
          id?: string
          lifetime_earnings?: number
          pending_balance?: number
          total_earnings?: number
          total_withdrawn?: number
          updated_at?: string
        }
        Relationships: []
      }
      fares: {
        Row: {
          created_at: string
          from_location: string
          id: string
          price: string
          to_location: string
          updated_at: string
          vehicle_type: string
        }
        Insert: {
          created_at?: string
          from_location: string
          id?: string
          price: string
          to_location: string
          updated_at?: string
          vehicle_type: string
        }
        Update: {
          created_at?: string
          from_location?: string
          id?: string
          price?: string
          to_location?: string
          updated_at?: string
          vehicle_type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      saved_locations: {
        Row: {
          address: string
          created_at: string
          id: string
          label: string
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          label: string
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          label?: string
          user_id?: string
        }
        Relationships: []
      }
      tour_packages: {
        Row: {
          created_at: string
          description: string
          highlights: string[] | null
          id: string
          image: string | null
          inclusions: string[] | null
          price: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          highlights?: string[] | null
          id?: string
          image?: string | null
          inclusions?: string[] | null
          price: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          highlights?: string[] | null
          id?: string
          image?: string | null
          inclusions?: string[] | null
          price?: string
          title?: string
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
      wallet_config: {
        Row: {
          commission_percent: number
          id: boolean
          max_withdrawal: number
          min_withdrawal: number
          updated_at: string
        }
        Insert: {
          commission_percent?: number
          id?: boolean
          max_withdrawal?: number
          min_withdrawal?: number
          updated_at?: string
        }
        Update: {
          commission_percent?: number
          id?: boolean
          max_withdrawal?: number
          min_withdrawal?: number
          updated_at?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          balance_after: number
          balance_before: number
          created_at: string
          description: string | null
          driver_id: string
          id: string
          ride_id: string | null
          type: Database["public"]["Enums"]["wallet_txn_type"]
        }
        Insert: {
          amount: number
          balance_after: number
          balance_before: number
          created_at?: string
          description?: string | null
          driver_id: string
          id?: string
          ride_id?: string | null
          type: Database["public"]["Enums"]["wallet_txn_type"]
        }
        Update: {
          amount?: number
          balance_after?: number
          balance_before?: number
          created_at?: string
          description?: string | null
          driver_id?: string
          id?: string
          ride_id?: string | null
          type?: Database["public"]["Enums"]["wallet_txn_type"]
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "customer_bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      withdrawal_requests: {
        Row: {
          admin_notes: string | null
          amount: number
          created_at: string
          driver_id: string
          id: string
          processed_at: string | null
          processed_by: string | null
          status: Database["public"]["Enums"]["withdrawal_status"]
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          created_at?: string
          driver_id: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: Database["public"]["Enums"]["withdrawal_status"]
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          created_at?: string
          driver_id?: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: Database["public"]["Enums"]["withdrawal_status"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_wallet_adjustment: {
        Args: {
          _amount: number
          _description: string
          _driver_id: string
          _ride_id?: string
          _type: Database["public"]["Enums"]["wallet_txn_type"]
        }
        Returns: undefined
      }
      credit_ride_earnings: {
        Args: { _booking_id: string }
        Returns: undefined
      }
      ensure_driver_wallet: {
        Args: { _driver_id: string }
        Returns: {
          available_balance: number
          created_at: string
          driver_id: string
          id: string
          lifetime_earnings: number
          pending_balance: number
          total_earnings: number
          total_withdrawn: number
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "driver_wallets"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      process_withdrawal: {
        Args: {
          _new_status: Database["public"]["Enums"]["withdrawal_status"]
          _notes?: string
          _request_id: string
        }
        Returns: undefined
      }
      request_withdrawal: { Args: { _amount: number }; Returns: string }
    }
    Enums: {
      app_role: "admin" | "user" | "driver"
      wallet_txn_type:
        | "ride_credit"
        | "commission_deduction"
        | "bonus"
        | "penalty"
        | "refund"
        | "withdrawal"
        | "adjustment"
      withdrawal_status:
        | "pending"
        | "processing"
        | "approved"
        | "rejected"
        | "completed"
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
      app_role: ["admin", "user", "driver"],
      wallet_txn_type: [
        "ride_credit",
        "commission_deduction",
        "bonus",
        "penalty",
        "refund",
        "withdrawal",
        "adjustment",
      ],
      withdrawal_status: [
        "pending",
        "processing",
        "approved",
        "rejected",
        "completed",
      ],
    },
  },
} as const

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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      booking_nights: {
        Row: {
          booking_id: string
          date: string
          id: string
          nightly_rate: number
        }
        Insert: {
          booking_id: string
          date: string
          id?: string
          nightly_rate: number
        }
        Update: {
          booking_id?: string
          date?: string
          id?: string
          nightly_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "booking_nights_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          accommodation_subtotal: number
          additional_fees: number
          adults: number
          booking_code: string
          cabin_id: string
          check_in: string
          check_out: string
          children: number
          cleaning_fee: number
          created_at: string
          discount: number
          guest_document: string | null
          guest_email: string
          guest_name: string
          guest_phone: string
          guests: number
          id: string
          nights: number
          notes: string | null
          status: Database["public"]["Enums"]["booking_status"]
          total_amount: number
          updated_at: string
          whatsapp_notification_sent_at: string | null
          whatsapp_notification_status: Database["public"]["Enums"]["notification_status"]
        }
        Insert: {
          accommodation_subtotal?: number
          additional_fees?: number
          adults?: number
          booking_code: string
          cabin_id: string
          check_in: string
          check_out: string
          children?: number
          cleaning_fee?: number
          created_at?: string
          discount?: number
          guest_document?: string | null
          guest_email: string
          guest_name: string
          guest_phone: string
          guests: number
          id?: string
          nights: number
          notes?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          total_amount?: number
          updated_at?: string
          whatsapp_notification_sent_at?: string | null
          whatsapp_notification_status?: Database["public"]["Enums"]["notification_status"]
        }
        Update: {
          accommodation_subtotal?: number
          additional_fees?: number
          adults?: number
          booking_code?: string
          cabin_id?: string
          check_in?: string
          check_out?: string
          children?: number
          cleaning_fee?: number
          created_at?: string
          discount?: number
          guest_document?: string | null
          guest_email?: string
          guest_name?: string
          guest_phone?: string
          guests?: number
          id?: string
          nights?: number
          notes?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          total_amount?: number
          updated_at?: string
          whatsapp_notification_sent_at?: string | null
          whatsapp_notification_status?: Database["public"]["Enums"]["notification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "bookings_cabin_id_fkey"
            columns: ["cabin_id"]
            isOneToOne: false
            referencedRelation: "cabins"
            referencedColumns: ["id"]
          },
        ]
      }
      business_settings: {
        Row: {
          address: string | null
          business_name: string
          business_whatsapp: string | null
          contact_email: string | null
          created_at: string
          id: string
          instagram_url: string | null
          notification_target: Database["public"]["Enums"]["notification_target"]
          notification_whatsapp: string | null
          timezone: string
          updated_at: string
          whatsapp_notifications_enabled: boolean
        }
        Insert: {
          address?: string | null
          business_name?: string
          business_whatsapp?: string | null
          contact_email?: string | null
          created_at?: string
          id?: string
          instagram_url?: string | null
          notification_target?: Database["public"]["Enums"]["notification_target"]
          notification_whatsapp?: string | null
          timezone?: string
          updated_at?: string
          whatsapp_notifications_enabled?: boolean
        }
        Update: {
          address?: string | null
          business_name?: string
          business_whatsapp?: string | null
          contact_email?: string | null
          created_at?: string
          id?: string
          instagram_url?: string | null
          notification_target?: Database["public"]["Enums"]["notification_target"]
          notification_whatsapp?: string | null
          timezone?: string
          updated_at?: string
          whatsapp_notifications_enabled?: boolean
        }
        Relationships: []
      }
      cabin_admins: {
        Row: {
          cabin_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          cabin_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          cabin_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cabin_admins_cabin_id_fkey"
            columns: ["cabin_id"]
            isOneToOne: false
            referencedRelation: "cabins"
            referencedColumns: ["id"]
          },
        ]
      }
      cabin_blocked_dates: {
        Row: {
          cabin_id: string
          created_at: string
          created_by: string | null
          end_date: string
          id: string
          reason: string | null
          start_date: string
        }
        Insert: {
          cabin_id: string
          created_at?: string
          created_by?: string | null
          end_date: string
          id?: string
          reason?: string | null
          start_date: string
        }
        Update: {
          cabin_id?: string
          created_at?: string
          created_by?: string | null
          end_date?: string
          id?: string
          reason?: string | null
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "cabin_blocked_dates_cabin_id_fkey"
            columns: ["cabin_id"]
            isOneToOne: false
            referencedRelation: "cabins"
            referencedColumns: ["id"]
          },
        ]
      }
      cabin_daily_rates: {
        Row: {
          cabin_id: string
          created_at: string
          date: string
          id: string
          is_available: boolean
          min_nights: number
          price: number
          updated_at: string
        }
        Insert: {
          cabin_id: string
          created_at?: string
          date: string
          id?: string
          is_available?: boolean
          min_nights?: number
          price: number
          updated_at?: string
        }
        Update: {
          cabin_id?: string
          created_at?: string
          date?: string
          id?: string
          is_available?: boolean
          min_nights?: number
          price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cabin_daily_rates_cabin_id_fkey"
            columns: ["cabin_id"]
            isOneToOne: false
            referencedRelation: "cabins"
            referencedColumns: ["id"]
          },
        ]
      }
      cabins: {
        Row: {
          amenities: Json
          base_price: number
          bathrooms: number
          bedrooms: number
          beds: number
          cleaning_fee: number
          cover_image: string | null
          created_at: string
          description: string
          display_order: number
          gallery: Json
          id: string
          location: string
          max_guests: number
          name: string
          short_description: string
          slug: string
          status: Database["public"]["Enums"]["cabin_status"]
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          amenities?: Json
          base_price?: number
          bathrooms?: number
          bedrooms?: number
          beds?: number
          cleaning_fee?: number
          cover_image?: string | null
          created_at?: string
          description?: string
          display_order?: number
          gallery?: Json
          id?: string
          location?: string
          max_guests?: number
          name: string
          short_description?: string
          slug: string
          status?: Database["public"]["Enums"]["cabin_status"]
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          amenities?: Json
          base_price?: number
          bathrooms?: number
          bedrooms?: number
          beds?: number
          cleaning_fee?: number
          cover_image?: string | null
          created_at?: string
          description?: string
          display_order?: number
          gallery?: Json
          id?: string
          location?: string
          max_guests?: number
          name?: string
          short_description?: string
          slug?: string
          status?: Database["public"]["Enums"]["cabin_status"]
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      notification_logs: {
        Row: {
          booking_id: string | null
          channel: string
          created_at: string
          error_message: string | null
          id: string
          provider_message_id: string | null
          recipient: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["notification_status"]
          type: string
        }
        Insert: {
          booking_id?: string | null
          channel?: string
          created_at?: string
          error_message?: string | null
          id?: string
          provider_message_id?: string | null
          recipient?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["notification_status"]
          type: string
        }
        Update: {
          booking_id?: string | null
          channel?: string
          created_at?: string
          error_message?: string | null
          id?: string
          provider_message_id?: string | null
          recipient?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["notification_status"]
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_logs_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          whatsapp_number: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          whatsapp_number?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          whatsapp_number?: string | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cabin_calendar: {
        Args: { p_cabin_id: string; p_from: string; p_to: string }
        Returns: {
          date: string
          is_available: boolean
          min_nights: number
          price: number
        }[]
      }
      create_booking: {
        Args: {
          p_adults: number
          p_cabin_id: string
          p_check_in: string
          p_check_out: string
          p_children: number
          p_guest_document?: string
          p_guest_email: string
          p_guest_name: string
          p_guest_phone: string
          p_notes?: string
        }
        Returns: {
          accommodation_subtotal: number
          additional_fees: number
          adults: number
          booking_code: string
          cabin_id: string
          check_in: string
          check_out: string
          children: number
          cleaning_fee: number
          created_at: string
          discount: number
          guest_document: string | null
          guest_email: string
          guest_name: string
          guest_phone: string
          guests: number
          id: string
          nights: number
          notes: string | null
          status: Database["public"]["Enums"]["booking_status"]
          total_amount: number
          updated_at: string
          whatsapp_notification_sent_at: string | null
          whatsapp_notification_status: Database["public"]["Enums"]["notification_status"]
        }
        SetofOptions: {
          from: "*"
          to: "bookings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      generate_booking_code: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      manages_cabin: {
        Args: { _cabin_id: string; _user_id: string }
        Returns: boolean
      }
      public_booking_by_code: {
        Args: { p_code: string }
        Returns: {
          accommodation_subtotal: number
          booking_code: string
          cabin_name: string
          cabin_slug: string
          check_in: string
          check_out: string
          cleaning_fee: number
          guest_first_name: string
          guests: number
          nights: number
          status: Database["public"]["Enums"]["booking_status"]
          total_amount: number
        }[]
      }
      public_business_info: {
        Args: never
        Returns: {
          address: string
          business_name: string
          business_whatsapp: string
          contact_email: string
          instagram_url: string
        }[]
      }
    }
    Enums: {
      app_role: "super_admin" | "cabin_admin"
      booking_status: "pending" | "confirmed" | "cancelled" | "completed"
      cabin_status: "active" | "inactive" | "maintenance"
      notification_status: "pending" | "sent" | "failed" | "disabled"
      notification_target: "business" | "cabin_admin" | "both"
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
      app_role: ["super_admin", "cabin_admin"],
      booking_status: ["pending", "confirmed", "cancelled", "completed"],
      cabin_status: ["active", "inactive", "maintenance"],
      notification_status: ["pending", "sent", "failed", "disabled"],
      notification_target: ["business", "cabin_admin", "both"],
    },
  },
} as const

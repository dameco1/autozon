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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      buyer_selections: {
        Row: {
          car_id: string
          created_at: string
          id: string
          liked: boolean
          round: number
          user_id: string
        }
        Insert: {
          car_id: string
          created_at?: string
          id?: string
          liked?: boolean
          round?: number
          user_id: string
        }
        Update: {
          car_id?: string
          created_at?: string
          id?: string
          liked?: boolean
          round?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "buyer_selections_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
        ]
      }
      buyers: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          created_at: string
          id: string
          intent_level: string
          is_seed: boolean
          location: string
          name: string
          preferred_body_types: string[] | null
          preferred_fuel_types: string[] | null
          preferred_makes: string[] | null
          timing_preference: string | null
          type: string
          updated_at: string
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          id?: string
          intent_level?: string
          is_seed?: boolean
          location?: string
          name?: string
          preferred_body_types?: string[] | null
          preferred_fuel_types?: string[] | null
          preferred_makes?: string[] | null
          timing_preference?: string | null
          type?: string
          updated_at?: string
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          id?: string
          intent_level?: string
          is_seed?: boolean
          location?: string
          name?: string
          preferred_body_types?: string[] | null
          preferred_fuel_types?: string[] | null
          preferred_makes?: string[] | null
          timing_preference?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      cars: {
        Row: {
          accident_details: string | null
          accident_history: boolean | null
          body_type: string
          color: string | null
          condition_exterior: number | null
          condition_interior: number | null
          condition_score: number | null
          created_at: string
          demand_score: number | null
          description: string | null
          equipment: string[] | null
          fair_value_price: number | null
          features: string[] | null
          fuel_type: string
          id: string
          image_url: string | null
          is_seed: boolean
          make: string
          mileage: number
          model: string
          owner_id: string | null
          power_hp: number | null
          price: number
          status: string
          transmission: string
          updated_at: string
          vin: string | null
          year: number
        }
        Insert: {
          accident_details?: string | null
          accident_history?: boolean | null
          body_type?: string
          color?: string | null
          condition_exterior?: number | null
          condition_interior?: number | null
          condition_score?: number | null
          created_at?: string
          demand_score?: number | null
          description?: string | null
          equipment?: string[] | null
          fair_value_price?: number | null
          features?: string[] | null
          fuel_type?: string
          id?: string
          image_url?: string | null
          is_seed?: boolean
          make: string
          mileage?: number
          model: string
          owner_id?: string | null
          power_hp?: number | null
          price?: number
          status?: string
          transmission?: string
          updated_at?: string
          vin?: string | null
          year: number
        }
        Update: {
          accident_details?: string | null
          accident_history?: boolean | null
          body_type?: string
          color?: string | null
          condition_exterior?: number | null
          condition_interior?: number | null
          condition_score?: number | null
          created_at?: string
          demand_score?: number | null
          description?: string | null
          equipment?: string[] | null
          fair_value_price?: number | null
          features?: string[] | null
          fuel_type?: string
          id?: string
          image_url?: string | null
          is_seed?: boolean
          make?: string
          mileage?: number
          model?: string
          owner_id?: string | null
          power_hp?: number | null
          price?: number
          status?: string
          transmission?: string
          updated_at?: string
          vin?: string | null
          year?: number
        }
        Relationships: []
      }
      matches: {
        Row: {
          car_id: string
          created_at: string
          id: string
          match_score: number
          status: string
          user_id: string
        }
        Insert: {
          car_id: string
          created_at?: string
          id?: string
          match_score?: number
          status?: string
          user_id: string
        }
        Update: {
          car_id?: string
          created_at?: string
          id?: string
          match_score?: number
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string
          full_name: string
          id: string
          language: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          full_name?: string
          id?: string
          language?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          full_name?: string
          id?: string
          language?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          commute_distance: string | null
          created_at: string
          family_size: number | null
          id: string
          insurance_tolerance: string | null
          max_budget: number | null
          max_mileage: number | null
          max_year: number | null
          min_budget: number | null
          min_power_hp: number | null
          min_year: number | null
          onboarding_completed: boolean | null
          ownership_preference: string | null
          parking_type: string | null
          preferred_body_types: string[] | null
          preferred_colors: string[] | null
          preferred_fuel_types: string[] | null
          preferred_makes: string[] | null
          preferred_transmission: string | null
          timing_preference: string | null
          updated_at: string
          usage_pattern: string | null
          user_id: string
          user_intent: string | null
        }
        Insert: {
          commute_distance?: string | null
          created_at?: string
          family_size?: number | null
          id?: string
          insurance_tolerance?: string | null
          max_budget?: number | null
          max_mileage?: number | null
          max_year?: number | null
          min_budget?: number | null
          min_power_hp?: number | null
          min_year?: number | null
          onboarding_completed?: boolean | null
          ownership_preference?: string | null
          parking_type?: string | null
          preferred_body_types?: string[] | null
          preferred_colors?: string[] | null
          preferred_fuel_types?: string[] | null
          preferred_makes?: string[] | null
          preferred_transmission?: string | null
          timing_preference?: string | null
          updated_at?: string
          usage_pattern?: string | null
          user_id: string
          user_intent?: string | null
        }
        Update: {
          commute_distance?: string | null
          created_at?: string
          family_size?: number | null
          id?: string
          insurance_tolerance?: string | null
          max_budget?: number | null
          max_mileage?: number | null
          max_year?: number | null
          min_budget?: number | null
          min_power_hp?: number | null
          min_year?: number | null
          onboarding_completed?: boolean | null
          ownership_preference?: string | null
          parking_type?: string | null
          preferred_body_types?: string[] | null
          preferred_colors?: string[] | null
          preferred_fuel_types?: string[] | null
          preferred_makes?: string[] | null
          preferred_transmission?: string | null
          timing_preference?: string | null
          updated_at?: string
          usage_pattern?: string | null
          user_id?: string
          user_intent?: string | null
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
      [_ in never]: never
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
    Enums: {},
  },
} as const

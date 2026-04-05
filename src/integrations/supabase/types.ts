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
      acquisition_quotes: {
        Row: {
          agreed_price: number
          annual_mileage: number | null
          created_at: string
          down_payment: number | null
          id: string
          interest_rate: number | null
          monthly_payment: number | null
          offer_id: string
          partner_id: string
          quote_type: string
          residual_value: number | null
          selected: boolean
          term_months: number | null
          total_cost: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          agreed_price: number
          annual_mileage?: number | null
          created_at?: string
          down_payment?: number | null
          id?: string
          interest_rate?: number | null
          monthly_payment?: number | null
          offer_id: string
          partner_id: string
          quote_type?: string
          residual_value?: number | null
          selected?: boolean
          term_months?: number | null
          total_cost?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          agreed_price?: number
          annual_mileage?: number | null
          created_at?: string
          down_payment?: number | null
          id?: string
          interest_rate?: number | null
          monthly_payment?: number | null
          offer_id?: string
          partner_id?: string
          quote_type?: string
          residual_value?: number | null
          selected?: boolean
          term_months?: number | null
          total_cost?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "acquisition_quotes_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "acquisition_quotes_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "financing_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      appraisal_feedback: {
        Row: {
          agreed_sale_price: number | null
          blended_value: number | null
          body_type: string
          car_id: string
          created_at: string
          deviation_pct: number | null
          formula_value: number
          fuel_type: string
          id: string
          make: string
          market_avg_value: number | null
          market_max_value: number | null
          mileage: number
          model: string
          year: number
        }
        Insert: {
          agreed_sale_price?: number | null
          blended_value?: number | null
          body_type?: string
          car_id: string
          created_at?: string
          deviation_pct?: number | null
          formula_value: number
          fuel_type?: string
          id?: string
          make: string
          market_avg_value?: number | null
          market_max_value?: number | null
          mileage?: number
          model: string
          year: number
        }
        Update: {
          agreed_sale_price?: number | null
          blended_value?: number | null
          body_type?: string
          car_id?: string
          created_at?: string
          deviation_pct?: number | null
          formula_value?: number
          fuel_type?: string
          id?: string
          make?: string
          market_avg_value?: number | null
          market_max_value?: number | null
          mileage?: number
          model?: string
          year?: number
        }
        Relationships: []
      }
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
          {
            foreignKeyName: "buyer_selections_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars_public"
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
      car_models: {
        Row: {
          body_type: string
          fuel_type: string
          id: string
          make: string
          model: string
          msrp_eur: number | null
          power_hp: number
          transmission: string
          variant: string
          year_from: number
          year_to: number | null
        }
        Insert: {
          body_type?: string
          fuel_type?: string
          id?: string
          make: string
          model: string
          msrp_eur?: number | null
          power_hp?: number
          transmission?: string
          variant: string
          year_from?: number
          year_to?: number | null
        }
        Update: {
          body_type?: string
          fuel_type?: string
          id?: string
          make?: string
          model?: string
          msrp_eur?: number | null
          power_hp?: number
          transmission?: string
          variant?: string
          year_from?: number
          year_to?: number | null
        }
        Relationships: []
      }
      car_shortlists: {
        Row: {
          car_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          car_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          car_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "car_shortlists_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "car_shortlists_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars_public"
            referencedColumns: ["id"]
          },
        ]
      }
      car_views: {
        Row: {
          car_id: string
          created_at: string
          id: string
          viewer_id: string | null
        }
        Insert: {
          car_id: string
          created_at?: string
          id?: string
          viewer_id?: string | null
        }
        Update: {
          car_id?: string
          created_at?: string
          id?: string
          viewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "car_views_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "car_views_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars_public"
            referencedColumns: ["id"]
          },
        ]
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
          detected_damages: Json | null
          equipment: string[] | null
          fair_value_price: number | null
          features: string[] | null
          first_registration_month: number | null
          first_registration_year: number | null
          fuel_type: string
          has_roof_box: boolean | null
          has_roof_rack: boolean | null
          id: string
          image_url: string | null
          inspection_checklist: Json | null
          is_seed: boolean
          maintenance_receipts: boolean | null
          make: string
          market_blended: boolean
          mileage: number
          model: string
          original_docs_available: boolean | null
          owner_id: string | null
          photos: string[] | null
          pickerl_valid_month: number | null
          pickerl_valid_year: number | null
          placement_paid: boolean
          power_hp: number | null
          price: number
          second_wheel_set: boolean | null
          service_book_updated: boolean | null
          smoker_car: boolean | null
          status: string
          transmission: string
          updated_at: string
          vin: string
          warranty_type: string | null
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
          detected_damages?: Json | null
          equipment?: string[] | null
          fair_value_price?: number | null
          features?: string[] | null
          first_registration_month?: number | null
          first_registration_year?: number | null
          fuel_type?: string
          has_roof_box?: boolean | null
          has_roof_rack?: boolean | null
          id?: string
          image_url?: string | null
          inspection_checklist?: Json | null
          is_seed?: boolean
          maintenance_receipts?: boolean | null
          make: string
          market_blended?: boolean
          mileage?: number
          model: string
          original_docs_available?: boolean | null
          owner_id?: string | null
          photos?: string[] | null
          pickerl_valid_month?: number | null
          pickerl_valid_year?: number | null
          placement_paid?: boolean
          power_hp?: number | null
          price?: number
          second_wheel_set?: boolean | null
          service_book_updated?: boolean | null
          smoker_car?: boolean | null
          status?: string
          transmission?: string
          updated_at?: string
          vin?: string
          warranty_type?: string | null
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
          detected_damages?: Json | null
          equipment?: string[] | null
          fair_value_price?: number | null
          features?: string[] | null
          first_registration_month?: number | null
          first_registration_year?: number | null
          fuel_type?: string
          has_roof_box?: boolean | null
          has_roof_rack?: boolean | null
          id?: string
          image_url?: string | null
          inspection_checklist?: Json | null
          is_seed?: boolean
          maintenance_receipts?: boolean | null
          make?: string
          market_blended?: boolean
          mileage?: number
          model?: string
          original_docs_available?: boolean | null
          owner_id?: string | null
          photos?: string[] | null
          pickerl_valid_month?: number | null
          pickerl_valid_year?: number | null
          placement_paid?: boolean
          power_hp?: number | null
          price?: number
          second_wheel_set?: boolean | null
          service_book_updated?: boolean | null
          smoker_car?: boolean | null
          status?: string
          transmission?: string
          updated_at?: string
          vin?: string
          warranty_type?: string | null
          year?: number
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      financing_partners: {
        Row: {
          base_rate: number
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          type: string
        }
        Insert: {
          base_rate?: number
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          type?: string
        }
        Update: {
          base_rate?: number
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          type?: string
        }
        Relationships: []
      }
      kyc_verifications: {
        Row: {
          created_at: string
          decision_json: Json | null
          didit_session_id: string | null
          id: string
          role: string
          status: string
          transaction_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          decision_json?: Json | null
          didit_session_id?: string | null
          id?: string
          role?: string
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          decision_json?: Json | null
          didit_session_id?: string | null
          id?: string
          role?: string
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
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
          {
            foreignKeyName: "matches_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars_public"
            referencedColumns: ["id"]
          },
        ]
      }
      negotiation_rounds: {
        Row: {
          action: string
          actor_id: string
          actor_role: string
          amount: number
          created_at: string
          id: string
          message: string | null
          offer_id: string
          round_number: number
        }
        Insert: {
          action: string
          actor_id: string
          actor_role: string
          amount: number
          created_at?: string
          id?: string
          message?: string | null
          offer_id: string
          round_number?: number
        }
        Update: {
          action?: string
          actor_id?: string
          actor_role?: string
          amount?: number
          created_at?: string
          id?: string
          message?: string | null
          offer_id?: string
          round_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "negotiation_rounds_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          agreed_price: number | null
          amount: number
          buyer_id: string
          car_id: string
          counter_amount: number | null
          created_at: string
          current_round: number
          id: string
          max_rounds: number
          message: string | null
          seller_id: string
          status: string
          updated_at: string
        }
        Insert: {
          agreed_price?: number | null
          amount: number
          buyer_id: string
          car_id: string
          counter_amount?: number | null
          created_at?: string
          current_round?: number
          id?: string
          max_rounds?: number
          message?: string | null
          seller_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          agreed_price?: number | null
          amount?: number
          buyer_id?: string
          car_id?: string
          counter_amount?: number | null
          created_at?: string
          current_round?: number
          id?: string
          max_rounds?: number
          message?: string | null
          seller_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars_public"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          authorized_representative: string | null
          avatar_url: string | null
          budget_max: number | null
          budget_min: number | null
          car_purpose: string | null
          city: string | null
          commercial_registry_number: string | null
          company_name: string | null
          country: string | null
          created_at: string
          current_car: string | null
          date_of_birth: string | null
          full_name: string
          has_kids: boolean | null
          id: string
          kyc_status: string
          language: string | null
          num_kids: number | null
          phone: string | null
          relationship_status: string | null
          suspended: boolean
          suspension_type: string | null
          uid_number: string | null
          updated_at: string
          user_id: string
          user_type: string
        }
        Insert: {
          authorized_representative?: string | null
          avatar_url?: string | null
          budget_max?: number | null
          budget_min?: number | null
          car_purpose?: string | null
          city?: string | null
          commercial_registry_number?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          current_car?: string | null
          date_of_birth?: string | null
          full_name?: string
          has_kids?: boolean | null
          id?: string
          kyc_status?: string
          language?: string | null
          num_kids?: number | null
          phone?: string | null
          relationship_status?: string | null
          suspended?: boolean
          suspension_type?: string | null
          uid_number?: string | null
          updated_at?: string
          user_id: string
          user_type?: string
        }
        Update: {
          authorized_representative?: string | null
          avatar_url?: string | null
          budget_max?: number | null
          budget_min?: number | null
          car_purpose?: string | null
          city?: string | null
          commercial_registry_number?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          current_car?: string | null
          date_of_birth?: string | null
          full_name?: string
          has_kids?: boolean | null
          id?: string
          kyc_status?: string
          language?: string | null
          num_kids?: number | null
          phone?: string | null
          relationship_status?: string | null
          suspended?: boolean
          suspension_type?: string | null
          uid_number?: string | null
          updated_at?: string
          user_id?: string
          user_type?: string
        }
        Relationships: []
      }
      transaction_deadlines: {
        Row: {
          completed_at: string | null
          created_at: string
          deadline_at: string
          id: string
          label: string
          status: string
          step_type: string
          transaction_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          deadline_at: string
          id?: string
          label: string
          status?: string
          step_type: string
          transaction_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          deadline_at?: string
          id?: string
          label?: string
          status?: string
          step_type?: string
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_deadlines_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_documents: {
        Row: {
          created_at: string
          document_type: string
          id: string
          label: string
          required: boolean
          transaction_id: string
          uploaded_at: string | null
          uploaded_url: string | null
          uploader_role: string
          verified: boolean
        }
        Insert: {
          created_at?: string
          document_type: string
          id?: string
          label: string
          required?: boolean
          transaction_id: string
          uploaded_at?: string | null
          uploaded_url?: string | null
          uploader_role?: string
          verified?: boolean
        }
        Update: {
          created_at?: string
          document_type?: string
          id?: string
          label?: string
          required?: boolean
          transaction_id?: string
          uploaded_at?: string | null
          uploaded_url?: string | null
          uploader_role?: string
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "transaction_documents_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          agreed_price: number
          buyer_id: string
          buyer_kyc_status: string
          buyer_type: string
          car_id: string
          completion_method: string | null
          contract_generated_at: string | null
          contract_pdf_url: string | null
          contract_signed_buyer: boolean
          contract_signed_seller: boolean
          contract_type: string | null
          created_at: string
          current_step: number
          financing_partner_id: string | null
          id: string
          insurance_confirmed: boolean
          insurance_partner_id: string | null
          insurance_tier: string | null
          offer_id: string
          payment_confirmed: boolean
          payment_method: string | null
          seller_id: string
          seller_kyc_status: string
          seller_type: string
          status: string
          updated_at: string
        }
        Insert: {
          agreed_price: number
          buyer_id: string
          buyer_kyc_status?: string
          buyer_type?: string
          car_id: string
          completion_method?: string | null
          contract_generated_at?: string | null
          contract_pdf_url?: string | null
          contract_signed_buyer?: boolean
          contract_signed_seller?: boolean
          contract_type?: string | null
          created_at?: string
          current_step?: number
          financing_partner_id?: string | null
          id?: string
          insurance_confirmed?: boolean
          insurance_partner_id?: string | null
          insurance_tier?: string | null
          offer_id: string
          payment_confirmed?: boolean
          payment_method?: string | null
          seller_id: string
          seller_kyc_status?: string
          seller_type?: string
          status?: string
          updated_at?: string
        }
        Update: {
          agreed_price?: number
          buyer_id?: string
          buyer_kyc_status?: string
          buyer_type?: string
          car_id?: string
          completion_method?: string | null
          contract_generated_at?: string | null
          contract_pdf_url?: string | null
          contract_signed_buyer?: boolean
          contract_signed_seller?: boolean
          contract_type?: string | null
          created_at?: string
          current_step?: number
          financing_partner_id?: string | null
          id?: string
          insurance_confirmed?: boolean
          insurance_partner_id?: string | null
          insurance_tier?: string | null
          offer_id?: string
          payment_confirmed?: boolean
          payment_method?: string | null
          seller_id?: string
          seller_kyc_status?: string
          seller_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_financing_partner_id_fkey"
            columns: ["financing_partner_id"]
            isOneToOne: false
            referencedRelation: "financing_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_insurance_partner_id_fkey"
            columns: ["insurance_partner_id"]
            isOneToOne: false
            referencedRelation: "financing_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
        ]
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
          needs_towing: boolean | null
          onboarding_completed: boolean | null
          ownership_preference: string | null
          parking_type: string | null
          preferred_body_types: string[] | null
          preferred_colors: string[] | null
          preferred_fuel_types: string[] | null
          preferred_makes: string[] | null
          preferred_transmission: string | null
          sports: string[] | null
          timing_preference: string | null
          towing_weight_kg: number | null
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
          needs_towing?: boolean | null
          onboarding_completed?: boolean | null
          ownership_preference?: string | null
          parking_type?: string | null
          preferred_body_types?: string[] | null
          preferred_colors?: string[] | null
          preferred_fuel_types?: string[] | null
          preferred_makes?: string[] | null
          preferred_transmission?: string | null
          sports?: string[] | null
          timing_preference?: string | null
          towing_weight_kg?: number | null
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
          needs_towing?: boolean | null
          onboarding_completed?: boolean | null
          ownership_preference?: string | null
          parking_type?: string | null
          preferred_body_types?: string[] | null
          preferred_colors?: string[] | null
          preferred_fuel_types?: string[] | null
          preferred_makes?: string[] | null
          preferred_transmission?: string | null
          sports?: string[] | null
          timing_preference?: string | null
          towing_weight_kg?: number | null
          updated_at?: string
          usage_pattern?: string | null
          user_id?: string
          user_intent?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      cars_public: {
        Row: {
          accident_details: string | null
          accident_history: boolean | null
          body_type: string | null
          color: string | null
          condition_exterior: number | null
          condition_interior: number | null
          condition_score: number | null
          created_at: string | null
          demand_score: number | null
          description: string | null
          detected_damages: Json | null
          equipment: string[] | null
          fair_value_price: number | null
          features: string[] | null
          fuel_type: string | null
          has_roof_box: boolean | null
          has_roof_rack: boolean | null
          id: string | null
          image_url: string | null
          inspection_checklist: Json | null
          is_seed: boolean | null
          maintenance_receipts: boolean | null
          make: string | null
          market_blended: boolean | null
          mileage: number | null
          model: string | null
          original_docs_available: boolean | null
          owner_id: string | null
          photos: string[] | null
          placement_paid: boolean | null
          power_hp: number | null
          price: number | null
          second_wheel_set: boolean | null
          service_book_updated: boolean | null
          smoker_car: boolean | null
          status: string | null
          transmission: string | null
          updated_at: string | null
          year: number | null
        }
        Insert: {
          accident_details?: string | null
          accident_history?: boolean | null
          body_type?: string | null
          color?: string | null
          condition_exterior?: number | null
          condition_interior?: number | null
          condition_score?: number | null
          created_at?: string | null
          demand_score?: number | null
          description?: string | null
          detected_damages?: Json | null
          equipment?: string[] | null
          fair_value_price?: number | null
          features?: string[] | null
          fuel_type?: string | null
          has_roof_box?: boolean | null
          has_roof_rack?: boolean | null
          id?: string | null
          image_url?: string | null
          inspection_checklist?: Json | null
          is_seed?: boolean | null
          maintenance_receipts?: boolean | null
          make?: string | null
          market_blended?: boolean | null
          mileage?: number | null
          model?: string | null
          original_docs_available?: boolean | null
          owner_id?: string | null
          photos?: string[] | null
          placement_paid?: boolean | null
          power_hp?: number | null
          price?: number | null
          second_wheel_set?: boolean | null
          service_book_updated?: boolean | null
          smoker_car?: boolean | null
          status?: string | null
          transmission?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          accident_details?: string | null
          accident_history?: boolean | null
          body_type?: string | null
          color?: string | null
          condition_exterior?: number | null
          condition_interior?: number | null
          condition_score?: number | null
          created_at?: string | null
          demand_score?: number | null
          description?: string | null
          detected_damages?: Json | null
          equipment?: string[] | null
          fair_value_price?: number | null
          features?: string[] | null
          fuel_type?: string | null
          has_roof_box?: boolean | null
          has_roof_rack?: boolean | null
          id?: string | null
          image_url?: string | null
          inspection_checklist?: Json | null
          is_seed?: boolean | null
          maintenance_receipts?: boolean | null
          make?: string | null
          market_blended?: boolean | null
          mileage?: number | null
          model?: string | null
          original_docs_available?: boolean | null
          owner_id?: string | null
          photos?: string[] | null
          placement_paid?: boolean | null
          power_hp?: number | null
          price?: number | null
          second_wheel_set?: boolean | null
          service_book_updated?: boolean | null
          smoker_car?: boolean | null
          status?: string | null
          transmission?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      lock_fair_value: {
        Args: {
          _car_id: string
          _fair_value_price: number
          _market_blended?: boolean
        }
        Returns: undefined
      }
      transaction_seller_sign_contract: {
        Args: { _transaction_id: string }
        Returns: undefined
      }
      transaction_set_contract: {
        Args: { _contract_type: string; _transaction_id: string }
        Returns: undefined
      }
      transaction_set_insurance: {
        Args: {
          _insurance_confirmed?: boolean
          _insurance_partner_id?: string
          _insurance_tier?: string
          _transaction_id: string
        }
        Returns: undefined
      }
      transaction_set_method: {
        Args: {
          _completion_method: string
          _current_step: number
          _status: string
          _transaction_id: string
        }
        Returns: undefined
      }
      transaction_set_payment: {
        Args: {
          _financing_partner_id?: string
          _payment_method: string
          _transaction_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const

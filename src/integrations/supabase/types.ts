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
      admin_allowlist: {
        Row: {
          added_by: string | null
          created_at: string
          email: string
        }
        Insert: {
          added_by?: string | null
          created_at?: string
          email: string
        }
        Update: {
          added_by?: string | null
          created_at?: string
          email?: string
        }
        Relationships: []
      }
      admin_audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          id: string
          metadata: Json
          reason: string | null
          target_email: string | null
          target_user_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          reason?: string | null
          target_email?: string | null
          target_user_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          reason?: string | null
          target_email?: string | null
          target_user_id?: string | null
        }
        Relationships: []
      }
      cattleya_payment_ledger: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string
          failure_reason: string | null
          id: string
          metadata: Json
          operation_id: string
          plan: string | null
          product: string
          provider: string
          provider_payment_id: string | null
          provider_session_id: string | null
          retry_count: number
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount_cents: number
          created_at?: string
          currency?: string
          failure_reason?: string | null
          id?: string
          metadata?: Json
          operation_id: string
          plan?: string | null
          product: string
          provider?: string
          provider_payment_id?: string | null
          provider_session_id?: string | null
          retry_count?: number
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string
          failure_reason?: string | null
          id?: string
          metadata?: Json
          operation_id?: string
          plan?: string | null
          product?: string
          provider?: string
          provider_payment_id?: string | null
          provider_session_id?: string | null
          retry_count?: number
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      coin_transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          kind: string
          metadata: Json
          reference: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          kind: string
          metadata?: Json
          reference?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          kind?: string
          metadata?: Json
          reference?: string | null
          user_id?: string
        }
        Relationships: []
      }
      comercios: {
        Row: {
          activo: boolean
          created_at: string
          descripcion: string | null
          direccion: string | null
          federacion: Database["public"]["Enums"]["federacion"]
          id: string
          imagen_url: string | null
          instagram: string | null
          latitud: number | null
          longitud: number | null
          nombre: string
          owner_id: string | null
          plan: string
          sitio_web: string | null
          telefono: string | null
          updated_at: string
          verificado: boolean
          whatsapp: string | null
        }
        Insert: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          direccion?: string | null
          federacion: Database["public"]["Enums"]["federacion"]
          id?: string
          imagen_url?: string | null
          instagram?: string | null
          latitud?: number | null
          longitud?: number | null
          nombre: string
          owner_id?: string | null
          plan?: string
          sitio_web?: string | null
          telefono?: string | null
          updated_at?: string
          verificado?: boolean
          whatsapp?: string | null
        }
        Update: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          direccion?: string | null
          federacion?: Database["public"]["Enums"]["federacion"]
          id?: string
          imagen_url?: string | null
          instagram?: string | null
          latitud?: number | null
          longitud?: number | null
          nombre?: string
          owner_id?: string | null
          plan?: string
          sitio_web?: string | null
          telefono?: string | null
          updated_at?: string
          verificado?: boolean
          whatsapp?: string | null
        }
        Relationships: []
      }
      eventos: {
        Row: {
          categoria: string | null
          created_at: string
          created_by: string | null
          descripcion: string | null
          fecha_fin: string | null
          fecha_inicio: string
          id: string
          imagen_url: string | null
          publicado: boolean
          titulo: string
          ubicacion: string | null
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          created_by?: string | null
          descripcion?: string | null
          fecha_fin?: string | null
          fecha_inicio: string
          id?: string
          imagen_url?: string | null
          publicado?: boolean
          titulo: string
          ubicacion?: string | null
        }
        Update: {
          categoria?: string | null
          created_at?: string
          created_by?: string | null
          descripcion?: string | null
          fecha_fin?: string | null
          fecha_inicio?: string
          id?: string
          imagen_url?: string | null
          publicado?: boolean
          titulo?: string
          ubicacion?: string | null
        }
        Relationships: []
      }
      game_sessions: {
        Row: {
          coins_earned: number
          duration_seconds: number | null
          game: string
          id: string
          metadata: Json
          played_at: string
          score: number
          user_id: string
          xp_earned: number
        }
        Insert: {
          coins_earned?: number
          duration_seconds?: number | null
          game: string
          id?: string
          metadata?: Json
          played_at?: string
          score?: number
          user_id: string
          xp_earned?: number
        }
        Update: {
          coins_earned?: number
          duration_seconds?: number | null
          game?: string
          id?: string
          metadata?: Json
          played_at?: string
          score?: number
          user_id?: string
          xp_earned?: number
        }
        Relationships: []
      }
      gamification_badges: {
        Row: {
          description: string | null
          icon: string | null
          id: string
          name: string
          rarity: string
          required_xp: number
        }
        Insert: {
          description?: string | null
          icon?: string | null
          id: string
          name: string
          rarity?: string
          required_xp?: number
        }
        Update: {
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          rarity?: string
          required_xp?: number
        }
        Relationships: []
      }
      gamification_events: {
        Row: {
          created_at: string
          id: string
          kind: string
          metadata: Json
          points: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          metadata?: Json
          points?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          metadata?: Json
          points?: number
          user_id?: string
        }
        Relationships: []
      }
      gamification_points: {
        Row: {
          level: number
          streak_days: number
          updated_at: string
          user_id: string
          xp: number
        }
        Insert: {
          level?: number
          streak_days?: number
          updated_at?: string
          user_id: string
          xp?: number
        }
        Update: {
          level?: number
          streak_days?: number
          updated_at?: string
          user_id?: string
          xp?: number
        }
        Relationships: []
      }
      memberships: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          currency: string
          current_period_end: string | null
          id: string
          metadata: Json
          plan: string
          price_cents: number
          provider: string
          provider_customer_id: string | null
          provider_subscription_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          currency?: string
          current_period_end?: string | null
          id?: string
          metadata?: Json
          plan?: string
          price_cents?: number
          provider?: string
          provider_customer_id?: string | null
          provider_subscription_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          currency?: string
          current_period_end?: string | null
          id?: string
          metadata?: Json
          plan?: string
          price_cents?: number
          provider?: string
          provider_customer_id?: string | null
          provider_subscription_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      metricas_nodo: {
        Row: {
          capturado_at: string
          id: string
          metrica: string
          unidad: string | null
          valor: number
        }
        Insert: {
          capturado_at?: string
          id?: string
          metrica: string
          unidad?: string | null
          valor: number
        }
        Update: {
          capturado_at?: string
          id?: string
          metrica?: string
          unidad?: string | null
          valor?: number
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          kind: string
          link: string | null
          metadata: Json
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          link?: string | null
          metadata?: Json
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          link?: string | null
          metadata?: Json
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      pdos_decisions: {
        Row: {
          confidence: number
          context: Json
          created_at: string
          decisions: Json
          explanation: Json
          id: string
          query: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          rule_version: string
          status: string
          trace_id: string
        }
        Insert: {
          confidence?: number
          context?: Json
          created_at?: string
          decisions?: Json
          explanation?: Json
          id?: string
          query?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          rule_version?: string
          status?: string
          trace_id?: string
        }
        Update: {
          confidence?: number
          context?: Json
          created_at?: string
          decisions?: Json
          explanation?: Json
          id?: string
          query?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          rule_version?: string
          status?: string
          trace_id?: string
        }
        Relationships: []
      }
      pdos_edges: {
        Row: {
          created_at: string
          from_node: string
          id: string
          relation_type: string
          to_node: string
          weight: number
        }
        Insert: {
          created_at?: string
          from_node: string
          id?: string
          relation_type: string
          to_node: string
          weight?: number
        }
        Update: {
          created_at?: string
          from_node?: string
          id?: string
          relation_type?: string
          to_node?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "pdos_edges_from_node_fkey"
            columns: ["from_node"]
            isOneToOne: false
            referencedRelation: "pdos_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pdos_edges_to_node_fkey"
            columns: ["to_node"]
            isOneToOne: false
            referencedRelation: "pdos_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      pdos_executions: {
        Row: {
          created_at: string
          created_by: string | null
          domain: string
          duration_ms: number | null
          event_hash: string | null
          id: string
          payload: Json
          result: Json
          status: string
          stream_id: string
          stream_version: number
          task: string
          trace_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          domain?: string
          duration_ms?: number | null
          event_hash?: string | null
          id?: string
          payload?: Json
          result?: Json
          status?: string
          stream_id: string
          stream_version: number
          task: string
          trace_id?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          domain?: string
          duration_ms?: number | null
          event_hash?: string | null
          id?: string
          payload?: Json
          result?: Json
          status?: string
          stream_id?: string
          stream_version?: number
          task?: string
          trace_id?: string
        }
        Relationships: []
      }
      pdos_nodes: {
        Row: {
          created_at: string
          description: string | null
          id: string
          importance: number
          metadata: Json
          slug: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          importance?: number
          metadata?: Json
          slug: string
          title: string
          type?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          importance?: number
          metadata?: Json
          slug?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      pdos_repos: {
        Row: {
          category: string
          created_at: string
          forks: number
          highlight: boolean
          id: string
          language: string | null
          metadata: Json
          name: string
          role: string | null
          score: number
          stars: number
          url: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          forks?: number
          highlight?: boolean
          id?: string
          language?: string | null
          metadata?: Json
          name: string
          role?: string | null
          score?: number
          stars?: number
          url?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          forks?: number
          highlight?: boolean
          id?: string
          language?: string | null
          metadata?: Json
          name?: string
          role?: string | null
          score?: number
          stars?: number
          url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      rdm_coins_wallet: {
        Row: {
          balance: number
          total_earned: number
          total_spent: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          total_earned?: number
          total_spent?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          total_earned?: number
          total_spent?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reward_redemptions: {
        Row: {
          cost_coins: number
          created_at: string
          fulfilled_at: string | null
          fulfilled_by: string | null
          id: string
          metadata: Json
          redemption_code: string
          reward_id: string
          status: string
          user_id: string
        }
        Insert: {
          cost_coins: number
          created_at?: string
          fulfilled_at?: string | null
          fulfilled_by?: string | null
          id?: string
          metadata?: Json
          redemption_code?: string
          reward_id: string
          status?: string
          user_id: string
        }
        Update: {
          cost_coins?: number
          created_at?: string
          fulfilled_at?: string | null
          fulfilled_by?: string | null
          id?: string
          metadata?: Json
          redemption_code?: string
          reward_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reward_redemptions_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          active: boolean
          category: string
          cost_coins: number
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          partner: string | null
          stock: number | null
        }
        Insert: {
          active?: boolean
          category?: string
          cost_coins: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          partner?: string | null
          stock?: number | null
        }
        Update: {
          active?: boolean
          category?: string
          cost_coins?: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          partner?: string | null
          stock?: number | null
        }
        Relationships: []
      }
      trivia_questions: {
        Row: {
          active: boolean
          category: string
          correct_index: number
          created_at: string
          difficulty: number
          id: string
          options: Json
          question: string
        }
        Insert: {
          active?: boolean
          category?: string
          correct_index: number
          created_at?: string
          difficulty?: number
          id?: string
          options: Json
          question: string
        }
        Update: {
          active?: boolean
          category?: string
          correct_index?: number
          created_at?: string
          difficulty?: number
          id?: string
          options?: Json
          question?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          awarded_at: string
          badge_id: string
          user_id: string
        }
        Insert: {
          awarded_at?: string
          badge_id: string
          user_id: string
        }
        Update: {
          awarded_at?: string
          badge_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "gamification_badges"
            referencedColumns: ["id"]
          },
        ]
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
      award_coins: {
        Args: {
          _amount: number
          _kind: string
          _metadata?: Json
          _reference?: string
          _user_id: string
        }
        Returns: number
      }
      award_points: {
        Args: {
          _kind: string
          _metadata?: Json
          _points: number
          _user_id: string
        }
        Returns: {
          leveled_up: boolean
          new_level: number
          new_xp: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_email_allowlisted: { Args: { _email: string }; Returns: boolean }
      is_member_active: { Args: { _user_id: string }; Returns: boolean }
      redeem_reward: { Args: { _reward_id: string }; Returns: Json }
      submit_game_score: {
        Args: {
          _duration?: number
          _game: string
          _metadata?: Json
          _score: number
        }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "comerciante" | "ciudadano"
      federacion:
        | "hospedaje"
        | "gastronomica"
        | "plateria"
        | "comercio"
        | "guias"
        | "cultura"
        | "inteligencia"
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
      app_role: ["admin", "comerciante", "ciudadano"],
      federacion: [
        "hospedaje",
        "gastronomica",
        "plateria",
        "comercio",
        "guias",
        "cultura",
        "inteligencia",
      ],
    },
  },
} as const

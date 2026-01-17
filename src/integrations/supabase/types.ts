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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      events: {
        Row: {
          attachment_urls: string[] | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          department: string | null
          description: string
          end_date: string | null
          end_time: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          faculty_coordinator: string | null
          faculty_email: string | null
          faculty_phone: string | null
          gallery_urls: string[] | null
          id: string
          is_published: boolean | null
          organized_by: string
          poster_url: string | null
          registration_deadline: string | null
          registration_link: string | null
          registration_required: boolean | null
          schedule: Json | null
          short_description: string | null
          start_date: string
          start_time: string | null
          status: Database["public"]["Enums"]["event_status"]
          student_coordinator: string | null
          student_email: string | null
          student_phone: string | null
          title: string
          updated_at: string
          venue: string
          who_can_attend: string | null
        }
        Insert: {
          attachment_urls?: string[] | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          department?: string | null
          description: string
          end_date?: string | null
          end_time?: string | null
          event_type?: Database["public"]["Enums"]["event_type"]
          faculty_coordinator?: string | null
          faculty_email?: string | null
          faculty_phone?: string | null
          gallery_urls?: string[] | null
          id?: string
          is_published?: boolean | null
          organized_by: string
          poster_url?: string | null
          registration_deadline?: string | null
          registration_link?: string | null
          registration_required?: boolean | null
          schedule?: Json | null
          short_description?: string | null
          start_date: string
          start_time?: string | null
          status?: Database["public"]["Enums"]["event_status"]
          student_coordinator?: string | null
          student_email?: string | null
          student_phone?: string | null
          title: string
          updated_at?: string
          venue: string
          who_can_attend?: string | null
        }
        Update: {
          attachment_urls?: string[] | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          department?: string | null
          description?: string
          end_date?: string | null
          end_time?: string | null
          event_type?: Database["public"]["Enums"]["event_type"]
          faculty_coordinator?: string | null
          faculty_email?: string | null
          faculty_phone?: string | null
          gallery_urls?: string[] | null
          id?: string
          is_published?: boolean | null
          organized_by?: string
          poster_url?: string | null
          registration_deadline?: string | null
          registration_link?: string | null
          registration_required?: boolean | null
          schedule?: Json | null
          short_description?: string | null
          start_date?: string
          start_time?: string | null
          status?: Database["public"]["Enums"]["event_status"]
          student_coordinator?: string | null
          student_email?: string | null
          student_phone?: string | null
          title?: string
          updated_at?: string
          venue?: string
          who_can_attend?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      research_projects: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          branch: string
          category: Database["public"]["Enums"]["project_category"]
          contact_email: string
          contributor_names: string[]
          contributor_type: Database["public"]["Enums"]["contributor_type"]
          created_at: string
          department: string
          description: string
          designations: string[] | null
          document_urls: string[] | null
          external_links: Json | null
          how_it_was_built: string
          id: string
          image_urls: string[] | null
          outcomes_impact: string
          problem_statement: string
          proposed_solution: string
          rejection_reason: string | null
          roll_numbers: string[] | null
          status: Database["public"]["Enums"]["approval_status"]
          summary: string
          title: string
          tools_technologies: string[]
          updated_at: string
          video_urls: string[] | null
          year_section: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          branch: string
          category: Database["public"]["Enums"]["project_category"]
          contact_email: string
          contributor_names: string[]
          contributor_type: Database["public"]["Enums"]["contributor_type"]
          created_at?: string
          department: string
          description: string
          designations?: string[] | null
          document_urls?: string[] | null
          external_links?: Json | null
          how_it_was_built: string
          id?: string
          image_urls?: string[] | null
          outcomes_impact: string
          problem_statement: string
          proposed_solution: string
          rejection_reason?: string | null
          roll_numbers?: string[] | null
          status?: Database["public"]["Enums"]["approval_status"]
          summary: string
          title: string
          tools_technologies?: string[]
          updated_at?: string
          video_urls?: string[] | null
          year_section?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          branch?: string
          category?: Database["public"]["Enums"]["project_category"]
          contact_email?: string
          contributor_names?: string[]
          contributor_type?: Database["public"]["Enums"]["contributor_type"]
          created_at?: string
          department?: string
          description?: string
          designations?: string[] | null
          document_urls?: string[] | null
          external_links?: Json | null
          how_it_was_built?: string
          id?: string
          image_urls?: string[] | null
          outcomes_impact?: string
          problem_statement?: string
          proposed_solution?: string
          rejection_reason?: string | null
          roll_numbers?: string[] | null
          status?: Database["public"]["Enums"]["approval_status"]
          summary?: string
          title?: string
          tools_technologies?: string[]
          updated_at?: string
          video_urls?: string[] | null
          year_section?: string | null
        }
        Relationships: []
      }
      syllabus_reviews: {
        Row: {
          branch: string
          comments: string | null
          created_at: string
          email: string
          hours_completed: number
          hours_planned: number
          hours_required: number
          id: string
          percentage_completion: number
          section: string
          semester: string
          subject_type: string
          teacher_name: string
          teaching_notes_digitization: number
          unit_in_progress: string
          units_completed: number
        }
        Insert: {
          branch: string
          comments?: string | null
          created_at?: string
          email: string
          hours_completed: number
          hours_planned: number
          hours_required: number
          id?: string
          percentage_completion: number
          section: string
          semester: string
          subject_type: string
          teacher_name: string
          teaching_notes_digitization: number
          unit_in_progress: string
          units_completed: number
        }
        Update: {
          branch?: string
          comments?: string | null
          created_at?: string
          email?: string
          hours_completed?: number
          hours_planned?: number
          hours_required?: number
          id?: string
          percentage_completion?: number
          section?: string
          semester?: string
          subject_type?: string
          teacher_name?: string
          teaching_notes_digitization?: number
          unit_in_progress?: string
          units_completed?: number
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
      get_user_role: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_or_faculty: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "faculty" | "student"
      approval_status: "pending" | "approved" | "rejected"
      contributor_type: "student" | "faculty"
      event_status: "draft" | "upcoming" | "ongoing" | "completed" | "cancelled"
      event_type:
        | "festival"
        | "workshop"
        | "seminar"
        | "sports"
        | "cultural"
        | "technical"
        | "other"
      project_category: "research" | "project" | "innovation"
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
      app_role: ["admin", "faculty", "student"],
      approval_status: ["pending", "approved", "rejected"],
      contributor_type: ["student", "faculty"],
      event_status: ["draft", "upcoming", "ongoing", "completed", "cancelled"],
      event_type: [
        "festival",
        "workshop",
        "seminar",
        "sports",
        "cultural",
        "technical",
        "other",
      ],
      project_category: ["research", "project", "innovation"],
    },
  },
} as const

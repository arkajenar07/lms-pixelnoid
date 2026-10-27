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
      users: {
        Row: {
          id: string
          email: string | null
          fullname: string | null
          username: string | null
          roles: string[] | null
          avatar_url: string | null
          whatsapp: string | null
          pekerjaan: string | null
          instansi: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Insert: {
          id: string
          email?: string | null
          fullname?: string | null
          username?: string | null
          roles?: string[] | null
          avatar_url?: string | null
          whatsapp?: string | null
          pekerjaan?: string | null
          instansi?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          fullname?: string | null
          username?: string | null
          roles?: string[] | null
          avatar_url?: string | null
          whatsapp?: string | null
          pekerjaan?: string | null
          instansi?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      teaching_schedules: {
        Row: {
          id: string
          title: string
          description?: string | null
          class_id?: string | null
          mentor_email: string
          student_emails: string[]
          meeting_url?: string | null
          start_time: string
          end_time: string
          google_event_id?: string | null
          google_sync_status?: string | null
          notifications?: Json | null
          created_at?: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          class_id?: string | null
          mentor_email: string
          student_emails?: string[]
          meeting_url?: string | null
          start_time: string
          end_time: string
          google_event_id?: string | null
          google_sync_status?: string | null
          notifications?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          class_id?: string | null
          mentor_email?: string
          student_emails?: string[]
          meeting_url?: string | null
          start_time?: string
          end_time?: string
          google_event_id?: string | null
          google_sync_status?: string | null
          notifications?: Json | null
          created_at?: string | null
        }
        Relationships: []
      }
      class: {
        Row: {
          id: string
          name: string
          description?: string | null
          created_at?: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      class_member: {
        Row: {
          id: string
          user_id: string
          class_id: string
          role?: string | null
          created_at?: string | null
        }
        Insert: {
          id?: string
          user_id: string
          class_id: string
          role?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          class_id?: string
          role?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      class_modules: {
        Row: {
          id: string
          class_id: string
          title: string
          slug: string
          order_index?: number | null
          created_at?: string | null
        }
        Insert: {
          id?: string
          class_id: string
          title: string
          slug: string
          order_index?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          class_id?: string
          title?: string
          slug?: string
          order_index?: number | null
          created_at?: string | null
        }
        Relationships: []
      }
      module_lessons: {
        Row: {
          id: string
          module_id: string
          title: string
          content?: string | null
          order_index?: number | null
          created_at?: string | null
        }
        Insert: {
          id?: string
          module_id: string
          title: string
          content?: string | null
          order_index?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          module_id?: string
          title?: string
          content?: string | null
          order_index?: number | null
          created_at?: string | null
        }
        Relationships: []
      }
      user_lesson_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          is_completed: boolean
          updated_at?: string | null
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          is_completed?: boolean
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          is_completed?: boolean
          updated_at?: string | null
        }
        Relationships: []
      }
      student_assignments: {
        Row: {
          id: string
          student_id?: string | null
          title: string
          status?: string | null
          file_url?: string | null
          score?: number | null
          created_at?: string | null
        }
        Insert: {
          id?: string
          student_id?: string | null
          title: string
          status?: string | null
          file_url?: string | null
          score?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string | null
          title?: string
          status?: string | null
          file_url?: string | null
          score?: number | null
          created_at?: string | null
        }
        Relationships: []
      }
      mentorship_sessions: {
        Row: {
          id: string
          student_id?: string | null
          mentor_id?: string | null
          scheduled_at?: string | null
          status?: string | null
          created_at?: string | null
        }
        Insert: {
          id?: string
          student_id?: string | null
          mentor_id?: string | null
          scheduled_at?: string | null
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string | null
          mentor_id?: string | null
          scheduled_at?: string | null
          status?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          id: string
          class_id?: string | null
          title: string
          file_url?: string | null
          created_at?: string | null
        }
        Insert: {
          id?: string
          class_id?: string | null
          title: string
          file_url?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          class_id?: string | null
          title?: string
          file_url?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      [key: string]: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
        Relationships: any[]
      }
    }
    Views: {
      vw_users: {
        Row: {
          id: string
          email: string | null
          fullname: string | null
          username: string | null
          roles: string[] | null
          avatar_url: string | null
          whatsapp: string | null
          pekerjaan: string | null
          instansi: string | null
          email_confirmed_at?: string | null
          last_sign_in_at?: string | null
          auth_created_at?: string | null
          auth_phone?: string | null
          raw_user_meta_data?: Json | null
        }
        Relationships: []
      }
      [key: string]: {
        Row: Record<string, any>
        Relationships: any[]
      }
    }
    Functions: {
      get_users_by_emails: {
        Args: {
          emails: string[]
        }
        Returns: {
          id: string
          email: string
          fullname: string
          username: string
          roles: string[]
          avatar_url: string
          whatsapp: string
          pekerjaan: string
          instansi: string
        }[]
      }
      [key: string]: {
        Args: Record<string, any>
        Returns: any
      }
    }
    Enums: {
      [key: string]: string
    }
    CompositeTypes: {
      [key: string]: unknown
    }
  }
}

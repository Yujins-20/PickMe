// lib/supabase/database.types.ts
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
      voting_rooms: {
        Row: {
          id: string
          room_code: string
          title: string
          category: string
          created_by: string | null
          created_at: string
          status: 'active' | 'completed' | 'archived'
          settings: Json
        }
        Insert: {
          id?: string
          room_code: string
          title: string
          category: string
          created_by?: string | null
          created_at?: string
          status?: 'active' | 'completed' | 'archived'
          settings?: Json
        }
        Update: {
          id?: string
          room_code?: string
          title?: string
          category?: string
          created_by?: string | null
          created_at?: string
          status?: 'active' | 'completed' | 'archived'
          settings?: Json
        }
      }
      voting_items: {
        Row: {
          id: string
          room_id: string
          name: string
          image_url: string | null
          metadata: Json | null
          rating: number
          comparisons: number
          wins: number
          losses: number
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          name: string
          image_url?: string | null
          metadata?: Json | null
          rating?: number
          comparisons?: number
          wins?: number
          losses?: number
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          name?: string
          image_url?: string | null
          metadata?: Json | null
          rating?: number
          comparisons?: number
          wins?: number
          losses?: number
          created_at?: string
        }
      }
      comparisons: {
        Row: {
          id: string
          room_id: string
          user_id: string | null
          winner_id: string
          loser_id: string
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          user_id?: string | null
          winner_id: string
          loser_id: string
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string | null
          winner_id?: string
          loser_id?: string
          created_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          category: string
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category: string
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category?: string
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
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
  }
}

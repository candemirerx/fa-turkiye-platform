export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          ad_soyad: string;
          yas: number | null;
          yakinlik_derecesi: string | null;
          sehir: string;
          hikayem_text: string | null;
          yetkinlikler_cv: string | null;
          avatar_url: string | null;
          onay_durumu: 'beklemede' | 'onaylandı' | 'reddedildi';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          ad_soyad: string;
          yas?: number | null;
          yakinlik_derecesi?: string | null;
          sehir: string;
          hikayem_text?: string | null;
          yetkinlikler_cv?: string | null;
          avatar_url?: string | null;
          onay_durumu?: 'beklemede' | 'onaylandı' | 'reddedildi';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          ad_soyad?: string;
          yas?: number | null;
          yakinlik_derecesi?: string | null;
          sehir?: string;
          hikayem_text?: string | null;
          yetkinlikler_cv?: string | null;
          avatar_url?: string | null;
          onay_durumu?: 'beklemede' | 'onaylandı' | 'reddedildi';
          created_at?: string;
          updated_at?: string;
        };
      };
      knowledge_base: {
        Row: {
          id: string;
          baslik: string;
          icerik: string;
          kategori: string;
          goruntulenme_sayisi: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          baslik: string;
          icerik: string;
          kategori: string;
          goruntulenme_sayisi?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          baslik?: string;
          icerik?: string;
          kategori?: string;
          goruntulenme_sayisi?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          baslik: string;
          tarih: string;
          link: string;
          aciklama: string | null;
          aktif_mi: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          baslik: string;
          tarih: string;
          link: string;
          aciklama?: string | null;
          aktif_mi?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          baslik?: string;
          tarih?: string;
          link?: string;
          aciklama?: string | null;
          aktif_mi?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_training_data: {
        Row: {
          id: string;
          soru: string;
          cevap: string;
          onaylandi_mi: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          soru: string;
          cevap: string;
          onaylandi_mi?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          soru?: string;
          cevap?: string;
          onaylandi_mi?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_system_instructions: {
        Row: {
          id: string;
          instruction_key: string;
          instruction_title: string;
          instruction_content: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          instruction_key: string;
          instruction_title: string;
          instruction_content: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          instruction_key?: string;
          instruction_title?: string;
          instruction_content?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_settings: {
        Row: {
          key: string;
          value: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type KnowledgeBase = Database['public']['Tables']['knowledge_base']['Row'];
export type Event = Database['public']['Tables']['events']['Row'];
export type AITrainingData = Database['public']['Tables']['ai_training_data']['Row'];
export type AISystemInstruction = Database['public']['Tables']['ai_system_instructions']['Row'];
export type AISetting = Database['public']['Tables']['ai_settings']['Row'];

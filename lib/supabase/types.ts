/**
 * Database types for the ProofPilot Supabase schema.
 *
 * Hand-authored to mirror `supabase/schema.sql`. Keep this in sync with the
 * schema whenever tables/columns change. (Can be regenerated later with
 * `supabase gen types typescript` once the Supabase CLI is wired up — see
 * docs/SETUP.md.)
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/** Application plan tiers. `free` is the default for every new profile. */
export type PlanTier = "free" | "founderReport" | "radar" | "consultant";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          plan: string;
          stripe_customer_id: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          plan?: string;
          stripe_customer_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          plan?: string;
          stripe_customer_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          idea: string;
          audience: string | null;
          problem: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          idea: string;
          audience?: string | null;
          problem?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          idea?: string;
          audience?: string | null;
          problem?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      reports: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          title: string;
          content: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id?: string | null;
          title: string;
          content?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string | null;
          title?: string;
          content?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      billing_events: {
        Row: {
          id: string;
          stripe_event_id: string | null;
          event_type: string;
          customer_id: string | null;
          subscription_id: string | null;
          checkout_session_id: string | null;
          plan: string | null;
          status: string | null;
          raw: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          stripe_event_id?: string | null;
          event_type: string;
          customer_id?: string | null;
          subscription_id?: string | null;
          checkout_session_id?: string | null;
          plan?: string | null;
          status?: string | null;
          raw: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          stripe_event_id?: string | null;
          event_type?: string;
          customer_id?: string | null;
          subscription_id?: string | null;
          checkout_session_id?: string | null;
          plan?: string | null;
          status?: string | null;
          raw?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

/** Convenience row aliases used across the app. */
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
export type ReportRow = Database["public"]["Tables"]["reports"]["Row"];
export type BillingEventRow = Database["public"]["Tables"]["billing_events"]["Row"];

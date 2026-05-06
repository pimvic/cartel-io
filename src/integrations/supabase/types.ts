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
      cartels: {
        Row: {
          coordinator_id: string | null
          created_at: string | null
          deadline: string | null
          id: string
          name: string
        }
        Insert: {
          coordinator_id?: string | null
          created_at?: string | null
          deadline?: string | null
          id?: string
          name: string
        }
        Update: {
          coordinator_id?: string | null
          created_at?: string | null
          deadline?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "cartels_coordinator_id_fkey"
            columns: ["coordinator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          attachments: Json | null
          body: string
          created_at: string
          deleted_at: string | null
          edited_at: string | null
          id: string
          mentions: string[] | null
          reactions: Json | null
          sender_id: string
          thread_id: string
          updated_at: string | null
        }
        Insert: {
          attachments?: Json | null
          body: string
          created_at?: string
          deleted_at?: string | null
          edited_at?: string | null
          id?: string
          mentions?: string[] | null
          reactions?: Json | null
          sender_id: string
          thread_id: string
          updated_at?: string | null
        }
        Update: {
          attachments?: Json | null
          body?: string
          created_at?: string
          deleted_at?: string | null
          edited_at?: string | null
          id?: string
          mentions?: string[] | null
          reactions?: Json | null
          sender_id?: string
          thread_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
        ]
      }
      event_attendees: {
        Row: {
          created_at: string
          event_id: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          attachments: Json | null
          capacity: number | null
          cartel_id: string
          created_at: string
          description: string | null
          event_date: string
          event_type: string
          id: string
          location: string | null
          tags: string[] | null
          title: string
          updated_at: string
          visio_link: string | null
        }
        Insert: {
          attachments?: Json | null
          capacity?: number | null
          cartel_id: string
          created_at?: string
          description?: string | null
          event_date: string
          event_type: string
          id?: string
          location?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          visio_link?: string | null
        }
        Update: {
          attachments?: Json | null
          capacity?: number | null
          cartel_id?: string
          created_at?: string
          description?: string | null
          event_date?: string
          event_type?: string
          id?: string
          location?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          visio_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_cartel_id_fkey"
            columns: ["cartel_id"]
            isOneToOne: false
            referencedRelation: "cartels"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          attachment_url: string | null
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          type: string
          user_id: string
        }
        Insert: {
          attachment_url?: string | null
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          type: string
          user_id: string
        }
        Update: {
          attachment_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      flashcards: {
        Row: {
          answer: string
          cartel_id: string
          created_at: string | null
          id: string
          question: string
        }
        Insert: {
          answer: string
          cartel_id: string
          created_at?: string | null
          id?: string
          question: string
        }
        Update: {
          answer?: string
          cartel_id?: string
          created_at?: string | null
          id?: string
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_cartel_id_fkey"
            columns: ["cartel_id"]
            isOneToOne: false
            referencedRelation: "cartels"
            referencedColumns: ["id"]
          },
        ]
      }
      glossary_terms: {
        Row: {
          author_id: string
          cartel_id: string
          category: string
          created_at: string | null
          definition: string
          id: string
          term: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          cartel_id: string
          category: string
          created_at?: string | null
          definition: string
          id?: string
          term: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          cartel_id?: string
          category?: string
          created_at?: string | null
          definition?: string
          id?: string
          term?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "glossary_terms_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "glossary_terms_cartel_id_fkey"
            columns: ["cartel_id"]
            isOneToOne: false
            referencedRelation: "cartels"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_base_favorites: {
        Row: {
          created_at: string
          id: string
          resource_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          resource_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          resource_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_base_favorites_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "knowledge_base_resources"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_base_reports: {
        Row: {
          id: string
          reason: string
          reported_at: string
          reported_by: string
          resource_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["report_status"]
        }
        Insert: {
          id?: string
          reason: string
          reported_at?: string
          reported_by: string
          resource_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
        }
        Update: {
          id?: string
          reason?: string
          reported_at?: string
          reported_by?: string
          resource_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_base_reports_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "knowledge_base_resources"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_base_resources: {
        Row: {
          cartel_id: string
          category: Database["public"]["Enums"]["resource_category"]
          description: string | null
          file_size: number | null
          id: string
          resource_url: string
          tags: string[] | null
          title: string
          type: Database["public"]["Enums"]["resource_type"]
          updated_at: string
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          cartel_id: string
          category: Database["public"]["Enums"]["resource_category"]
          description?: string | null
          file_size?: number | null
          id?: string
          resource_url: string
          tags?: string[] | null
          title: string
          type: Database["public"]["Enums"]["resource_type"]
          updated_at?: string
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          cartel_id?: string
          category?: Database["public"]["Enums"]["resource_category"]
          description?: string | null
          file_size?: number | null
          id?: string
          resource_url?: string
          tags?: string[] | null
          title?: string
          type?: Database["public"]["Enums"]["resource_type"]
          updated_at?: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_base_resources_cartel_id_fkey"
            columns: ["cartel_id"]
            isOneToOne: false
            referencedRelation: "cartels"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          cartel_id: string
          id: string
          joined_at: string | null
          role: string
          user_id: string
        }
        Insert: {
          cartel_id: string
          id?: string
          joined_at?: string | null
          role: string
          user_id: string
        }
        Update: {
          cartel_id?: string
          id?: string
          joined_at?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_cartel_id_fkey"
            columns: ["cartel_id"]
            isOneToOne: false
            referencedRelation: "cartels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          cartel_id: string
          content: string
          created_at: string
          excerpt: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cartel_id: string
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cartel_id?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_cartel_id_fkey"
            columns: ["cartel_id"]
            isOneToOne: false
            referencedRelation: "cartels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      milestone_reminders: {
        Row: {
          created_at: string
          id: string
          milestone_id: string
          reminder_date: string
          sent: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          milestone_id: string
          reminder_date: string
          sent?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          milestone_id?: string
          reminder_date?: string
          sent?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestone_reminders_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "milestone_reminders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          assignees: string[] | null
          attachments: Json | null
          audit_log: Json | null
          cartel_id: string
          completed_at: string | null
          created_at: string
          created_by: string
          description: string | null
          due_date: string
          id: string
          importance: boolean
          is_final: boolean | null
          status: Database["public"]["Enums"]["milestone_status"]
          title: string
          updated_at: string
        }
        Insert: {
          assignees?: string[] | null
          attachments?: Json | null
          audit_log?: Json | null
          cartel_id: string
          completed_at?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          due_date: string
          id?: string
          importance?: boolean
          is_final?: boolean | null
          status?: Database["public"]["Enums"]["milestone_status"]
          title: string
          updated_at?: string
        }
        Update: {
          assignees?: string[] | null
          attachments?: Json | null
          audit_log?: Json | null
          cartel_id?: string
          completed_at?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          due_date?: string
          id?: string
          importance?: boolean
          is_final?: boolean | null
          status?: Database["public"]["Enums"]["milestone_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_cartel_id_fkey"
            columns: ["cartel_id"]
            isOneToOne: false
            referencedRelation: "cartels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "milestones_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          attachments: Json | null
          author_id: string
          body: string
          cartel_id: string
          created_at: string
          id: string
          pinned: boolean
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          attachments?: Json | null
          author_id: string
          body: string
          cartel_id: string
          created_at?: string
          id?: string
          pinned?: boolean
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          attachments?: Json | null
          author_id?: string
          body?: string
          cartel_id?: string
          created_at?: string
          id?: string
          pinned?: boolean
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_cartel_id_fkey"
            columns: ["cartel_id"]
            isOneToOne: false
            referencedRelation: "cartels"
            referencedColumns: ["id"]
          },
        ]
      }
      news_comments: {
        Row: {
          author_id: string
          body: string
          created_at: string
          deleted_at: string | null
          id: string
          news_id: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          news_id: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          news_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "news_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_comments_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "news"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          archived: boolean | null
          cartel_id: string
          content: string
          created_at: string
          excerpt: string | null
          favorited_by: string[] | null
          id: string
          pinned: boolean | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          version_history: Json | null
          visibility: string | null
        }
        Insert: {
          archived?: boolean | null
          cartel_id: string
          content: string
          created_at?: string
          excerpt?: string | null
          favorited_by?: string[] | null
          id?: string
          pinned?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          version_history?: Json | null
          visibility?: string | null
        }
        Update: {
          archived?: boolean | null
          cartel_id?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          favorited_by?: string[] | null
          id?: string
          pinned?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          version_history?: Json | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_cartel_id_fkey"
            columns: ["cartel_id"]
            isOneToOne: false
            referencedRelation: "cartels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          payload: Json
          read_at: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          payload?: Json
          read_at?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          payload?: Json
          read_at?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pins: {
        Row: {
          cartel_id: string
          display_order: number | null
          id: string
          item_id: string
          item_type: string
          pinned_at: string
          pinned_by: string
        }
        Insert: {
          cartel_id: string
          display_order?: number | null
          id?: string
          item_id: string
          item_type: string
          pinned_at?: string
          pinned_by: string
        }
        Update: {
          cartel_id?: string
          display_order?: number | null
          id?: string
          item_id?: string
          item_type?: string
          pinned_at?: string
          pinned_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "pins_cartel_id_fkey"
            columns: ["cartel_id"]
            isOneToOne: false
            referencedRelation: "cartels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pins_pinned_by_fkey"
            columns: ["pinned_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      plus_one_audit: {
        Row: {
          action: string
          actor_id: string
          created_at: string
          diff: Json | null
          id: string
          ip_address: string | null
          target_id: string
          target_type: string
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id: string
          created_at?: string
          diff?: Json | null
          id?: string
          ip_address?: string | null
          target_id: string
          target_type: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string
          created_at?: string
          diff?: Json | null
          id?: string
          ip_address?: string | null
          target_id?: string
          target_type?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plus_one_audit_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      plus_one_feed: {
        Row: {
          action_type: Database["public"]["Enums"]["plus_one_action_type"]
          actor_id: string
          cartel_id: string
          created_at: string
          id: string
          metadata: Json | null
          target_id: string
          target_type: string
        }
        Insert: {
          action_type: Database["public"]["Enums"]["plus_one_action_type"]
          actor_id: string
          cartel_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          target_id: string
          target_type: string
        }
        Update: {
          action_type?: Database["public"]["Enums"]["plus_one_action_type"]
          actor_id?: string
          cartel_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          target_id?: string
          target_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "plus_one_feed_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plus_one_feed_cartel_id_fkey"
            columns: ["cartel_id"]
            isOneToOne: false
            referencedRelation: "cartels"
            referencedColumns: ["id"]
          },
        ]
      }
      plus_one_messages: {
        Row: {
          attachments: Json | null
          author_id: string
          body: string
          created_at: string
          deleted_at: string | null
          edited_at: string | null
          id: string
          request_id: string
        }
        Insert: {
          attachments?: Json | null
          author_id: string
          body: string
          created_at?: string
          deleted_at?: string | null
          edited_at?: string | null
          id?: string
          request_id: string
        }
        Update: {
          attachments?: Json | null
          author_id?: string
          body?: string
          created_at?: string
          deleted_at?: string | null
          edited_at?: string | null
          id?: string
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plus_one_messages_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plus_one_messages_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "plus_one_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      plus_one_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          expertise_tags: string[] | null
          id: string
          office_hours: Json | null
          sla_hint: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          expertise_tags?: string[] | null
          id?: string
          office_hours?: Json | null
          sla_hint?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          expertise_tags?: string[] | null
          id?: string
          office_hours?: Json | null
          sla_hint?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plus_one_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      plus_one_requests: {
        Row: {
          attachments: Json | null
          body: string
          cartel_id: string
          created_at: string
          due_date: string | null
          id: string
          linked_items: Json | null
          requester_id: string
          resolved_at: string | null
          resolved_by: string | null
          status: Database["public"]["Enums"]["plus_one_status"]
          tags: string[]
          title: string
          updated_at: string
          visibility: Database["public"]["Enums"]["plus_one_visibility"]
        }
        Insert: {
          attachments?: Json | null
          body: string
          cartel_id: string
          created_at?: string
          due_date?: string | null
          id?: string
          linked_items?: Json | null
          requester_id: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["plus_one_status"]
          tags?: string[]
          title: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["plus_one_visibility"]
        }
        Update: {
          attachments?: Json | null
          body?: string
          cartel_id?: string
          created_at?: string
          due_date?: string | null
          id?: string
          linked_items?: Json | null
          requester_id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["plus_one_status"]
          tags?: string[]
          title?: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["plus_one_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "plus_one_requests_cartel_id_fkey"
            columns: ["cartel_id"]
            isOneToOne: false
            referencedRelation: "cartels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plus_one_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plus_one_requests_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      plus_one_watchers: {
        Row: {
          created_at: string
          id: string
          request_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          request_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          request_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plus_one_watchers_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "plus_one_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plus_one_watchers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          cartel_id: string
          correct_answer: string
          created_at: string | null
          id: string
          options: Json
          question: string
        }
        Insert: {
          cartel_id: string
          correct_answer: string
          created_at?: string | null
          id?: string
          options: Json
          question: string
        }
        Update: {
          cartel_id?: string
          correct_answer?: string
          created_at?: string | null
          id?: string
          options?: Json
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_cartel_id_fkey"
            columns: ["cartel_id"]
            isOneToOne: false
            referencedRelation: "cartels"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          ip_address: string | null
          token: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: string | null
          token: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: string | null
          token?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          cartel_id: string
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          status: string | null
          title: string
        }
        Insert: {
          assigned_to?: string | null
          cartel_id: string
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string | null
          title: string
        }
        Update: {
          assigned_to?: string | null
          cartel_id?: string
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_cartel_id_fkey"
            columns: ["cartel_id"]
            isOneToOne: false
            referencedRelation: "cartels"
            referencedColumns: ["id"]
          },
        ]
      }
      threads: {
        Row: {
          cartel_id: string
          created_at: string
          id: string
          is_group: boolean
          last_message_at: string | null
          participants: string[]
          title: string | null
          updated_at: string
        }
        Insert: {
          cartel_id: string
          created_at?: string
          id?: string
          is_group?: boolean
          last_message_at?: string | null
          participants?: string[]
          title?: string | null
          updated_at?: string
        }
        Update: {
          cartel_id?: string
          created_at?: string
          id?: string
          is_group?: boolean
          last_message_at?: string | null
          participants?: string[]
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "threads_cartel_id_fkey"
            columns: ["cartel_id"]
            isOneToOne: false
            referencedRelation: "cartels"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          auth_user_id: string | null
          avatar_url: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          is_demo: boolean | null
          last_login_at: string | null
          last_name: string | null
          name: string
          preferred_locale: string | null
          provider: string | null
          role: string
        }
        Insert: {
          auth_user_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id?: string
          is_demo?: boolean | null
          last_login_at?: string | null
          last_name?: string | null
          name: string
          preferred_locale?: string | null
          provider?: string | null
          role: string
        }
        Update: {
          auth_user_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_demo?: boolean | null
          last_login_at?: string | null
          last_name?: string | null
          name?: string
          preferred_locale?: string | null
          provider?: string | null
          role?: string
        }
        Relationships: []
      }
      visio_attendance_logs: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          participant_id: string
          session_id: string
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          participant_id: string
          session_id: string
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          participant_id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "visio_attendance_logs_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "visio_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visio_attendance_logs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "visio_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      visio_participants: {
        Row: {
          consent_recording: boolean | null
          consent_transcription: boolean | null
          created_at: string
          duration_seconds: number | null
          guest_name: string | null
          id: string
          joined_at: string | null
          left_at: string | null
          role: Database["public"]["Enums"]["visio_participant_role"]
          session_id: string
          user_id: string | null
        }
        Insert: {
          consent_recording?: boolean | null
          consent_transcription?: boolean | null
          created_at?: string
          duration_seconds?: number | null
          guest_name?: string | null
          id?: string
          joined_at?: string | null
          left_at?: string | null
          role?: Database["public"]["Enums"]["visio_participant_role"]
          session_id: string
          user_id?: string | null
        }
        Update: {
          consent_recording?: boolean | null
          consent_transcription?: boolean | null
          created_at?: string
          duration_seconds?: number | null
          guest_name?: string | null
          id?: string
          joined_at?: string | null
          left_at?: string | null
          role?: Database["public"]["Enums"]["visio_participant_role"]
          session_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visio_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "visio_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visio_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      visio_sessions: {
        Row: {
          cartel_id: string
          created_at: string
          description: string | null
          duration_minutes: number
          end_at: string
          host_id: string
          id: string
          join_code: string
          join_url: string
          lobby_enabled: boolean | null
          max_participants: number | null
          metadata: Json | null
          parent_event_id: string | null
          privacy: Database["public"]["Enums"]["visio_session_privacy"]
          provider: Database["public"]["Enums"]["visio_provider"]
          recording_enabled: boolean | null
          recording_url: string | null
          room_locked: boolean | null
          start_at: string
          status: Database["public"]["Enums"]["visio_session_status"]
          summary_note_id: string | null
          title: string
          transcript_id: string | null
          transcription_enabled: boolean | null
          updated_at: string
        }
        Insert: {
          cartel_id: string
          created_at?: string
          description?: string | null
          duration_minutes?: number
          end_at: string
          host_id: string
          id?: string
          join_code: string
          join_url: string
          lobby_enabled?: boolean | null
          max_participants?: number | null
          metadata?: Json | null
          parent_event_id?: string | null
          privacy?: Database["public"]["Enums"]["visio_session_privacy"]
          provider?: Database["public"]["Enums"]["visio_provider"]
          recording_enabled?: boolean | null
          recording_url?: string | null
          room_locked?: boolean | null
          start_at: string
          status?: Database["public"]["Enums"]["visio_session_status"]
          summary_note_id?: string | null
          title: string
          transcript_id?: string | null
          transcription_enabled?: boolean | null
          updated_at?: string
        }
        Update: {
          cartel_id?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number
          end_at?: string
          host_id?: string
          id?: string
          join_code?: string
          join_url?: string
          lobby_enabled?: boolean | null
          max_participants?: number | null
          metadata?: Json | null
          parent_event_id?: string | null
          privacy?: Database["public"]["Enums"]["visio_session_privacy"]
          provider?: Database["public"]["Enums"]["visio_provider"]
          recording_enabled?: boolean | null
          recording_url?: string | null
          room_locked?: boolean | null
          start_at?: string
          status?: Database["public"]["Enums"]["visio_session_status"]
          summary_note_id?: string | null
          title?: string
          transcript_id?: string | null
          transcription_enabled?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "visio_sessions_cartel_id_fkey"
            columns: ["cartel_id"]
            isOneToOne: false
            referencedRelation: "cartels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visio_sessions_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visio_sessions_parent_event_id_fkey"
            columns: ["parent_event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      visio_stt_quota: {
        Row: {
          cartel_id: string
          created_at: string
          hard_cap_minutes: number | null
          id: string
          last_reset_at: string | null
          soft_cap_minutes: number | null
          updated_at: string
          used_minutes: number | null
        }
        Insert: {
          cartel_id: string
          created_at?: string
          hard_cap_minutes?: number | null
          id?: string
          last_reset_at?: string | null
          soft_cap_minutes?: number | null
          updated_at?: string
          used_minutes?: number | null
        }
        Update: {
          cartel_id?: string
          created_at?: string
          hard_cap_minutes?: number | null
          id?: string
          last_reset_at?: string | null
          soft_cap_minutes?: number | null
          updated_at?: string
          used_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "visio_stt_quota_cartel_id_fkey"
            columns: ["cartel_id"]
            isOneToOne: true
            referencedRelation: "cartels"
            referencedColumns: ["id"]
          },
        ]
      }
      visio_summaries: {
        Row: {
          actions: Json | null
          created_at: string
          decisions: string[] | null
          highlights: string[] | null
          id: string
          next_steps: string[] | null
          note_id: string | null
          risks: string[] | null
          session_id: string
        }
        Insert: {
          actions?: Json | null
          created_at?: string
          decisions?: string[] | null
          highlights?: string[] | null
          id?: string
          next_steps?: string[] | null
          note_id?: string | null
          risks?: string[] | null
          session_id: string
        }
        Update: {
          actions?: Json | null
          created_at?: string
          decisions?: string[] | null
          highlights?: string[] | null
          id?: string
          next_steps?: string[] | null
          note_id?: string | null
          risks?: string[] | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "visio_summaries_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visio_summaries_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "visio_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      visio_transcripts: {
        Row: {
          created_at: string
          full_text: string | null
          id: string
          language_code: string
          retention_until: string | null
          segments: Json
          session_id: string
          updated_at: string
          word_count: number | null
        }
        Insert: {
          created_at?: string
          full_text?: string | null
          id?: string
          language_code?: string
          retention_until?: string | null
          segments?: Json
          session_id: string
          updated_at?: string
          word_count?: number | null
        }
        Update: {
          created_at?: string
          full_text?: string | null
          id?: string
          language_code?: string
          retention_until?: string | null
          segments?: Json
          session_id?: string
          updated_at?: string
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "visio_transcripts_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "visio_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_user_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_cartel_coordinator: { Args: { _cartel_id: string }; Returns: boolean }
      is_cartel_member: { Args: { _cartel_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      milestone_status: "a_venir" | "en_cours" | "termine"
      plus_one_action_type:
        | "message"
        | "resource"
        | "note"
        | "lien"
        | "status_change"
      plus_one_status:
        | "ouvert"
        | "en_cours"
        | "en_attente_infos"
        | "resolu"
        | "ferme"
      plus_one_visibility: "kartel" | "prive"
      report_status: "pending" | "reviewed" | "resolved" | "dismissed"
      resource_category:
        | "documents"
        | "videos"
        | "summaries"
        | "tools"
        | "other"
      resource_type: "document" | "video" | "summary" | "tool" | "link"
      visio_participant_role: "host" | "co_host" | "participant" | "guest"
      visio_provider: "auto" | "jitsi" | "zoom" | "meet"
      visio_session_privacy: "kartel" | "private"
      visio_session_status: "scheduled" | "active" | "ended" | "cancelled"
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
      milestone_status: ["a_venir", "en_cours", "termine"],
      plus_one_action_type: [
        "message",
        "resource",
        "note",
        "lien",
        "status_change",
      ],
      plus_one_status: [
        "ouvert",
        "en_cours",
        "en_attente_infos",
        "resolu",
        "ferme",
      ],
      plus_one_visibility: ["kartel", "prive"],
      report_status: ["pending", "reviewed", "resolved", "dismissed"],
      resource_category: ["documents", "videos", "summaries", "tools", "other"],
      resource_type: ["document", "video", "summary", "tool", "link"],
      visio_participant_role: ["host", "co_host", "participant", "guest"],
      visio_provider: ["auto", "jitsi", "zoom", "meet"],
      visio_session_privacy: ["kartel", "private"],
      visio_session_status: ["scheduled", "active", "ended", "cancelled"],
    },
  },
} as const

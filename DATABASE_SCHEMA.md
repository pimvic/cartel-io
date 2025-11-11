# Kartels.io Database Schema Documentation

**Version:** 1.0  
**Database:** PostgreSQL (Supabase)  
**Last Updated:** 2025-01-11

---

## Table of Contents

1. [Overview](#overview)
2. [Core Entities](#core-entities)
3. [Content & Knowledge Management](#content--knowledge-management)
4. [Communication](#communication)
5. [Video Conferencing (Visio)](#video-conferencing-visio)
6. [Plus One (+1) System](#plus-one-1-system)
7. [Authentication & Sessions](#authentication--sessions)
8. [Learning Tools](#learning-tools)
9. [Enums & Types](#enums--types)
10. [Indexes](#indexes)
11. [RLS Policies Summary](#rls-policies-summary)
12. [Database Functions](#database-functions)

---

## Overview

Kartels.io uses a PostgreSQL database via Supabase with Row-Level Security (RLS) enabled on all tables. The schema supports:

- Multi-tenant kartel (study group) management
- Role-based access control (RBAC)
- Knowledge base with AI-powered features
- Real-time messaging and collaboration
- Video conferencing with transcription
- Learning tools (QCM, Quiz, Flashcards)
- Audit logging and activity tracking

**Security Model:**
- All tables have RLS enabled
- Three primary roles: `member`, `coordinator` (+1), `admin`
- Roles stored in separate `user_roles` table (prevents privilege escalation)
- Security definer function `has_role()` for policy checks

---

## Core Entities

### `users`

Stores user profile information linked to Supabase Auth.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `auth_user_id` | `uuid` | nullable | Foreign key to `auth.users` |
| `email` | `text` | NOT NULL | User email address |
| `name` | `text` | NOT NULL | Full display name |
| `first_name` | `text` | nullable | First name |
| `last_name` | `text` | nullable | Last name |
| `avatar_url` | `text` | nullable | Profile picture URL |
| `role` | `text` | NOT NULL | User role (member/admin) |
| `provider` | `text` | default: `'email'` | Auth provider |
| `preferred_locale` | `text` | default: `'fr'` | Language preference (fr/en) |
| `is_demo` | `boolean` | default: `false` | Demo account flag |
| `last_login_at` | `timestamptz` | nullable | Last login timestamp |
| `created_at` | `timestamptz` | default: `now()` | Record creation time |

**Indexes:**
- Primary key on `id`
- Unique index on `email`
- Index on `auth_user_id`

**RLS Policies:**
- Allow all users access (public read)

**Triggers:**
- `on_auth_user_created`: Auto-creates user record from auth.users
- `update_last_login`: Updates `last_login_at` on auth events

---

### `cartels`

Represents study groups (kartels).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `name` | `text` | NOT NULL | Kartel name |
| `coordinator_id` | `uuid` | FK → `users(id)`, nullable | Coordinator (+1) user |
| `deadline` | `date` | nullable | Final exam/goal deadline |
| `created_at` | `timestamptz` | default: `now()` | Record creation time |

**Indexes:**
- Primary key on `id`
- Foreign key index on `coordinator_id`

**RLS Policies:**
- Allow all cartels access (members access via memberships)

---

### `memberships`

Links users to kartels with role assignments.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `cartel_id` | `uuid` | FK → `cartels(id)`, NOT NULL | Kartel reference |
| `user_id` | `uuid` | FK → `users(id)`, NOT NULL | User reference |
| `role` | `text` | NOT NULL | Role in kartel (member/coordinator) |
| `joined_at` | `timestamptz` | default: `now()` | Join timestamp |

**Indexes:**
- Primary key on `id`
- Unique composite index on `(cartel_id, user_id)`
- Index on `user_id`

**RLS Policies:**
- Users can view memberships in their kartels
- Coordinators/admins can manage memberships

---

### `user_roles`

**SECURITY CRITICAL:** Stores global user roles separate from profiles to prevent privilege escalation.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `user_id` | `uuid` | FK → `auth.users(id)`, NOT NULL | User reference |
| `role` | `app_role` | NOT NULL | Role enum value |
| `created_at` | `timestamptz` | default: `now()` | Assignment time |

**Unique Constraint:** `(user_id, role)` - prevents duplicate role assignments

**Enum:** `app_role` - `'admin'`, `'moderator'`, `'user'`

**RLS Policies:**
- Security definer function access only
- Not directly accessible via RLS

---

### `sessions`

Tracks user sessions for security audit.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `user_id` | `uuid` | FK → `users(id)`, nullable | User reference |
| `token` | `text` | NOT NULL | Session token |
| `user_agent` | `text` | nullable | Browser user agent |
| `ip_address` | `text` | nullable | Client IP address |
| `created_at` | `timestamptz` | default: `now()` | Session start |
| `expires_at` | `timestamptz` | nullable | Session expiry |

**RLS Policies:**
- Users can view/delete their own sessions

---

## Content & Knowledge Management

### `knowledge_base_resources`

Documents, videos, and other learning resources.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `cartel_id` | `uuid` | FK → `cartels(id)`, NOT NULL | Kartel reference |
| `title` | `text` | NOT NULL | Resource title |
| `description` | `text` | nullable | Resource description |
| `resource_url` | `text` | NOT NULL | Storage URL or link |
| `type` | `kb_resource_type` | NOT NULL | Resource type enum |
| `category` | `kb_category` | NOT NULL | Category enum |
| `tags` | `text[]` | default: `'{}'` | Search tags array |
| `file_size` | `bigint` | nullable | File size in bytes |
| `uploaded_by` | `uuid` | FK → `users(id)`, NOT NULL | Uploader user |
| `uploaded_at` | `timestamptz` | default: `now()` | Upload timestamp |
| `updated_at` | `timestamptz` | default: `now()` | Last update time |

**Enums:**
- `kb_resource_type`: `'document'`, `'video'`, `'audio'`, `'link'`, `'note'`
- `kb_category`: `'cours'`, `'exercice'`, `'correction'`, `'methodologie'`, `'autre'`

**RLS Policies:**
- Users can view resources in their kartel
- Users can upload resources
- Coordinators/admins can update/delete

**Triggers:**
- `update_updated_at_column`: Auto-updates timestamp

---

### `knowledge_base_favorites`

User favorites for KB resources.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `user_id` | `uuid` | FK → `users(id)`, NOT NULL | User reference |
| `resource_id` | `uuid` | FK → `knowledge_base_resources(id)`, NOT NULL | Resource reference |
| `created_at` | `timestamptz` | default: `now()` | Favorite timestamp |

**Unique Constraint:** `(user_id, resource_id)`

**RLS Policies:**
- Users can manage their own favorites

---

### `notes`

Personal and shared notes within kartels.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `cartel_id` | `uuid` | FK → `cartels(id)`, NOT NULL | Kartel reference |
| `user_id` | `uuid` | FK → `users(id)`, NOT NULL | Note author |
| `title` | `text` | NOT NULL | Note title |
| `content` | `text` | NOT NULL | Note body (markdown) |
| `excerpt` | `text` | GENERATED | Auto excerpt (first 100 chars) |
| `is_shared` | `boolean` | default: `false` | Shared with kartel |
| `tags` | `text[]` | default: `'{}'` | Tags array |
| `created_at` | `timestamptz` | default: `now()` | Creation time |
| `updated_at` | `timestamptz` | default: `now()` | Last update time |

**RLS Policies:**
- Users can view their own notes
- Shared notes visible to kartel members
- Coordinators can edit shared notes

**Triggers:**
- `update_updated_at_column`

---

### `glossary_terms`

Shared glossary/dictionary for kartels.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `cartel_id` | `uuid` | FK → `cartels(id)`, NOT NULL | Kartel reference |
| `term` | `text` | NOT NULL | Term/word |
| `definition` | `text` | NOT NULL | Definition |
| `category` | `text` | NOT NULL | Category label |
| `author_id` | `uuid` | FK → `users(id)`, NOT NULL | Creator user |
| `created_at` | `timestamptz` | default: `now()` | Creation time |
| `updated_at` | `timestamptz` | default: `now()` | Last update time |

**RLS Policies:**
- Users can view terms in their kartel
- Users can create terms
- Coordinators/admins can update/delete

---

### `pins`

Pinned items (news, events, messages) for quick access.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `cartel_id` | `uuid` | FK → `cartels(id)`, NOT NULL | Kartel reference |
| `item_type` | `text` | NOT NULL | Type (news/event/message) |
| `item_id` | `uuid` | NOT NULL | Referenced item ID |
| `display_order` | `integer` | default: `0` | Sort order |
| `pinned_by` | `uuid` | FK → `users(id)`, NOT NULL | User who pinned |
| `pinned_at` | `timestamptz` | default: `now()` | Pin timestamp |

**RLS Policies:**
- Users can view pins in their kartel
- Coordinators/admins can manage pins

---

## Communication

### `threads`

Conversation threads (1:1 or group).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `cartel_id` | `uuid` | FK → `cartels(id)`, NOT NULL | Kartel reference |
| `title` | `text` | nullable | Thread title (for groups) |
| `is_group` | `boolean` | default: `false` | Group thread flag |
| `participants` | `uuid[]` | default: `ARRAY[]` | Participant user IDs |
| `last_message_at` | `timestamptz` | default: `now()` | Last message time |
| `created_at` | `timestamptz` | default: `now()` | Thread creation |
| `updated_at` | `timestamptz` | default: `now()` | Last update |

**RLS Policies:**
- Users can view threads in their kartel
- Users can create threads

**Triggers:**
- `update_thread_last_message`: Updates on new messages

---

### `chat_messages`

Messages within threads.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `thread_id` | `uuid` | FK → `threads(id)`, NOT NULL | Thread reference |
| `sender_id` | `uuid` | FK → `users(id)`, NOT NULL | Sender user |
| `body` | `text` | NOT NULL | Message content |
| `attachments` | `jsonb` | default: `'[]'` | Attachment metadata |
| `mentions` | `uuid[]` | default: `ARRAY[]` | Mentioned user IDs |
| `reactions` | `jsonb` | default: `'{}'` | Emoji reactions |
| `created_at` | `timestamptz` | default: `now()` | Send time |
| `edited_at` | `timestamptz` | nullable | Last edit time |
| `updated_at` | `timestamptz` | nullable | Update time |
| `deleted_at` | `timestamptz` | nullable | Soft delete time |

**RLS Policies:**
- Users can view messages in their threads
- Users can send messages
- Users can update/delete own messages within 10 minutes

**Triggers:**
- `update_thread_last_message`: Updates parent thread

---

### `messages`

Legacy message table (may be deprecated in favor of chat_messages).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `cartel_id` | `uuid` | FK → `cartels(id)`, NOT NULL | Kartel reference |
| `user_id` | `uuid` | FK → `users(id)`, NOT NULL | Sender user |
| `content` | `text` | NOT NULL | Message content |
| `excerpt` | `text` | nullable | Short preview |
| `created_at` | `timestamptz` | default: `now()` | Send time |
| `updated_at` | `timestamptz` | default: `now()` | Update time |

**RLS Policies:**
- Users can view/create messages in their kartel

---

### `events`

Calendar events and meetings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `cartel_id` | `uuid` | FK → `cartels(id)`, NOT NULL | Kartel reference |
| `title` | `text` | NOT NULL | Event title |
| `description` | `text` | nullable | Event description |
| `event_type` | `text` | NOT NULL | Type (session/deadline/meeting) |
| `event_date` | `timestamptz` | NOT NULL | Event date/time |
| `location` | `text` | nullable | Physical location |
| `visio_link` | `text` | nullable | Video call link |
| `capacity` | `integer` | nullable | Max attendees |
| `tags` | `text[]` | default: `ARRAY[]` | Event tags |
| `attachments` | `jsonb` | default: `'[]'` | Attachment metadata |
| `created_at` | `timestamptz` | default: `now()` | Creation time |
| `updated_at` | `timestamptz` | default: `now()` | Update time |

**RLS Policies:**
- Users can view/create events in their kartel

---

### `event_attendees`

Event registration and attendance tracking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `event_id` | `uuid` | FK → `events(id)`, NOT NULL | Event reference |
| `user_id` | `uuid` | FK → `users(id)`, NOT NULL | Attendee user |
| `status` | `text` | default: `'registered'` | Status (registered/attended/cancelled) |
| `created_at` | `timestamptz` | default: `now()` | Registration time |

**Unique Constraint:** `(event_id, user_id)`

**RLS Policies:**
- Users can register/unregister for events
- Users can view attendees in their kartel

---

### `news_comments`

Comments on news/announcements.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `news_id` | `uuid` | NOT NULL | Referenced news item |
| `author_id` | `uuid` | FK → `users(id)`, NOT NULL | Comment author |
| `body` | `text` | NOT NULL | Comment content |
| `created_at` | `timestamptz` | default: `now()` | Post time |
| `updated_at` | `timestamptz` | nullable | Edit time |
| `deleted_at` | `timestamptz` | nullable | Soft delete time |

**RLS Policies:**
- Users can view comments in their kartel
- Users can create comments

---

## Video Conferencing (Visio)

### `visio_sessions`

Video conference sessions (scheduled or instant).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `cartel_id` | `uuid` | FK → `cartels(id)`, NOT NULL | Kartel reference |
| `title` | `text` | NOT NULL | Session title |
| `description` | `text` | nullable | Session description |
| `start_at` | `timestamptz` | NOT NULL | Scheduled start time |
| `end_at` | `timestamptz` | NOT NULL | Scheduled end time |
| `duration_minutes` | `integer` | default: `60` | Duration in minutes |
| `status` | `visio_session_status` | default: `'scheduled'` | Status enum |
| `privacy` | `visio_session_privacy` | default: `'kartel'` | Privacy level enum |
| `provider` | `visio_provider` | default: `'auto'` | Provider enum |
| `host_id` | `uuid` | FK → `users(id)`, NOT NULL | Session host |
| `join_url` | `text` | NOT NULL | Join link |
| `join_code` | `text` | NOT NULL | Join code |
| `recording_enabled` | `boolean` | default: `false` | Recording flag |
| `recording_url` | `text` | nullable | Recording link |
| `transcription_enabled` | `boolean` | default: `false` | Transcription flag |
| `transcript_id` | `uuid` | nullable | Link to transcript |
| `summary_note_id` | `uuid` | nullable | Link to summary note |
| `parent_event_id` | `uuid` | nullable | Link to calendar event |
| `room_locked` | `boolean` | default: `false` | Room lock status |
| `lobby_enabled` | `boolean` | default: `true` | Lobby feature flag |
| `max_participants` | `integer` | default: `12` | Max participant limit |
| `metadata` | `jsonb` | default: `'{}'` | Extra metadata |
| `created_at` | `timestamptz` | default: `now()` | Creation time |
| `updated_at` | `timestamptz` | default: `now()` | Update time |

**Enums:**
- `visio_session_status`: `'scheduled'`, `'in_progress'`, `'completed'`, `'cancelled'`
- `visio_session_privacy`: `'kartel'`, `'private'`, `'public'`
- `visio_provider`: `'auto'`, `'jitsi'`, `'zoom'`, `'meet'`

**RLS Policies:**
- Users can view sessions in their kartel
- Users can create sessions
- Host/coordinators can update sessions

---

### `visio_participants`

Session participants tracking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `session_id` | `uuid` | FK → `visio_sessions(id)`, NOT NULL | Session reference |
| `user_id` | `uuid` | FK → `users(id)`, nullable | Participant user (null for guests) |
| `display_name` | `text` | NOT NULL | Display name |
| `role` | `visio_participant_role` | default: `'participant'` | Role enum |
| `join_time` | `timestamptz` | nullable | Join timestamp |
| `leave_time` | `timestamptz` | nullable | Leave timestamp |
| `duration_minutes` | `integer` | default: `0` | Attendance duration |
| `is_guest` | `boolean` | default: `false` | Guest flag |
| `metadata` | `jsonb` | default: `'{}'` | Extra metadata |
| `created_at` | `timestamptz` | default: `now()` | Registration time |

**Enum:** `visio_participant_role`: `'host'`, `'co_host'`, `'participant'`, `'observer'`

**RLS Policies:**
- Users can view participants in sessions they attend

---

### `visio_transcripts`

Speech-to-text transcripts of sessions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `session_id` | `uuid` | FK → `visio_sessions(id)`, NOT NULL | Session reference |
| `language_code` | `text` | default: `'fr'` | Language code |
| `full_text` | `text` | nullable | Full transcript text |
| `segments` | `jsonb` | default: `'[]'` | Time-aligned segments |
| `word_count` | `integer` | nullable | Total word count |
| `retention_until` | `timestamptz` | nullable | Auto-delete date |
| `created_at` | `timestamptz` | default: `now()` | Creation time |
| `updated_at` | `timestamptz` | default: `now()` | Update time |

**Segments Structure (jsonb):**
```json
[
  {
    "speaker_id": "user_uuid",
    "start": 0.0,
    "end": 5.2,
    "text": "Transcript segment"
  }
]
```

**RLS Policies:**
- Attendees and admins can view transcripts

---

### `visio_summaries`

AI-generated session summaries.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `session_id` | `uuid` | FK → `visio_sessions(id)`, NOT NULL | Session reference |
| `note_id` | `uuid` | nullable | Link to Notes entry |
| `decisions` | `text[]` | default: `'{}'` | Key decisions array |
| `highlights` | `text[]` | default: `'{}'` | Key highlights array |
| `risks` | `text[]` | default: `'{}'` | Identified risks array |
| `next_steps` | `text[]` | default: `'{}'` | Action items array |
| `actions` | `jsonb` | default: `'[]'` | Structured actions |
| `created_at` | `timestamptz` | default: `now()` | Generation time |

**Actions Structure (jsonb):**
```json
[
  {
    "owner_id": "user_uuid",
    "due_date": "2025-01-20",
    "description": "Action item",
    "status": "pending"
  }
]
```

**RLS Policies:**
- Attendees and admins can view summaries

---

### `visio_attendance_logs`

Detailed attendance logging for compliance/analytics.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `session_id` | `uuid` | FK → `visio_sessions(id)`, NOT NULL | Session reference |
| `participant_id` | `uuid` | NOT NULL | Participant reference |
| `event_type` | `text` | NOT NULL | Event type (join/leave/disconnect) |
| `event_data` | `jsonb` | default: `'{}'` | Event metadata |
| `created_at` | `timestamptz` | default: `now()` | Event timestamp |

**RLS Policies:**
- Session attendees can view logs

---

### `visio_stt_quota`

Speech-to-text usage quota tracking per kartel.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `cartel_id` | `uuid` | FK → `cartels(id)`, NOT NULL | Kartel reference |
| `used_minutes` | `integer` | default: `0` | Minutes consumed |
| `soft_cap_minutes` | `integer` | default: `600` | Soft limit (10 hours) |
| `hard_cap_minutes` | `integer` | default: `1000` | Hard limit (16.67 hours) |
| `last_reset_at` | `timestamptz` | default: `now()` | Last quota reset |
| `created_at` | `timestamptz` | default: `now()` | Record creation |
| `updated_at` | `timestamptz` | default: `now()` | Last update |

**RLS Policies:**
- Coordinators/admins can view/update quota

---

## Plus One (+1) System

### `plus_one_requests`

Help requests from members to coordinators.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `cartel_id` | `uuid` | FK → `cartels(id)`, NOT NULL | Kartel reference |
| `requester_id` | `uuid` | FK → `users(id)`, NOT NULL | Requesting user |
| `title` | `text` | NOT NULL | Request title |
| `body` | `text` | NOT NULL | Request description |
| `visibility` | `plus_one_visibility` | default: `'kartel'` | Visibility enum |
| `status` | `plus_one_status` | default: `'ouvert'` | Status enum |
| `tags` | `text[]` | default: `'{}'` | Tags array |
| `due_date` | `timestamptz` | nullable | Due date |
| `resolved_at` | `timestamptz` | nullable | Resolution time |
| `resolved_by` | `uuid` | FK → `users(id)`, nullable | Resolver user |
| `attachments` | `jsonb` | default: `'[]'` | Attachment metadata |
| `linked_items` | `jsonb` | default: `'[]'` | Linked resources |
| `created_at` | `timestamptz` | default: `now()` | Creation time |
| `updated_at` | `timestamptz` | default: `now()` | Update time |

**Enums:**
- `plus_one_visibility`: `'kartel'`, `'prive'`
- `plus_one_status`: `'ouvert'`, `'en_cours'`, `'resolu'`, `'ferme'`

**RLS Policies:**
- Users can create requests
- Users can view kartel requests
- Private requests visible to requester and coordinators
- Coordinators can update status

---

### `plus_one_messages`

Messages within +1 request threads.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `request_id` | `uuid` | FK → `plus_one_requests(id)`, NOT NULL | Request reference |
| `author_id` | `uuid` | FK → `users(id)`, NOT NULL | Message author |
| `body` | `text` | NOT NULL | Message content |
| `attachments` | `jsonb` | default: `'[]'` | Attachment metadata |
| `created_at` | `timestamptz` | default: `now()` | Send time |
| `edited_at` | `timestamptz` | nullable | Edit time |
| `deleted_at` | `timestamptz` | nullable | Soft delete time |

**RLS Policies:**
- Users can view messages for visible requests
- Users can create messages

---

### `plus_one_watchers`

Users watching/subscribed to +1 requests.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `request_id` | `uuid` | FK → `plus_one_requests(id)`, NOT NULL | Request reference |
| `user_id` | `uuid` | FK → `users(id)`, NOT NULL | Watcher user |
| `created_at` | `timestamptz` | default: `now()` | Watch start time |

**Unique Constraint:** `(request_id, user_id)`

**RLS Policies:**
- Users can manage their own subscriptions

---

### `plus_one_feed`

Activity feed for +1 actions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `cartel_id` | `uuid` | FK → `cartels(id)`, NOT NULL | Kartel reference |
| `actor_id` | `uuid` | FK → `users(id)`, NOT NULL | Acting user |
| `action_type` | `text` | NOT NULL | Action type |
| `target_type` | `text` | NOT NULL | Target entity type |
| `target_id` | `uuid` | NOT NULL | Target entity ID |
| `metadata` | `jsonb` | default: `'{}'` | Action metadata |
| `created_at` | `timestamptz` | default: `now()` | Action time |

**RLS Policies:**
- Users can view feed in their kartel
- Coordinators/admins can insert

---

### `plus_one_profiles`

Coordinator profile information for +1 system.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `user_id` | `uuid` | FK → `users(id)`, NOT NULL | User reference |
| `bio` | `text` | nullable | Coordinator bio |
| `expertise_tags` | `text[]` | default: `'{}'` | Areas of expertise |
| `avatar_url` | `text` | nullable | Profile picture |
| `office_hours` | `jsonb` | default: `'{}'` | Availability schedule |
| `sla_hint` | `text` | nullable | Response time hint |
| `created_at` | `timestamptz` | default: `now()` | Profile creation |
| `updated_at` | `timestamptz` | default: `now()` | Last update |

**RLS Policies:**
- All users can view +1 profiles
- Users can insert/update own profile

---

### `plus_one_audit`

Audit log for +1 system actions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `actor_id` | `uuid` | FK → `users(id)`, NOT NULL | Acting user |
| `action` | `text` | NOT NULL | Action type |
| `target_type` | `text` | NOT NULL | Target entity type |
| `target_id` | `uuid` | NOT NULL | Target entity ID |
| `diff` | `jsonb` | nullable | Before/after changes |
| `ip_address` | `text` | nullable | Client IP |
| `user_agent` | `text` | nullable | Client user agent |
| `created_at` | `timestamptz` | default: `now()` | Action timestamp |

**RLS Policies:**
- System can insert
- Admins can view

---

## Authentication & Sessions

See [Core Entities](#core-entities) for `users` and `sessions` tables.

---

## Learning Tools

### `tasks`

Tasks and assignments within kartels.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `cartel_id` | `uuid` | FK → `cartels(id)`, NOT NULL | Kartel reference |
| `title` | `text` | NOT NULL | Task title |
| `description` | `text` | nullable | Task description |
| `status` | `text` | default: `'todo'` | Status (todo/in_progress/done) |
| `due_date` | `date` | nullable | Due date |
| `assigned_to` | `uuid` | FK → `users(id)`, nullable | Assigned user |
| `created_at` | `timestamptz` | default: `now()` | Creation time |

**RLS Policies:**
- Allow all tasks access (TODO: implement proper RBAC)

---

### `milestones`

Major goals and deadlines for kartels.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `cartel_id` | `uuid` | FK → `cartels(id)`, NOT NULL | Kartel reference |
| `title` | `text` | NOT NULL | Milestone title |
| `description` | `text` | nullable | Milestone description |
| `due_date` | `timestamptz` | NOT NULL | Due date/time |
| `status` | `milestone_status` | default: `'a_venir'` | Status enum |
| `importance` | `boolean` | default: `false` | Important flag |
| `is_final` | `boolean` | default: `false` | Final milestone flag |
| `assignees` | `uuid[]` | default: `ARRAY[]` | Assigned user IDs |
| `attachments` | `jsonb` | default: `'[]'` | Attachment metadata |
| `created_by` | `uuid` | FK → `users(id)`, NOT NULL | Creator user |
| `audit_log` | `jsonb` | default: `'[]'` | Change history |
| `created_at` | `timestamptz` | default: `now()` | Creation time |
| `updated_at` | `timestamptz` | default: `now()` | Update time |
| `completed_at` | `timestamptz` | nullable | Completion time |

**Enum:** `milestone_status`: `'a_venir'`, `'en_cours'`, `'termine'`

**RLS Policies:**
- Users can view/create milestones in their kartel
- Coordinators/admins can insert

---

### `milestone_reminders`

User-specific reminders for milestones.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `milestone_id` | `uuid` | FK → `milestones(id)`, NOT NULL | Milestone reference |
| `user_id` | `uuid` | FK → `users(id)`, NOT NULL | User reference |
| `reminder_date` | `timestamptz` | NOT NULL | Reminder trigger time |
| `sent` | `boolean` | default: `false` | Sent flag |
| `created_at` | `timestamptz` | default: `now()` | Creation time |

**RLS Policies:**
- Users can manage their own reminders

---

### `quizzes`

Quiz questions (QCM - multiple choice).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `cartel_id` | `uuid` | FK → `cartels(id)`, NOT NULL | Kartel reference |
| `question` | `text` | NOT NULL | Question text |
| `options` | `jsonb` | NOT NULL | Answer options array |
| `correct_answer` | `text` | NOT NULL | Correct answer |
| `created_at` | `timestamptz` | default: `now()` | Creation time |

**Options Structure (jsonb):**
```json
["Option A", "Option B", "Option C", "Option D"]
```

**RLS Policies:**
- Allow all quizzes access (TODO: implement proper RBAC)

---

### `flashcards`

Flashcard sets for spaced repetition learning.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `cartel_id` | `uuid` | FK → `cartels(id)`, NOT NULL | Kartel reference |
| `question` | `text` | NOT NULL | Front of card |
| `answer` | `text` | NOT NULL | Back of card |
| `created_at` | `timestamptz` | default: `now()` | Creation time |

**RLS Policies:**
- Allow all flashcards access (TODO: implement proper RBAC)

---

### `feedback`

User feedback and bug reports.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default: `gen_random_uuid()` | Primary key |
| `user_id` | `uuid` | NOT NULL | Feedback author |
| `name` | `text` | NOT NULL | Author name |
| `email` | `text` | NOT NULL | Author email |
| `type` | `text` | NOT NULL | Feedback type (bug/idea/help/other) |
| `message` | `text` | NOT NULL | Feedback content |
| `attachment_url` | `text` | nullable | Attachment URL |
| `created_at` | `timestamptz` | default: `now()` | Submission time |

**RLS Policies:**
- Users can view own feedback
- Users can insert feedback
- Admins can view all feedback

---

## Enums & Types

### Custom Types

```sql
-- User roles (global)
CREATE TYPE app_role AS ENUM ('admin', 'moderator', 'user');

-- Knowledge base resource types
CREATE TYPE kb_resource_type AS ENUM ('document', 'video', 'audio', 'link', 'note');

-- Knowledge base categories
CREATE TYPE kb_category AS ENUM ('cours', 'exercice', 'correction', 'methodologie', 'autre');

-- Milestone status
CREATE TYPE milestone_status AS ENUM ('a_venir', 'en_cours', 'termine');

-- Plus One visibility
CREATE TYPE plus_one_visibility AS ENUM ('kartel', 'prive');

-- Plus One status
CREATE TYPE plus_one_status AS ENUM ('ouvert', 'en_cours', 'resolu', 'ferme');

-- Visio session status
CREATE TYPE visio_session_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');

-- Visio session privacy
CREATE TYPE visio_session_privacy AS ENUM ('kartel', 'private', 'public');

-- Visio provider
CREATE TYPE visio_provider AS ENUM ('auto', 'jitsi', 'zoom', 'meet');

-- Visio participant role
CREATE TYPE visio_participant_role AS ENUM ('host', 'co_host', 'participant', 'observer');
```

---

## Indexes

### Performance-Critical Indexes

```sql
-- Users
CREATE INDEX idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX idx_users_email ON users(email);

-- Memberships
CREATE UNIQUE INDEX idx_memberships_cartel_user ON memberships(cartel_id, user_id);
CREATE INDEX idx_memberships_user_id ON memberships(user_id);

-- Knowledge Base
CREATE INDEX idx_kb_resources_cartel_id ON knowledge_base_resources(cartel_id);
CREATE INDEX idx_kb_resources_type ON knowledge_base_resources(type);
CREATE INDEX idx_kb_resources_category ON knowledge_base_resources(category);
CREATE INDEX idx_kb_resources_tags ON knowledge_base_resources USING GIN(tags);
CREATE INDEX idx_kb_favorites_user_resource ON knowledge_base_favorites(user_id, resource_id);

-- Notes
CREATE INDEX idx_notes_cartel_id ON notes(cartel_id);
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_shared ON notes(is_shared) WHERE is_shared = true;

-- Communication
CREATE INDEX idx_threads_cartel_id ON threads(cartel_id);
CREATE INDEX idx_threads_last_message ON threads(last_message_at DESC);
CREATE INDEX idx_chat_messages_thread_id ON chat_messages(thread_id);
CREATE INDEX idx_chat_messages_created ON chat_messages(created_at DESC);

-- Events
CREATE INDEX idx_events_cartel_id ON events(cartel_id);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_event_attendees_event_user ON event_attendees(event_id, user_id);

-- Plus One
CREATE INDEX idx_plus_one_requests_cartel ON plus_one_requests(cartel_id);
CREATE INDEX idx_plus_one_requests_status ON plus_one_requests(status);
CREATE INDEX idx_plus_one_messages_request ON plus_one_messages(request_id);

-- Visio
CREATE INDEX idx_visio_sessions_cartel ON visio_sessions(cartel_id);
CREATE INDEX idx_visio_sessions_start ON visio_sessions(start_at);
CREATE INDEX idx_visio_sessions_status ON visio_sessions(status);
CREATE INDEX idx_visio_participants_session ON visio_participants(session_id);
```

---

## RLS Policies Summary

### Security Model

All tables use Row-Level Security (RLS) with the following patterns:

1. **Kartel-scoped data**: Accessible to kartel members via `memberships` join
2. **User-owned data**: Accessible only to the owner (e.g., personal notes)
3. **Role-gated writes**: Coordinators/admins can modify certain entities
4. **Visibility levels**: Some entities have explicit visibility flags (private/public)

### Key RLS Patterns

```sql
-- Example: Kartel-scoped read policy
CREATE POLICY "Users can view in their kartel"
ON some_table FOR SELECT
USING (
  cartel_id IN (
    SELECT cartel_id FROM memberships
    WHERE user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
  )
);

-- Example: Role-gated write policy
CREATE POLICY "Coordinators can update"
ON some_table FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM memberships m
    JOIN users u ON u.id = m.user_id
    WHERE m.cartel_id = some_table.cartel_id
    AND u.auth_user_id = auth.uid()
    AND m.role = 'coordinator'
  )
  OR has_role(auth.uid(), 'admin')
);
```

### Security Definer Function

**CRITICAL:** The `has_role()` function uses `SECURITY DEFINER` to prevent infinite recursion in RLS policies:

```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
    AND role = _role
  )
$$;
```

---

## Database Functions

### Core Functions

```sql
-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update thread last message timestamp
CREATE OR REPLACE FUNCTION public.update_thread_last_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.threads
  SET last_message_at = NEW.created_at,
      updated_at = now()
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$;

-- Handle new user creation from auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (
    auth_user_id,
    email,
    first_name,
    last_name,
    name,
    provider,
    preferred_locale,
    is_demo,
    role
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'first_name', '') || ' ' || COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'provider', 'email'),
    COALESCE(NEW.raw_user_meta_data->>'preferred_locale', 'fr'),
    COALESCE((NEW.raw_user_meta_data->>'is_demo')::boolean, false),
    COALESCE(NEW.raw_user_meta_data->>'role', 'member')
  );
  RETURN NEW;
END;
$$;

-- Update last login timestamp
CREATE OR REPLACE FUNCTION public.update_last_login()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.users
  SET last_login_at = now()
  WHERE auth_user_id = NEW.id;
  RETURN NEW;
END;
$$;

-- Check user role (RLS helper)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
    AND role = _role
  )
$$;
```

### Active Triggers

```sql
-- Auth triggers (on auth.users)
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Updated_at triggers (multiple tables)
CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON public.notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_milestones_updated_at
  BEFORE UPDATE ON public.milestones
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_visio_sessions_updated_at
  BEFORE UPDATE ON public.visio_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Thread message triggers
CREATE TRIGGER update_thread_on_message
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_thread_last_message();
```

---

## Migration Strategy

### Current State

Database is live with ~30 tables. All migrations have been applied via Supabase.

### Recommended Additions

**Missing Tables for Full Backend:**

1. `audit_logs` - System-wide audit trail
2. `webhook_logs` - Webhook delivery tracking
3. `api_rate_limits` - Rate limiting state
4. `presence` - Real-time presence tracking

**Recommended Schema:**

```sql
-- System audit log
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES public.users(id),
  actor_role text,
  action text NOT NULL,
  target_table text NOT NULL,
  target_id uuid,
  before_json jsonb,
  after_json jsonb,
  ip_address text,
  request_id text,
  created_at timestamptz DEFAULT now()
);

-- Webhook delivery logs
CREATE TABLE IF NOT EXISTS public.webhook_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  endpoint text NOT NULL,
  payload jsonb NOT NULL,
  signature text,
  status text DEFAULT 'pending',
  response jsonb,
  error text,
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz
);

-- Real-time presence
CREATE TABLE IF NOT EXISTS public.presence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id),
  cartel_id uuid REFERENCES public.cartels(id),
  status text DEFAULT 'online',
  last_seen timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);
```

---

## Backup & Maintenance

### Backup Strategy

**Supabase Automatic Backups:**
- Daily automated backups (7-day retention on Pro plan)
- Point-in-time recovery available

**Manual Backup:**
```bash
# Export schema
pg_dump -h db.xxx.supabase.co -U postgres -d postgres --schema-only > schema.sql

# Export data
pg_dump -h db.xxx.supabase.co -U postgres -d postgres --data-only > data.sql

# Export specific tables
pg_dump -h db.xxx.supabase.co -U postgres -d postgres -t public.users -t public.cartels > backup.sql
```

### Maintenance Tasks

**Weekly:**
- Review slow query logs
- Check table bloat
- Verify backup completion

**Monthly:**
- Analyze table statistics: `ANALYZE;`
- Review unused indexes
- Archive old audit logs (>90 days)
- Check RLS policy performance

**Quarterly:**
- Review and optimize indexes
- Update PostgREST schema cache
- Security audit of RLS policies

---

## Performance Considerations

### Query Optimization

1. **Use indexes on foreign keys** (already implemented)
2. **Add composite indexes** for common query patterns
3. **Use EXPLAIN ANALYZE** for slow queries
4. **Consider materialized views** for dashboard aggregations

### Connection Pooling

Supabase provides connection pooling via Supavisor:
- Transaction mode for short queries
- Session mode for long-running operations

### Realtime Subscriptions

Enable realtime selectively:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.presence;
```

---

## Security Checklist

- ✅ RLS enabled on all tables
- ✅ Security definer function for role checks
- ✅ Separate user_roles table
- ✅ No direct references to auth.users in policies
- ✅ Input validation via constraints
- ⚠️ Need: Audit log triggers
- ⚠️ Need: Rate limiting table
- ⚠️ Need: Webhook signature validation

---

## API Contract Notes

This schema supports the following API patterns:

**Authentication:**
- JWT-based auth via Supabase Auth
- Roles: member, coordinator, admin

**API Base:** `/cartel/v5`

**Key Endpoints:**
- `GET /cartels/{id}/dashboard` - Overview data
- `GET /cartels/{id}/members` - Member list
- `GET /kb/{id}/documents` - Knowledge base
- `POST /visio/sessions` - Create session
- `POST /+1/requests` - Create request
- `GET /overview` - KPI dashboard

See OpenAPI spec (separate file) for full contract.

---

## Glossary

- **Kartel**: Study group (3-5 members)
- **+1 / Coordinator**: Group facilitator role
- **RLS**: Row-Level Security (Postgres feature)
- **STT**: Speech-to-Text
- **KB**: Knowledge Base
- **QCM**: Multiple Choice Quiz (Questionnaire à Choix Multiples)

---

**Document Version:** 1.0  
**Schema Version:** As of migration `20251111001237`  
**Maintained By:** Kartels.io Development Team

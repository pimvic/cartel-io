# Kartels.io Architecture

**Version:** 1.0.0  
**Last Updated:** 2025-11-11

## Overview

Kartels.io is a bilingual (French/English) educational collaboration platform built with React, TypeScript, Tailwind CSS, and Supabase. The application provides comprehensive tools for study groups including knowledge management, calendaring, messaging, video conferencing, and pedagogical tools.

---

## Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety and developer experience
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Router** - Client-side routing
- **React Query (TanStack Query)** - Server state management
- **i18next** - Internationalization (i18n)

### Backend (Lovable Cloud / Supabase)
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Authentication (email/password, OAuth)
  - Edge Functions (serverless)
- **Google Drive API** - File storage integration

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Bun** - Package manager

---

## Project Structure

```
kartels-io/
├── public/                      # Static assets
│   ├── robots.txt              # SEO crawler instructions
│   └── favicon.ico
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── ui/                 # Base UI components (shadcn/ui)
│   │   ├── dashboard/          # Dashboard-specific components
│   │   │   ├── Overview.tsx
│   │   │   ├── KnowledgeBase.tsx
│   │   │   ├── Calendar.tsx
│   │   │   ├── Notes.tsx
│   │   │   ├── Visio.tsx
│   │   │   └── ...
│   │   ├── Footer.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   ├── UserMenu.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/                # React Context providers
│   │   └── AuthContext.tsx     # Authentication state
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-toast.ts
│   │   └── use-mobile.tsx
│   ├── integrations/            # External service integrations
│   │   └── supabase/
│   │       ├── client.ts       # Supabase client (auto-generated)
│   │       └── types.ts        # Database types (auto-generated)
│   ├── lib/                     # Utilities and shared logic
│   │   ├── api/
│   │   │   └── client.ts       # HTTP client wrapper
│   │   ├── hooks/
│   │   │   └── useCartel.ts    # Custom hooks
│   │   ├── utils/
│   │   │   ├── date.ts         # Date formatting utilities
│   │   │   └── validation.ts   # Input validation
│   │   ├── constants.ts         # App-wide constants
│   │   ├── types/
│   │   │   └── index.ts        # Shared TypeScript types
│   │   └── utils.ts            # Utility functions (cn, etc.)
│   ├── locales/                 # i18n translation files
│   │   ├── en.json             # English translations
│   │   └── fr.json             # French translations
│   ├── pages/                   # Page-level components (routes)
│   │   ├── Dashboard.tsx       # Main dashboard container
│   │   ├── Landing.tsx         # Public landing page
│   │   ├── Login.tsx           # Authentication page
│   │   ├── Quiz.tsx            # Quiz tool
│   │   ├── Flashcards.tsx      # Flashcard tool
│   │   ├── Mindmap.tsx         # Mindmap tool
│   │   ├── Glossaire.tsx       # Glossary page
│   │   ├── Index.tsx           # Root redirect
│   │   └── NotFound.tsx        # 404 page
│   ├── services/                # Business logic / API services
│   │   ├── auth.service.ts     # Authentication operations
│   │   ├── user.service.ts     # User profile operations
│   │   └── cartel.service.ts   # Cartel/group operations
│   ├── utils/                   # Utility modules
│   │   └── i18n.ts             # i18n configuration
│   ├── App.tsx                  # Root component
│   ├── App.css                  # Global styles (minimal)
│   ├── index.css                # Tailwind imports + design tokens
│   ├── main.tsx                 # Application entry point
│   └── vite-env.d.ts           # Vite type declarations
├── supabase/                    # Supabase configuration
│   ├── config.toml             # Supabase project config
│   ├── functions/              # Edge Functions
│   │   └── upload-to-drive/    # Google Drive upload handler
│   └── migrations/             # SQL migration files
├── .env                         # Environment variables (auto-generated)
├── tailwind.config.ts          # Tailwind configuration
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies
├── DATABASE_SCHEMA.md          # Database schema documentation
├── ARCHITECTURE.md             # This file
├── DEV_GUIDE.md                # Developer guide
└── README.md                   # Project overview
```

---

## Core Architecture Patterns

### 1. Component Organization

#### UI Components (`src/components/ui/`)
- **Purpose**: Reusable, atomic UI components
- **Based on**: Radix UI primitives + shadcn/ui patterns
- **Examples**: Button, Card, Dialog, Input, Toast
- **Guidelines**:
  - No business logic
  - Accept props for customization
  - Use `cn()` utility for className merging
  - Implement accessibility (ARIA, keyboard nav)

#### Feature Components (`src/components/dashboard/`)
- **Purpose**: Domain-specific, feature-rich components
- **Examples**: Overview, KnowledgeBase, Calendar, Notes
- **Guidelines**:
  - Encapsulate feature logic
  - Use hooks for state management
  - Integrate with services for data operations
  - Keep components focused (Single Responsibility)

#### Page Components (`src/pages/`)
- **Purpose**: Top-level route components
- **Responsibilities**:
  - Route handling
  - Layout composition
  - Feature component orchestration
- **Guidelines**:
  - Minimal logic (delegate to features)
  - Handle routing params (`:lang`, etc.)
  - Set page metadata (titles, SEO)

### 2. State Management

#### Local State
- **Tool**: React `useState`, `useReducer`
- **Use for**: Component-specific UI state (toggles, form inputs)

#### Server State
- **Tool**: React Query (TanStack Query)
- **Use for**: Data from Supabase (users, cartels, messages, etc.)
- **Benefits**:
  - Automatic caching
  - Background refetching
  - Optimistic updates
  - Loading/error states

#### Global State
- **Tool**: React Context API
- **Current Contexts**:
  - `AuthContext` - User authentication and session
- **Guidelines**:
  - Keep contexts focused (single responsibility)
  - Use custom hooks (`useAuth()`) for access
  - Avoid context for frequently-changing data (performance)

### 3. Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
Service Function (src/services/)
    ↓
Supabase Client (src/integrations/supabase/client.ts)
    ↓
Supabase Backend (Postgres + RLS)
    ↓
Response
    ↓
React Query Cache Update
    ↓
Component Re-render
```

**Real-time Flow** (for live features like messaging):
```
Supabase Real-time Subscription
    ↓
Callback Handler in Component
    ↓
React Query Cache Invalidation
    ↓
Component Re-render with Fresh Data
```

### 4. Service Layer

**Location**: `src/services/`

**Purpose**: Encapsulate all data access and business logic

**Pattern**:
```typescript
// Example: auth.service.ts
export async function signIn(credentials) {
  const { data, error } = await supabase.auth.signIn(...);
  if (error) throw error;
  return data;
}
```

**Guidelines**:
- One service per domain (auth, user, cartel, notes, etc.)
- Export pure functions (no classes)
- Handle errors consistently
- Return typed results
- Document with JSDoc

### 5. Routing Architecture

**Structure**: Language-prefixed routes
```
/:lang                      → Landing page
/:lang/login                → Login page
/:lang/dashboard            → Dashboard (protected)
/:lang/quiz                 → Quiz tool (protected)
/:lang/flashcards           → Flashcards tool (protected)
...
```

**Protected Routes**: Wrapped in `<ProtectedRoute>` HOC
- Checks authentication status
- Redirects to login if unauthenticated
- Shows loading spinner during auth check

**Language Handling**:
- `:lang` parameter (`en` or `fr`)
- `i18next` automatically updates based on route
- Stored in localStorage for persistence

### 6. Authentication Flow

```
User enters credentials
    ↓
Login.tsx calls auth.service.signIn()
    ↓
Supabase Auth validates
    ↓
Session created (JWT token)
    ↓
AuthContext updates (user, session)
    ↓
ProtectedRoute allows access
    ↓
Dashboard loads
```

**Session Persistence**:
- Supabase stores session in localStorage
- Auto-refresh on token expiry
- `AuthContext` listens to auth state changes

### 7. Role-Based Access Control (RBAC)

**Roles**: `admin`, `moderator` (coordinator/+1), `user` (member)

**Storage**: Separate `user_roles` table (security best practice)

**Enforcement**:
- **Server-side**: RLS policies on Supabase tables
- **Client-side**: UI conditional rendering based on role

**Helper Function** (in RLS policies):
```sql
has_role(auth.uid(), 'admin')
```

**Service Function**:
```typescript
hasRole(userId, 'moderator') // src/services/user.service.ts
```

### 8. Internationalization (i18n)

**Library**: `i18next` + `react-i18next`

**Translation Files**:
- `src/locales/en.json`
- `src/locales/fr.json`

**Usage**:
```typescript
const { t } = useTranslation();
<h1>{t('dashboard.welcome')}</h1>
```

**Locale Detection**:
1. URL path (`:lang` param)
2. localStorage (`preferredLocale`)
3. Browser language
4. Fallback to French (`fr`)

---

## Database Schema

See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for detailed schema documentation.

**Key Tables**:
- `users` - User profiles
- `user_roles` - RBAC role assignments
- `cartels` - Study groups
- `memberships` - User-cartel associations
- `messages`, `threads` - Messaging system
- `notes` - Personal and shared notes
- `tasks`, `milestones` - Calendar/task management
- `knowledge_base_resources` - Documents/links
- `events` - Calendar events
- `feedback` - User feedback submissions

**Security**: All tables have Row Level Security (RLS) enabled

---

## Key Features & Modules

### Overview Dashboard
- **Component**: `src/components/dashboard/Overview.tsx`
- **Purpose**: Cartel analytics and member activity
- **KPIs**: Active members, study hours, tasks completed, progression
- **Integrations**: Real-time member presence, deadline tracking

### Knowledge Base
- **Component**: `src/components/dashboard/KnowledgeBase.tsx`
- **Features**: Document search, favorites, tagging, inline preview
- **File Types**: PDFs, videos, notes, links
- **Integrations**: Google Drive upload

### Messaging
- **Component**: `src/components/dashboard/MessagerieNewsEvents.tsx`
- **Features**: 1:1 and group threads, real-time delivery, reactions, file attachments
- **Integrations**: Supabase Realtime

### Calendar
- **Component**: `src/components/dashboard/Calendar.tsx`
- **Features**: Milestones, deadlines, status tracking, reminders
- **Integrations**: Event sync from messaging module

### Notes
- **Component**: `src/components/dashboard/Notes.tsx`
- **Features**: Personal & shared notes, autosave, version history, glossary
- **Integrations**: Markdown editor (future), real-time collaboration (future)

### Video Conferencing (Visio)
- **Component**: `src/components/dashboard/Visio.tsx`
- **Features**: WebRTC sessions, guest join, recording, STT, AI summaries
- **Integrations**: Calendar sync, automatic note generation

### Pedagogical Tools
- **Component**: `src/components/dashboard/PedagogicalTools.tsx`
- **Sub-tools**: Quiz, Flashcards, Mindmap, Glossary, QCM (MCQ)
- **Purpose**: Interactive learning aids

---

## Performance Considerations

### Optimization Strategies

1. **Code Splitting**:
   - React.lazy() for route-based splitting
   - Dynamic imports for large components

2. **React Query Caching**:
   - 5-minute stale time for static data
   - Background refetching for fresh data

3. **Debouncing**:
   - Search inputs (300ms)
   - Autosave (5s)

4. **Lazy Loading**:
   - Images: `loading="lazy"`
   - Infinite scroll for lists (pagination)

5. **Real-time Subscriptions**:
   - Only subscribe when component mounted
   - Clean up on unmount
   - Use specific filters to reduce payload

### Performance Targets

- **LCP (Largest Contentful Paint)**: ≤2.0s on mobile 4G
- **TTI (Time to Interactive)**: ≤100ms for filter actions
- **Search Debounce**: ≤300ms
- **Autosave**: Every 5 seconds

---

## Security Architecture

### Authentication
- Supabase Auth (JWT tokens)
- HttpOnly cookies for session (future improvement)
- OAuth providers: Google (configured)

### Authorization
- **RLS Policies**: Enforce access control at database level
- **Security Definer Functions**: Prevent RLS recursion
- **Role-based UI**: Hide actions based on user role

### Data Protection
- **No client-side role checks for security decisions**
- **Always validate on server (RLS)**
- **Audit logging** for sensitive operations

### API Security
- Rate limiting (future)
- CORS configuration
- Input validation and sanitization

---

## Testing Strategy (Future)

### Unit Tests
- Service functions
- Utility functions
- Custom hooks

### Integration Tests
- Component + service interactions
- Mock Supabase responses

### E2E Tests (Playwright/Cypress)
- Login flow
- Dashboard navigation
- Task creation/completion
- KB upload

---

## Deployment

### Environment
- **Platform**: Lovable Cloud (Supabase backend)
- **CI/CD**: Automatic deployment on push to main
- **Build**: Vite production build

### Environment Variables
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Anon key
- See `.env.example` for full list

---

## Future Enhancements

1. **TypeScript Migration**: Convert remaining JS files
2. **Testing Suite**: Add Jest + Playwright
3. **Performance Monitoring**: Add analytics (Vercel Analytics / Sentry)
4. **Offline Support**: Service worker + IndexedDB cache
5. **Mobile App**: React Native version
6. **Advanced AI Features**: Enhanced summarization, Q&A chatbot
7. **Collaboration**: Real-time collaborative editing (Yjs/CRDT)

---

## Additional Resources

- [README.md](./README.md) - Project overview and quick start
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Database documentation
- [DEV_GUIDE.md](./DEV_GUIDE.md) - Developer guide
- [Supabase Docs](https://supabase.com/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [i18next Docs](https://www.i18next.com/)

# Kartels.io

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Enabled-3ECF8E.svg)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A bilingual (French/English) educational collaboration platform built for study groups. Kartels.io provides comprehensive tools for knowledge management, calendaring, messaging, video conferencing, and pedagogical tools to enhance collaborative learning.

## 🌟 Features

### Core Capabilities
- **📚 Knowledge Base** - Document management with search, favorites, and inline preview
- **📅 Calendar & Milestones** - Deadline tracking, reminders, and progress monitoring
- **💬 Real-time Messaging** - 1:1 and group threads with reactions and file attachments
- **📝 Notes** - Personal and shared notes with autosave and version history
- **🎥 Video Conferencing (Visio)** - WebRTC sessions with recording, STT, and AI summaries
- **🎓 Pedagogical Tools** - Quiz, Flashcards, Mindmap, Glossary, QCM generators
- **👥 Member Management** - Role-based access control (Admin, Moderator, Member)
- **🌐 Bilingual Support** - Full French and English localization
- **📊 Analytics Dashboard** - KPIs, member activity, and progress tracking

### Technical Highlights
- **Real-time Collaboration** - Supabase real-time subscriptions for instant updates
- **Role-Based Access Control (RBAC)** - Secure, server-side role enforcement
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Type Safety** - Full TypeScript implementation
- **Accessibility** - WCAG 2.1 AA compliant
- **Performance Optimized** - Code splitting, lazy loading, React Query caching

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ (recommended: v20 LTS)
- **Bun** (package manager) - [Install Bun](https://bun.sh/)
- **Git** for version control

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/kartels-io.git
   cd kartels-io
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Environment setup**

   The `.env` file is auto-generated when connected to Lovable Cloud. For manual setup:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your Supabase credentials (see [Environment Variables](#environment-variables))

4. **Start development server**

   ```bash
   bun run dev
   ```

5. **Open in browser**

   Navigate to [http://localhost:8080](http://localhost:8080)

### First Time Setup

1. **Create an account** - Navigate to `/en/login` or `/fr/login`
2. **Sign up** with email/password or Google OAuth
3. **Auto-confirm** is enabled by default for testing (configure in Lovable Cloud → Auth Settings)
4. **Access dashboard** - Automatically redirected after login

---

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and design patterns
- **[DEV_GUIDE.md](./DEV_GUIDE.md)** - Developer guide with step-by-step tutorials
- **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - Complete database schema documentation
- **[AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md)** - Authentication configuration
- **[TESTING_AUTH.md](./TESTING_AUTH.md)** - Testing authentication flows

---

## 🔧 Development

### Available Scripts

```bash
# Development
bun run dev              # Start dev server (http://localhost:8080)

# Build
bun run build            # Production build
bun run preview          # Preview production build

# Code Quality
bun run lint             # Run ESLint
bun run format           # Format code with Prettier
bun run typecheck        # Run TypeScript compiler check

# Testing (coming soon)
bun run test             # Run unit tests
bun run test:e2e         # Run E2E tests
bun run test:coverage    # Generate coverage report
```

### Project Structure

```
kartels-io/
├── src/
│   ├── components/       # UI components
│   │   ├── ui/          # Base components (shadcn/ui)
│   │   └── dashboard/   # Feature components
│   ├── pages/           # Route components
│   ├── services/        # Business logic & API
│   ├── lib/             # Utilities, hooks, constants
│   ├── contexts/        # React Context providers
│   ├── locales/         # i18n translation files
│   └── integrations/    # Supabase client (auto-generated)
├── supabase/
│   ├── functions/       # Edge Functions
│   └── migrations/      # SQL migrations
├── public/              # Static assets
└── docs/                # Additional documentation
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed structure.

### Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes** - Follow patterns in [DEV_GUIDE.md](./DEV_GUIDE.md)

3. **Test locally**
   ```bash
   bun run dev
   ```

4. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add new feature"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

---

## 🌍 Environment Variables

### Required Variables

The following environment variables are automatically configured by Lovable Cloud:

```env
# Supabase Configuration (Auto-generated by Lovable Cloud)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id

# Google OAuth (Configured in Lovable Cloud → Auth Settings)
# GOOGLE_CLIENT_ID (server-side secret)
# GOOGLE_CLIENT_SECRET (server-side secret)

# Google Drive Integration (Optional)
# GOOGLE_DRIVE_FOLDER_ID (server-side secret)
# GOOGLE_SERVICE_ACCOUNT_JSON (server-side secret)
```

### Optional Variables

```env
# API Configuration (Optional)
VITE_API_BASE_URL=https://api.kartels.io

# Feature Flags (Optional)
VITE_ENABLE_MOCK_MODE=false
```

### Managing Secrets

**For Lovable Cloud:**
1. Navigate to your project in Lovable
2. Click **Cloud** → **Secrets**
3. Add secrets via the UI (never commit secrets to code!)

**For Self-Hosted:**
- Use your hosting platform's secret management (e.g., Vercel Environment Variables, Netlify Environment Variables)
- Never commit `.env` to version control

See `.env.example` for a complete template.

---

## 🗄️ Database

### Lovable Cloud (Recommended)

Kartels.io uses **Lovable Cloud** (powered by Supabase) for backend services:

- **PostgreSQL Database** - Fully managed with automatic backups
- **Row Level Security (RLS)** - Secure, policy-based access control
- **Real-time Subscriptions** - Live data updates
- **Authentication** - Email/password, OAuth (Google), magic links
- **Storage** - File uploads and management
- **Edge Functions** - Serverless backend logic

### Database Schema

See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for complete schema documentation.

**Key tables:**
- `users` - User profiles
- `user_roles` - RBAC role assignments
- `cartels` - Study groups
- `memberships` - User-cartel relationships
- `messages`, `threads` - Messaging system
- `notes` - Personal and shared notes
- `tasks`, `milestones` - Calendar/tasks
- `knowledge_base_resources` - Documents
- `events` - Calendar events

### Running Migrations

Migrations are managed through Lovable Cloud:

1. Navigate to **Cloud** → **Database** → **Migrations**
2. Create new migration with SQL
3. Apply migration (auto-deployed)

**Example migration:**

```sql
-- Create a new table
CREATE TABLE public.my_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cartel_id UUID REFERENCES public.cartels(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.my_table ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Users can view own data"
  ON public.my_table FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM public.memberships WHERE cartel_id = my_table.cartel_id
  ));
```

### Seed Data (Development)

Coming soon: Seed scripts for local development with sample data.

---

## 🔐 Authentication

Kartels.io uses Supabase Auth for secure authentication.

### Supported Methods

- **Email/Password** - Traditional signup/login
- **Google OAuth** - One-click Google sign-in
- **Magic Links** (optional) - Passwordless email login

### Configuration

**Auto-confirm emails** (for testing):
1. Open Lovable Cloud → **Cloud** → **Auth Settings**
2. Enable "Auto-confirm email signups"
3. This skips email verification (useful for development)

**Google OAuth setup:**
1. Configure in Lovable Cloud → **Auth Settings** → **Google**
2. Add Google Client ID and Secret
3. Set authorized domains

See [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md) for detailed instructions.

### Test Credentials

A demo user is seeded for testing:

```
Email: test@kartels.io
Password: test
```

⚠️ **Security Note:** Remove or change test credentials in production!

---

## 🌐 Internationalization (i18n)

Kartels.io is fully bilingual with French and English support.

### Language Detection

1. URL path (`:lang` parameter - `/en` or `/fr`)
2. localStorage (`preferredLocale`)
3. Browser language
4. Fallback: French (`fr`)

### Adding Translations

Edit translation files:

- `src/locales/en.json` - English
- `src/locales/fr.json` - French

**Usage in components:**

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('dashboard.welcome')}</h1>
      <p>{t('dashboard.description', { name: 'John' })}</p>
    </div>
  );
}
```

See [DEV_GUIDE.md](./DEV_GUIDE.md#internationalization-i18n) for details.

---

## 🎨 Styling & Design System

### Tailwind CSS

Kartels.io uses **Tailwind CSS** with semantic design tokens.

**Design tokens** (defined in `src/index.css`):

```css
--background, --foreground
--primary, --primary-foreground
--secondary, --secondary-foreground
--accent, --accent-foreground
--success, --destructive
--border, --ring
--muted, --muted-foreground
```

**Usage:**

```tsx
<div className="bg-background text-foreground border border-border rounded-lg p-4">
  <Button className="bg-primary text-primary-foreground">Click me</Button>
</div>
```

⚠️ **Never use raw colors** like `bg-white`, `text-black` - always use semantic tokens!

### Component Library

Built on **Radix UI** primitives with custom styling:

- Buttons, Cards, Dialogs, Dropdowns
- Forms (Input, Textarea, Select, Checkbox)
- Navigation (Tabs, Breadcrumbs, Sidebar)
- Feedback (Toast, Alert, Progress)

See `src/components/ui/` for all components.

---

## 📡 API Reference

Kartels.io primarily uses Supabase for backend operations. Edge Functions provide custom server-side logic.

### Supabase Client

**Import:**

```typescript
import { supabase } from '@/integrations/supabase/client';
```

**Common operations:**

```typescript
// Query
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('column', 'value');

// Insert
const { data, error } = await supabase
  .from('table_name')
  .insert({ column: 'value' })
  .select()
  .single();

// Update
const { data, error } = await supabase
  .from('table_name')
  .update({ column: 'new_value' })
  .eq('id', 'some-id');

// Delete
const { error } = await supabase
  .from('table_name')
  .delete()
  .eq('id', 'some-id');
```

### Edge Functions

**Location:** `supabase/functions/`

**Example: Upload to Google Drive**

```typescript
// POST /functions/v1/upload-to-drive
const response = await fetch(`${SUPABASE_URL}/functions/v1/upload-to-drive`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    fileName: 'document.pdf',
    mimeType: 'application/pdf',
    base64Data: base64String,
  }),
});
```

### Service Layer

Use service functions for data operations:

```typescript
import { getUserProfile, updateUserProfile } from '@/services/user.service';
import { getCartelMembers } from '@/services/cartel.service';
import { signIn, signOut } from '@/services/auth.service';

// Example usage
const profile = await getUserProfile(userId);
const members = await getCartelMembers(cartelId);
```

See `src/services/` for all available services.

---

## 🚢 Deployment

### Lovable Cloud Deployment (Recommended)

Kartels.io is optimized for deployment on **Lovable Cloud**:

1. **Frontend Updates:**
   - Click **Publish** button (top right)
   - Review changes
   - Click **Update** to deploy frontend
   - Changes go live immediately

2. **Backend Updates:**
   - Edge Functions deploy automatically on save
   - Database migrations deploy automatically on apply
   - No manual deployment needed

3. **Custom Domain:**
   - Navigate to **Settings** → **Domains**
   - Add your custom domain (e.g., `kartels.io`)
   - Configure DNS as instructed
   - Requires paid Lovable plan

**Default URL:** `https://your-project.lovable.app`

### Self-Hosting

You can deploy Kartels.io to any hosting platform:

#### Option 1: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Environment variables:**
- Add all variables from `.env` in Vercel dashboard
- Configure build command: `bun run build`
- Output directory: `dist`

#### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

**Build settings:**
- Build command: `bun run build`
- Publish directory: `dist`
- Add environment variables in Netlify dashboard

#### Option 3: Docker

```dockerfile
FROM oven/bun:1 as build
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install
COPY . .
RUN bun run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build and run:**

```bash
docker build -t kartels-io .
docker run -p 80:80 kartels-io
```

### Environment Setup for Self-Hosting

1. **Supabase Project:**
   - Create project at [supabase.com](https://supabase.com)
   - Copy project URL and anon key
   - Run migrations from `supabase/migrations/`

2. **Environment Variables:**
   - Set all variables from `.env.example`
   - Use your hosting platform's secret management

3. **Google OAuth (Optional):**
   - Configure in Supabase dashboard → Authentication → Providers
   - Add authorized domains

See [Self-Hosting Guide](https://docs.lovable.dev/tips-tricks/self-hosting) for details.

---

## 🧪 Testing

### Unit Tests (Coming Soon)

```bash
bun run test              # Run all tests
bun run test:watch        # Watch mode
bun run test:coverage     # Coverage report
```

**Test files:** `*.test.ts`, `*.test.tsx`

**Example test:**

```typescript
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### E2E Tests (Coming Soon)

```bash
bun run test:e2e          # Run E2E tests
```

**Test coverage:**
- Login flow (email, Google OAuth)
- Dashboard navigation
- Task creation and completion
- Knowledge Base upload
- Real-time messaging

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Process

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Follow code style** (ESLint + Prettier)
4. **Add tests** for new features
5. **Add JSDoc comments** for public functions
6. **Update translations** (FR + EN)
7. **Commit with conventional commits** (`feat:`, `fix:`, `docs:`, etc.)
8. **Push to branch** (`git push origin feature/amazing-feature`)
9. **Open Pull Request**

### Code Style

- **TypeScript** - All new code must be TypeScript
- **ESLint** - No warnings or errors
- **Prettier** - Auto-formatted on save
- **JSDoc** - All public functions and components
- **Semantic tokens** - Use design system colors
- **Accessibility** - WCAG 2.1 AA compliant

### Pull Request Checklist

- [ ] Code builds without errors
- [ ] All tests pass
- [ ] JSDoc comments added
- [ ] Translations added (FR + EN)
- [ ] No console.log statements
- [ ] Responsive design tested
- [ ] Accessibility verified
- [ ] PR description explains changes

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with:
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Radix UI](https://www.radix-ui.com/)
- [React Query](https://tanstack.com/query)
- [i18next](https://www.i18next.com/)

Powered by [Lovable Cloud](https://lovable.dev/)

---

## 📞 Support

- **Documentation:** [docs/](./docs/)
- **Issues:** [GitHub Issues](https://github.com/your-org/kartels-io/issues)
- **Email:** support@kartels.io
- **Discord:** [Join our community](https://discord.gg/kartels)

---

## 🗺️ Roadmap

### Q1 2025
- [ ] Complete testing suite (Jest + Playwright)
- [ ] Performance monitoring (Sentry)
- [ ] Advanced AI features (chatbot, Q&A)
- [ ] Mobile app (React Native)

### Q2 2025
- [ ] Real-time collaborative editing (Yjs/CRDT)
- [ ] Offline support (Service Worker + IndexedDB)
- [ ] Advanced analytics dashboard
- [ ] Export to PDF/Word

### Q3 2025
- [ ] Gamification (points, badges, leaderboards)
- [ ] Plugin system for custom tools
- [ ] White-label option for institutions
- [ ] API for third-party integrations

---

**Made with ❤️ for collaborative learning**

**Version:** 1.0.0  
**Last Updated:** 2025-11-11

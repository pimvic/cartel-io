# Authentication Setup Guide

## Overview
This application implements full multi-user authentication for both French (`/fr`) and English (`/en`) sites with the following features:
- Email/password signup and login
- Google OAuth sign-in
- Protected routes (dashboard only accessible to authenticated users)
- Session management with automatic token refresh
- Localized authentication interface (FR/EN)
- User profile display with dropdown menu

## Database Schema

### Users Table
The `users` table in the public schema stores user profile information:
- `id`: UUID (primary key)
- `auth_user_id`: UUID (references auth.users)
- `email`: TEXT
- `first_name`: TEXT
- `last_name`: TEXT
- `name`: TEXT (full name)
- `role`: TEXT (e.g., 'member', 'coordinator')
- `provider`: TEXT ('email' or 'google')
- `preferred_locale`: TEXT ('fr' or 'en')
- `is_demo`: BOOLEAN
- `last_login_at`: TIMESTAMPTZ
- `avatar_url`: TEXT

### Sessions Table
The `sessions` table tracks user sessions:
- `id`: UUID (primary key)
- `user_id`: UUID (references users)
- `token`: TEXT (session token)
- `created_at`: TIMESTAMPTZ
- `expires_at`: TIMESTAMPTZ
- `user_agent`: TEXT
- `ip_address`: TEXT

## Authentication Configuration

### Supabase Auth Settings
The following auth settings are configured:
- ✅ Auto-confirm email: Enabled (for testing/staging)
- ✅ Signup: Enabled
- ✅ Anonymous users: Disabled

### Google OAuth Setup
To enable Google sign-in:
1. Go to Lovable Cloud Backend → Users → Auth Settings
2. Configure Google OAuth with:
   - Google Client ID
   - Google Client Secret
3. Set authorized redirect URLs to include your app domain

## Creating the Test User

### Test User Credentials
- Email: `test@kartels.io`
- Password: `test`
- First Name: `Jean-Stéphane`
- Last Name: `B.`
- Role: `coordinator`
- Locale: `fr`
- Is Demo: `true`

### Option 1: Create via UI (Recommended)
1. Navigate to `/fr/login` or `/en/login`
2. Click "Create account" / "Créer un compte"
3. Fill in the form:
   - First Name: `Jean-Stéphane`
   - Last Name: `B.`
   - Email: `test@kartels.io`
   - Password: `test`
4. Click submit

The user will be automatically created with proper metadata.

### Option 2: Create via Supabase Dashboard
1. Go to Lovable Cloud Backend → Users → Authentication
2. Create a new user with email `test@kartels.io`
3. The trigger function will automatically create the profile in the public.users table

## Security Features

### Implemented Security Measures
- ✅ Password hashing (handled by Supabase Auth with bcrypt)
- ✅ HttpOnly Secure cookies for session tokens
- ✅ Row Level Security (RLS) policies on users and sessions tables
- ✅ Client-side email validation
- ✅ Session expiry and auto-refresh
- ✅ Protected routes with authentication guards
- ✅ Secure password storage (never stored in plaintext)

### Input Validation
- Email format validation on client and server
- Password minimum length: 6 characters
- Required fields: first name, last name, email for signup
- Sanitized inputs to prevent injection attacks

## User Flow

### Sign Up Flow
1. User visits `/[locale]/login`
2. Clicks "Create account"
3. Fills in: first name, last name, email, password (optional)
4. Submits form
5. Supabase creates auth user with metadata
6. Trigger function creates profile in public.users table
7. User is automatically logged in
8. Redirected to `/[locale]/dashboard`

### Login Flow
1. User visits `/[locale]/login`
2. Enters email and password
3. Supabase validates credentials
4. Session created and stored
5. User redirected to `/[locale]/dashboard`

### Google OAuth Flow
1. User clicks "Sign in with Google"
2. Redirected to Google OAuth consent screen
3. After consent, redirected back with auth token
4. Supabase validates token and creates/retrieves user
5. Trigger creates profile if new user
6. User redirected to `/[locale]/dashboard`

### Logout Flow
1. User clicks logout in dropdown menu
2. Session deleted from Supabase
3. Local storage and cookies cleared
4. User redirected to `/[locale]/login`

## Protected Routes

The following routes require authentication:
- `/[locale]/dashboard`
- `/[locale]/quiz`
- `/[locale]/flashcards`
- `/[locale]/mindmap`
- `/[locale]/glossaire`

Unauthenticated users attempting to access these routes will be automatically redirected to the login page.

## User Display

### Header User Menu
When authenticated, the user's name appears in the top-right with format:
- `First LastInitial.` (e.g., "Jean-Stéphane B.")

Clicking the user avatar/name opens a dropdown with:
- **Settings**: Navigate to settings page
- **Logout** / **Déconnexion**: Sign out and return to login

## Localization

All authentication strings are localized in:
- `src/locales/en.json`
- `src/locales/fr.json`

Under the `auth` object with keys:
- `login`, `logout`, `createAccount`
- `email`, `password`, `firstName`, `lastName`
- `googleSignIn`, `demoLogin`
- `hasAccount`, `noAccount`
- Success/error messages

## Testing Checklist

### Authentication Tests
- [ ] Register new user (EN) → auto login → dashboard visible
- [ ] Register new user (FR) → same behavior with French text
- [ ] Login with test@kartels.io + password "test"
- [ ] Google OAuth sign-in
- [ ] Access /dashboard when logged out → redirect to login
- [ ] Logout → storage cleared → redirect to login
- [ ] Invalid email format → validation error
- [ ] User name displays correctly in header
- [ ] Dropdown menu shows correct options
- [ ] Settings navigation works
- [ ] Logout clears all session data

### Security Tests
- [ ] Passwords are hashed (not visible in database)
- [ ] Sessions expire correctly
- [ ] RLS policies prevent unauthorized access
- [ ] Protected routes redirect unauthenticated users
- [ ] Session tokens are HttpOnly and Secure

## Troubleshooting

### Common Issues

**Issue**: "Requested path is invalid" error during login
**Solution**: Check that Site URL and Redirect URLs are properly configured in Auth Settings

**Issue**: User not redirected after login
**Solution**: Verify emailRedirectTo is set correctly in signUp/signIn calls

**Issue**: Profile not created after signup
**Solution**: Check that the trigger function `handle_new_user()` exists and is enabled

**Issue**: Google OAuth not working
**Solution**: 
1. Verify Google Client ID and Secret are configured
2. Check authorized redirect URLs in Google Cloud Console
3. Ensure redirect URL matches your app domain

**Issue**: Session not persisting
**Solution**: Check that cookies are enabled and Supabase client is configured with proper storage

## Environment Variables

The following environment variables are automatically configured by Lovable Cloud:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Supabase anon/public key

## Additional Resources

- Supabase Auth Documentation: https://supabase.com/docs/guides/auth
- Row Level Security Guide: https://supabase.com/docs/guides/auth/row-level-security
- Lovable Cloud Documentation: https://docs.lovable.dev/features/cloud

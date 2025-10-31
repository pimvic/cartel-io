# Quick Authentication Testing Guide

## Test the Authentication System

### 1. Create the Test User
**Option A: Via Signup Form (Recommended)**
1. Go to `/fr/login` or `/en/login`
2. Click "Créer un compte" / "Create Account"
3. Fill in:
   - First Name: `Jean-Stéphane`
   - Last Name: `B.`
   - Email: `test@kartels.io`
   - Password: `test`
4. Submit → You'll be automatically logged in and redirected to dashboard

**Option B: Via Lovable Cloud Backend**
1. Click "View Backend" button in Lovable interface
2. Go to Users → Create User
3. Enter email `test@kartels.io` and password `test`
4. The profile will be auto-created via database trigger

### 2. Test Login Flow
1. Navigate to `/fr/login`
2. Enter:
   - Email: `test@kartels.io`
   - Password: `test`
3. Click "Connexion"
4. Should redirect to `/fr/dashboard`
5. Top-right should show: "Jean-Stéphane B."

### 3. Test Google OAuth (After Configuration)
1. Configure Google OAuth in Backend → Users → Auth Settings
2. Click "Se connecter avec Google" / "Sign in with Google"
3. Complete Google sign-in
4. Should create profile and redirect to dashboard

### 4. Test Protected Routes
1. Open a new incognito window
2. Try to access `/fr/dashboard` directly
3. Should redirect to `/fr/login`
4. After login, should redirect back to dashboard

### 5. Test Logout
1. While logged in, click user avatar in top-right
2. Click "Déconnexion" / "Logout"
3. Should redirect to `/fr/login`
4. Try accessing `/fr/dashboard` → should redirect back to login

### 6. Test Locale Switching
1. Login at `/fr/login`
2. Navigate to `/en/dashboard` using language switcher
3. Interface should change to English
4. Logout should redirect to `/en/login` (preserves locale)

## Expected Behavior Summary

✅ **Signup**: Creates user profile automatically with metadata  
✅ **Login**: Validates credentials and creates session  
✅ **Google OAuth**: Creates/updates profile on first login  
✅ **Protected Routes**: Redirect to login when unauthenticated  
✅ **User Display**: Shows "FirstName LastInitial." format  
✅ **Logout**: Clears all session data and redirects to login  
✅ **Locale Persistence**: Maintains user's language preference  

## Security Note

⚠️ **Leaked Password Protection Warning**

The system currently shows a warning about leaked password protection being disabled. This is a Supabase Auth feature that checks passwords against known leaked password databases.

**To enable (optional):**
1. Open Lovable Cloud Backend
2. Go to Users → Auth Settings
3. Enable "Password Strength & Leaked Password Protection"
4. This will prevent users from using commonly leaked passwords

**Note**: This is optional for development/testing. For production apps, it's recommended to enable this feature.

## Troubleshooting

**Problem**: Can't create test user  
**Solution**: Make sure auto-confirm email is enabled in Auth Settings

**Problem**: Redirect after login goes to wrong page  
**Solution**: Check that `emailRedirectTo` in code matches your domain

**Problem**: User profile not created after signup  
**Solution**: Verify the `handle_new_user()` trigger exists in database

**Problem**: Google OAuth not working  
**Solution**: Configure Google Client ID/Secret in Auth Settings

## Quick Database Queries

Check if user exists:
```sql
SELECT * FROM public.users WHERE email = 'test@kartels.io';
```

Check active sessions:
```sql
SELECT * FROM public.sessions ORDER BY created_at DESC LIMIT 10;
```

View auth users:
```sql
SELECT id, email, created_at, last_sign_in_at 
FROM auth.users 
ORDER BY created_at DESC;
```

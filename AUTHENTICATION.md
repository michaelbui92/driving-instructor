# Instructor Authentication System

## Overview
A simple PIN-based authentication system for the instructor portal. This is an MVP implementation that maintains backward compatibility with existing data while adding basic security.

## Features
- **PIN-based login**: 4-6 digit PIN required to access instructor portal
- **Session management**: 24-hour sessions stored in localStorage
- **PIN reset**: Clear localStorage to reset PIN
- **Protected routes**: Instructor portal requires authentication
- **Logout functionality**: Clear session and redirect to login

## Files Created/Modified

### New Files:
1. `/lib/auth.ts` - Authentication utilities
   - PIN hashing and validation
   - Session management
   - Login/logout functions

2. `/components/AuthProvider.tsx` - React context provider
   - Manages auth state across the app
   - Provides auth status to components

3. `/components/ProtectedRoute.tsx` - Route protection component
   - Wraps protected pages
   - Redirects to login if not authenticated

4. `/app/instructor/login/page.tsx` - Login page
   - PIN input and validation
   - First-time PIN setup
   - PIN reset functionality

5. `/app/ClientLayout.tsx` - Client-side layout wrapper
   - Wraps app with AuthProvider

6. `/app/instructor/InstructorPageWrapper.tsx` - Instructor page wrapper
   - Wraps instructor page with ProtectedRoute

### Modified Files:
1. `/app/layout.tsx` - Updated to include ClientLayout
2. `/app/instructor/page.tsx` - Now uses wrapper with ProtectedRoute
3. `/app/instructor/InstructorPageContent.tsx` - Added logout functionality

## Authentication Flow

### First-time Setup:
1. User navigates to `/instructor`
2. Redirected to `/instructor/login` (no PIN set)
3. User sets 4-6 digit PIN
4. Auto-login and redirect to instructor portal

### Subsequent Logins:
1. User navigates to `/instructor`
2. Redirected to `/instructor/login` (not authenticated)
3. User enters PIN
4. Successful login redirects to instructor portal

### Logout:
1. Click "Logout" button in instructor portal
2. Session cleared
3. Redirected to login page

### PIN Reset:
1. Click "Forgot PIN? Reset it here" on login page
2. Confirm reset
3. PIN cleared from localStorage
4. User can set new PIN

## Security Notes (MVP Limitations)

### Current Implementation:
- PIN stored as simple hash in localStorage
- 24-hour session expiration
- Client-side only validation
- No backend/database

### Production Recommendations:
1. **Backend Authentication**: Move to Supabase/Firebase or custom backend
2. **Email/Password**: Replace PIN with proper credentials
3. **Password Reset**: Implement email-based reset
4. **Server-side Sessions**: Store sessions server-side
5. **HTTPS**: Ensure all traffic is encrypted
6. **Rate Limiting**: Prevent brute force attacks
7. **Audit Logging**: Track login attempts

## Testing the Implementation

### Manual Test Steps:
1. Navigate to `/instructor` - should redirect to login
2. Set a new PIN (4-6 digits)
3. Should auto-login and see instructor portal
4. Logout using button
5. Login with same PIN
6. Test PIN reset functionality

### LocalStorage Items:
- `instructor_pin_hash`: Hashed PIN
- `instructor_auth`: Session data with expiration

## Backward Compatibility
- Existing booking data in localStorage remains unchanged
- No migration required
- Authentication is additive to existing functionality

## Future Enhancements
1. **Phase 2 - Backend Auth**: Implement proper backend authentication
2. **Multi-instructor Support**: Allow multiple instructors with separate accounts
3. **Email Notifications**: Send login alerts and password reset emails
4. **Two-Factor Authentication**: Add 2FA for additional security
5. **Session Management**: View and revoke active sessions
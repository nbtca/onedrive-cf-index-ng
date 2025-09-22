# Logto Authentication Integration

This document explains how to configure and use Logto authentication with onedrive-cf-index-ng.

## What is Logto?

Logto is a modern authentication and authorization service that provides secure user sign-in capabilities. This integration adds an optional authentication layer to your OneDrive index application.

## Configuration

### Environment Variables

Add the following environment variables to enable Logto authentication:

```bash
# Logto Configuration
LOGTO_ENABLED=true
LOGTO_APP_ID=your_app_id_here
LOGTO_APP_SECRET=your_app_secret_here
LOGTO_ENDPOINT=https://your-logto-instance.logto.app
LOGTO_BASE_URL=https://your-domain.com
LOGTO_COOKIE_SECRET=a_complex_password_at_least_32_characters_long
```

### Logto Setup

1. **Create a Logto Application:**
   - Go to your Logto Console
   - Create a new application
   - Choose "Traditional Web App" as the application type
   - Note down the App ID and App Secret

2. **Configure Redirect URIs:**
   - Sign-in redirect URI: `https://your-domain.com/api/auth/logto/callback`
   - Sign-out redirect URI: `https://your-domain.com`

3. **Configure Environment Variables:**
   - Set the environment variables listed above
   - Make sure `LOGTO_ENABLED=true` to activate the feature

## How It Works

### Authentication Flow

1. **When Logto is enabled:**
   - Users must authenticate with Logto before accessing the OneDrive content
   - The authentication check happens at the API level
   - Unauthenticated users see a sign-in page

2. **When Logto is disabled:**
   - The application works as before without additional authentication
   - Only OneDrive OAuth and password protection (if configured) apply

### Integration Points

1. **API Level Protection:**
   - Main API route (`/api/*`) checks Logto authentication first
   - Returns 401 with `authType: 'logto'` for unauthenticated requests

2. **Frontend Integration:**
   - `LogtoAuth` component handles sign-in/sign-out UI
   - `LogtoWrapper` provides Logto context to the entire app
   - `FileListing` component shows Logto authentication form when needed

3. **Session Management:**
   - User sessions are managed through Logto's secure cookie system
   - Session information available via `/api/auth/user` endpoint

## Usage

### For Users

1. **When accessing the application:**
   - If not authenticated, users see a "Sign In with Logto" button
   - Click the button to redirect to Logto sign-in page
   - After successful authentication, return to the application

2. **Signing Out:**
   - When authenticated, users see their profile information
   - Click "Sign Out" to end the session

### For Developers

1. **Checking Authentication Status:**
   ```javascript
   // API endpoint to check user status
   fetch('/api/auth/user')
     .then(res => res.json())
     .then(data => {
       if (data.authenticated) {
         console.log('User:', data.user)
       }
     })
   ```

2. **Conditional Features:**
   ```javascript
   import { isLogtoEnabled } from '../utils/logtoHandler'
   
   if (isLogtoEnabled()) {
     // Logto-specific functionality
   }
   ```

## Security Considerations

1. **Cookie Security:**
   - Cookies are marked secure in production
   - CSRF protection through secure cookie handling

2. **Environment Variables:**
   - Never commit secrets to version control
   - Use secure secret management in production

3. **Session Management:**
   - Sessions automatically expire based on Logto configuration
   - Secure token refresh handled automatically

## Compatibility

- **Backward Compatible:** Existing installations continue to work without Logto
- **Optional Feature:** Can be enabled/disabled via environment variables
- **Coexists with OneDrive OAuth:** Both authentication systems work together

## Troubleshooting

### Common Issues

1. **"Logto is not enabled" error:**
   - Check that `LOGTO_ENABLED=true` is set
   - Verify all required environment variables are present

2. **Redirect URI mismatch:**
   - Ensure redirect URIs in Logto Console match your domain
   - Check that `LOGTO_BASE_URL` is correct

3. **Authentication loops:**
   - Verify cookie settings and secure flags
   - Check that `LOGTO_COOKIE_SECRET` is set and sufficiently complex

### Debug Mode

Enable debug logging by setting:
```bash
NODE_ENV=development
```

This will provide console output for authentication flow debugging.
/**
 * This file contains the configuration for Logto authentication integration.
 * 
 * Logto is used as an additional authentication layer that can work alongside
 * the existing Microsoft OAuth for OneDrive access.
 */
module.exports = {
  // Logto application configuration
  // These should be set via environment variables for security
  appId: process.env.LOGTO_APP_ID || '',
  appSecret: process.env.LOGTO_APP_SECRET || '',
  endpoint: process.env.LOGTO_ENDPOINT || '',
  
  // Base URL for the application - used for redirect URIs
  baseUrl: process.env.LOGTO_BASE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
  
  // Cookie configuration for session management
  cookieSecret: process.env.LOGTO_COOKIE_SECRET || 'complex_password_at_least_32_characters_long',
  cookieSecure: process.env.NODE_ENV === 'production',
  
  // Logto scopes to request
  scopes: ['openid', 'profile', 'email'],
  
  // Resources (if you need to access specific APIs)
  resources: [],
  
  // Whether Logto authentication is enabled
  enabled: process.env.LOGTO_ENABLED === 'true' || false,
}
import type { LogtoNextConfig } from '@logto/next/lib/src/types'
import logtoConfig from '../../config/logto.config'

// Create Logto configuration for the Next.js integration
export const logtoConfiguration: LogtoNextConfig = {
  appId: logtoConfig.appId,
  appSecret: logtoConfig.appSecret,
  endpoint: logtoConfig.endpoint,
  baseUrl: logtoConfig.baseUrl,
  cookieSecret: logtoConfig.cookieSecret,
  cookieSecure: logtoConfig.cookieSecure,
  scopes: logtoConfig.scopes,
  resources: logtoConfig.resources,
}

// Helper function to check if Logto is enabled
export function isLogtoEnabled(): boolean {
  return Boolean(logtoConfig.enabled && logtoConfig.appId && logtoConfig.appSecret && logtoConfig.endpoint)
}

// Helper function to get user info from Logto claims
export function extractUserInfo(claims: any) {
  return {
    id: claims.sub,
    email: claims.email,
    name: claims.name || claims.username,
    picture: claims.picture,
  }
}
import LogtoClient from '@logto/next/server-actions'
import { logtoConfiguration, extractUserInfo, isLogtoEnabled } from '../../../utils/logtoHandler'
import { NextRequest } from 'next/server'

// API route to get current user session information from Logto
export default async function handler(req: NextRequest): Promise<Response> {
  if (!isLogtoEnabled()) {
    return new Response(JSON.stringify({ error: 'Logto is not enabled' }), { 
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const logtoClient = new LogtoClient(logtoConfiguration)
    const context = await logtoClient.getLogtoContext()
    
    if (!context.isAuthenticated) {
      return new Response(JSON.stringify({ authenticated: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const userInfo = extractUserInfo(context.claims)
    
    return new Response(JSON.stringify({
      authenticated: true,
      user: userInfo,
      scopes: context.scopes,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('Error getting Logto user session:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to get user session',
      authenticated: false 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
import LogtoClient from '@logto/next/server-actions'
import { logtoConfiguration } from '../../../../utils/logtoHandler'
import { NextRequest } from 'next/server'

// Handle all Logto authentication routes
// This includes sign-in, sign-out, and callback handling
export default async function handler(req: NextRequest): Promise<Response> {
  const logtoClient = new LogtoClient(logtoConfiguration)
  const url = new URL(req.url)
  const route = url.pathname.split('/').pop()

  try {
    switch (route) {
      case 'sign-in':
        const { url: signInUrl, newCookie } = await logtoClient.handleSignIn({
          redirectUri: `${logtoConfiguration.baseUrl}/api/auth/logto/callback`,
        })
        
        const signInResponse = Response.redirect(signInUrl)
        if (newCookie) {
          signInResponse.headers.set('Set-Cookie', newCookie)
        }
        return signInResponse

      case 'sign-out':
        const signOutUrl = await logtoClient.handleSignOut(logtoConfiguration.baseUrl)
        return Response.redirect(signOutUrl)

      case 'callback':
        await logtoClient.handleSignInCallback(req.url)
        return Response.redirect(logtoConfiguration.baseUrl)

      default:
        return new Response('Not Found', { status: 404 })
    }
  } catch (error) {
    console.error('Logto auth error:', error)
    return new Response('Authentication error', { status: 500 })
  }
}
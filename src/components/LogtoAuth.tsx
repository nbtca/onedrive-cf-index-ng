import { useLogto } from '@logto/react'
import { FC, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'

interface LogtoAuthProps {
  onAuthSuccess?: () => void
  onAuthError?: (error: string) => void
}

const LogtoAuth: FC<LogtoAuthProps> = ({ onAuthSuccess, onAuthError }) => {
  const { signIn, signOut, isAuthenticated, isLoading, error, getIdTokenClaims } = useLogto()
  const [authError, setAuthError] = useState<string>('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (error) {
      const errorMsg = error.message || 'Authentication failed'
      setAuthError(errorMsg)
      onAuthError?.(errorMsg)
    }
  }, [error, onAuthError])

  useEffect(() => {
    if (isAuthenticated) {
      getIdTokenClaims().then(claims => {
        if (claims) {
          setUser({
            name: claims.name || claims.username,
            email: claims.email,
            picture: claims.picture,
          })
          onAuthSuccess?.()
        }
      }).catch(err => {
        console.error('Failed to get user claims:', err)
      })
    }
  }, [isAuthenticated, getIdTokenClaims, onAuthSuccess])

  const handleSignIn = async () => {
    try {
      setAuthError('')
      await signIn('/api/auth/logto/callback')
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to sign in'
      setAuthError(errorMsg)
      onAuthError?.(errorMsg)
    }
  }

  const handleSignOut = async () => {
    try {
      setAuthError('')
      await signOut('/')
      setUser(null)
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to sign out'
      setAuthError(errorMsg)
      onAuthError?.(errorMsg)
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-sm flex-col space-y-4 md:my-10">
        <div className="mx-auto w-3/4 md:w-5/6">
          <Image src={'/images/fabulous-wapmire-weekdays.png'} alt="loading" width={912} height={912} priority />
        </div>
        <div className="text-lg font-bold text-gray-900 dark:text-gray-100">Loading...</div>
        <p className="text-sm font-medium text-gray-500">
          Checking authentication status...
        </p>
      </div>
    )
  }

  if (isAuthenticated && user) {
    return (
      <div className="mx-auto flex max-w-sm flex-col space-y-4 md:my-10">
        <div className="mx-auto w-3/4 md:w-5/6">
          <Image src={user.picture || '/images/fabulous-wapmire-weekdays.png'} alt="user" width={912} height={912} priority />
        </div>
        <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Welcome, {user.name || user.email || 'User'}!
        </div>
        <p className="text-sm font-medium text-gray-500">
          You are authenticated with Logto.
        </p>
        <button
          className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-500 focus:outline-none focus:ring focus:ring-red-400"
          onClick={handleSignOut}
          disabled={isLoading}
        >
          <FontAwesomeIcon icon="sign-out-alt" className="mr-2" />
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col space-y-4 md:my-10">
      <div className="mx-auto w-3/4 md:w-5/6">
        <Image src={'/images/fabulous-wapmire-weekdays.png'} alt="authenticate" width={912} height={912} priority />
      </div>
      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">Authentication Required</div>

      <p className="text-sm font-medium text-gray-500">
        Please sign in to access this application.
      </p>

      {authError && (
        <div className="rounded bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900 dark:text-red-300">
          {authError}
        </div>
      )}

      <button
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-400"
        onClick={handleSignIn}
        disabled={isLoading}
      >
        <FontAwesomeIcon icon="sign-in-alt" className="mr-2" />
        Sign In with Logto
      </button>
    </div>
  )
}

export default LogtoAuth
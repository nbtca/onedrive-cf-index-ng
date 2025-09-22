import { LogtoProvider } from '@logto/react'
import { FC, ReactNode } from 'react'
import { isLogtoEnabled, logtoConfiguration } from '../utils/logtoHandler'

interface LogtoWrapperProps {
  children: ReactNode
}

const LogtoWrapper: FC<LogtoWrapperProps> = ({ children }) => {
  // If Logto is not enabled, just render children without provider
  if (!isLogtoEnabled()) {
    return <>{children}</>
  }

  return (
    <LogtoProvider config={logtoConfiguration}>
      {children}
    </LogtoProvider>
  )
}

export default LogtoWrapper
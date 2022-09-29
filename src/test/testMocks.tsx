import ErrorBoundary from 'components/ErrorBoundary'
import { AuthContainer } from 'containers/AuthContainer'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import { DebugContainer } from 'containers/DebugContainer'
import { SocketContainer } from 'containers/SocketContainer'
import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'

interface AuthContextType {
  isAuthEnabled: boolean
  userName: string
}

interface ProviderMocks {
  children: JSX.Element
  authProps?: AuthContextType
}

/**
 * Wrapper that puts children inside all props needed to render app properly
 * @param param0 Component(s) to render as children
 * @returns
 */
export const AllProviders = ({ children }: ProviderMocks) => {
  return (
    <BrowserRouter>
      <ServerConfigContainer.Provider>
        <DebugContainer.Provider>
          <SocketContainer.Provider>
            <AuthContainer.Provider>{children}</AuthContainer.Provider>
          </SocketContainer.Provider>
        </DebugContainer.Provider>
      </ServerConfigContainer.Provider>
    </BrowserRouter>
  )
}

/**
 * Wrapper that just has config provider
 * @param param0 Component(s) to render as children
 * @returns
 */
export const ConfigProviders = ({ children }: ProviderMocks) => {
  return (
    <ServerConfigContainer.Provider>{children}</ServerConfigContainer.Provider>
  )
}

/**
 * Wrapper that puts children inside all props needed to render app properly
 * AND has a Suspense fallback
 * @param param0 Component(s) to render as children
 * @returns
 */
export const SuspendedProviders = ({ children }: ProviderMocks) => {
  return (
    <BrowserRouter>
      <ServerConfigContainer.Provider>
        <DebugContainer.Provider>
          <SocketContainer.Provider>
            <AuthContainer.Provider>
              <Suspense fallback={<>LOADING...</>}>{children}</Suspense>
            </AuthContainer.Provider>
          </SocketContainer.Provider>
        </DebugContainer.Provider>
      </ServerConfigContainer.Provider>
    </BrowserRouter>
  )
}

/**
 * Wrapper that puts children inside all props needed to render app properly
 * AND logs in as admin user
 * @param param0 Component(s) to render as children
 * @returns
 */
export const LoggedInProviders = ({ children }: ProviderMocks) => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ServerConfigContainer.Provider>
          <DebugContainer.Provider>
            <SocketContainer.Provider>
              <AuthContainer.Provider>
                <LoginProvider>{children}</LoginProvider>
              </AuthContainer.Provider>
            </SocketContainer.Provider>
          </DebugContainer.Provider>
        </ServerConfigContainer.Provider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

const LoginProvider = ({ children }: ProviderMocks) => {
  const { login } = AuthContainer.useContainer()
  login('admin', 'password')
    .then(() => {
      // do nothing its a test
    })
    .catch((E) => {
      // swallowing Error { message: "Invalid token specified: Cannot read
      // properties of undefined (reading 'replace')" }
    })
  return <>{children}</>
}

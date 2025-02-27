import { render, screen, waitFor, within } from '@testing-library/react'
import WS from 'jest-websocket-mock'
import { mockAxios, regexUsers } from 'test/axios-mock'
import { TInstance, TServerAuthConfig, TSystem } from 'test/test-values'
import { LoggedInProviders } from 'test/testMocks'
import { TAdmin, TUser } from 'test/user-test-values'

import { NamespaceCard } from './NamespaceCard'

describe('NamespaceCard', () => {
  let server: WS

  beforeEach(() => {
    server = new WS('ws://localhost:2337/api/v1/socket/events')
  })

  afterEach(() => {
    WS.clean()
  })

  test('renders card if permission', async () => {
    mockAxios.onGet('/config').reply(200, TServerAuthConfig)
    mockAxios.onGet(regexUsers).reply(200, TAdmin)
    render(
      <LoggedInProviders>
        <NamespaceCard namespace={TSystem.namespace} />
      </LoggedInProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText(TSystem.namespace)).toBeInTheDocument()
    })
    const namespaceTitle = screen.getByTitle('Click to collapse')
    expect(namespaceTitle).toHaveClass('MuiAlert-outlinedSuccess')
    expect(
      within(namespaceTitle).getByText(TSystem.namespace),
    ).toBeInTheDocument()

    expect(screen.getByText(TSystem.name)).toBeInTheDocument()
    expect(screen.getByText(TSystem.version)).toBeInTheDocument()

    expect(
      screen.getByRole('link', { name: 'View instance commands' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'start' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'stop' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'reload' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'delete' })).toBeInTheDocument()

    expect(screen.getByText(TSystem.description)).toBeInTheDocument()
    expect(screen.getByText(TInstance.name)).toBeInTheDocument()
  })

  test('does not render if no permission', async () => {
    mockAxios.onGet('/config').reply(200, TServerAuthConfig)
    mockAxios.onGet(regexUsers).reply(200, TUser)
    render(
      <LoggedInProviders>
        <NamespaceCard namespace={TSystem.namespace} />
      </LoggedInProviders>,
    )
    await waitFor(() => {
      expect(screen.queryByText(TSystem.namespace)).not.toBeInTheDocument()
    })
  })

  test('Namespace Card updated on INSTANCE_UPDATED event', async () => {
    const mockInstance = Object.assign({}, TInstance, {
      status: 'STOPPED',
    })

    const mockSystem = Object.assign({}, TSystem, { instances: [mockInstance] })

    render(
      <LoggedInProviders>
        <NamespaceCard namespace={TSystem.namespace} />
      </LoggedInProviders>,
    )

    await waitFor(() => {
      expect(screen.getByText(TSystem.namespace)).toBeInTheDocument()
    })

    const namespaceTitleBefore = screen.getByTitle('Click to collapse')
    expect(namespaceTitleBefore).toHaveClass('MuiAlert-outlinedSuccess')
    expect(within(namespaceTitleBefore).getByText('test')).toBeInTheDocument()

    mockAxios.onGet('/api/v1/systems').reply(200, [mockSystem])

    // send instance updated event to stop an instance
    const mockEvent = {
      name: 'INSTANCE_UPDATED',
      payload: mockInstance,
    }
    server.send(JSON.stringify(mockEvent))

    await waitFor(() => {
      expect(screen.getByText(TSystem.namespace)).toBeInTheDocument()
    })

    const namespaceTitleAfter = screen.getByTitle('Click to collapse')
    expect(namespaceTitleAfter).toHaveClass('MuiAlert-outlinedError')
    expect(within(namespaceTitleAfter).getByText('test')).toBeInTheDocument()

    mockAxios.onGet('/api/v1/systems').reply(200, [TSystem])
  })

  test('Namespace Card updated on SYSTEM_REMOVED event', async () => {
    render(
      <LoggedInProviders>
        <NamespaceCard namespace={TSystem.namespace} />
      </LoggedInProviders>,
    )
    await waitFor(() => {
      expect(screen.getByText(TSystem.namespace)).toBeInTheDocument()
    })

    expect(screen.getByText('testSystem')).toBeInTheDocument()
    expect(screen.getByText('1.0.0')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'View instance commands' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'start' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'stop' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'reload' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'delete' })).toBeInTheDocument()
    expect(screen.getByText('testing a system')).toBeInTheDocument()
    expect(screen.getByText('testInstance')).toBeInTheDocument()

    mockAxios.onGet('/api/v1/systems').reply(200, [])

    // send instance updated event to remove a system
    const mockEvent = {
      name: 'SYSTEM_REMOVED',
      payload: TSystem,
    }
    server.send(JSON.stringify(mockEvent))

    await waitFor(() => {
      expect(screen.getByText('test')).toBeInTheDocument()
    })
    expect(screen.queryByText('testSystem')).not.toBeInTheDocument()
    expect(screen.queryByText('1.0.0')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: 'View instance commands' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'start' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'stop' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'reload' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'delete' }),
    ).not.toBeInTheDocument()
    expect(screen.queryByText('testing a system')).not.toBeInTheDocument()
    expect(screen.queryByText('testInstance')).not.toBeInTheDocument()
    mockAxios.onGet('/api/v1/systems').reply(200, [TSystem])
  })

  test('Alert is shown on error from getSystems()', async () => {
    mockAxios.onGet('/api/v1/systems').reply(404)

    render(
      <LoggedInProviders>
        <NamespaceCard namespace={TSystem.namespace} />
      </LoggedInProviders>,
    )

    await waitFor(() => {
      const errorMessage = 'ERROR: Error: Request failed with status code 404'
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })

    mockAxios.onGet('/api/v1/systems').reply(200, [TSystem])
  })
})

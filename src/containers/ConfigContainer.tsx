import { useCallback, useMemo, useState } from 'react'
import { createContainer } from 'unstated-next'
import { useMyAxios } from 'hooks/useMyAxios'

export interface ServerConfig {
  application_name: string
  auth_enabled: boolean
  trusted_header_auth_enabled: boolean
  icon_default: string
  debug_mode: boolean
  execute_javascript: boolean
  garden_name: string
  metrics_url: string
  url_prefix: string
}

const useServerConfig = () => {
  const { axiosInstance } = useMyAxios()
  const [config, setConfig] = useState<ServerConfig | null>(null)

  const getConfig = useCallback(async () => {
    const { data } = await axiosInstance.get<ServerConfig>('/config', {
        timeout: 1000,
        headers: {
          Accept: 'application/json',
        },
      })


    console.log(
      'config AUTH_ENABLED: ',
      data.auth_enabled ? 'yes' : String(data.auth_enabled),
    )
    console.log(
      'config DEBUG_MODE: ',
      data.debug_mode ? 'yes' : String(data.debug_mode),
    )
    setConfig(data)
    return data
  }, [setConfig, axiosInstance])

  const authEnabled = useMemo(() => {
    return config?.auth_enabled ?? false
  }, [config])

  const debugEnabled = useMemo(() => {
    return config?.debug_mode ?? false
  }, [config])

  return {
    config,
    getConfig,
    authEnabled,
    debugEnabled,
  }
}

export const ServerConfigContainer = createContainer(useServerConfig)

import useSystems from 'hooks/useSystems'
import { ExploreButton } from 'pages/SystemIndex/SystemIndexTable'
import { useMemo } from 'react'
import { Column } from 'react-table'
import { System } from 'types/backend-types'

type SystemIndexTableData = {
  name: string
  description: string
  version: string
  namespace: string
  commandCount: number
  instanceCount: number
  exploreButton: JSX.Element
}

const systemMapper = (system: System): SystemIndexTableData => {
  return {
    namespace: system.namespace,
    name: system.name,
    version: system.version,
    description: system.description,
    commandCount: system.commands.length,
    instanceCount: system.instances.length,
    exploreButton: ExploreButton(system),
  }
}

const useSystemIndexTableData = (): SystemIndexTableData[] => {
  const systemClient = useSystems()
  const systemList = systemClient.getSystems()
  return systemList.map(systemMapper)
}

const useSystemIndexTableColumns = () => {
  return useMemo<Column<SystemIndexTableData>[]>(
    () => [
      {
        Header: 'Plugin',
        columns: [
          {
            Header: 'Namespace',
            accessor: 'namespace',
            width: 150,
          },
          {
            Header: 'System',
            accessor: 'name',
            filter: 'fuzzyText',
            width: 120,
          },
          {
            Header: 'Version',
            accessor: 'version',
            width: 120,
          },
        ],
      },
      {
        Header: 'Details',
        columns: [
          {
            Header: 'Description',
            accessor: 'description',
            filter: 'fuzzyText',
            minWidth: 200,
            width: 300,
            disableSortBy: true,
          },
          {
            Header: 'Commands',
            accessor: 'commandCount',
            width: 100,
            minWidth: 100,
            maxWidth: 180,
            disableSortBy: true,
            disableFilters: true,
          },
          {
            Header: 'Instances',
            accessor: 'instanceCount',
            width: 90,
            minWidth: 90,
            maxWidth: 180,
            disableSortBy: true,
            disableGroupBy: true,
            disableFilters: true,
          },
          {
            Header: '',
            accessor: 'exploreButton',
            disableSortBy: true,
            disableGroupBy: true,
            disableFilters: true,
            canHide: false,
            width: 300,
            midWidth: 90,
          },
        ],
      },
    ],
    [],
  )
}

export { useSystemIndexTableColumns, useSystemIndexTableData }

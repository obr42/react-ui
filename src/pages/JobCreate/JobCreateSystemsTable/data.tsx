import { Button } from '@mui/material'
import { DefaultCellRenderer } from 'components/Table/defaults'
import { useCallback, useMemo } from 'react'
import { Column } from 'react-table'
import { System } from 'types/backend-types'

type JobCreateSystemsTableData = {
  namespace: string
  name: string
  version: string
  choose: JSX.Element
}

const ChooseButton = (
  system: System,
  systemSetter: (system: System) => void,
): JSX.Element => {
  return (
    <Button
      size="small"
      variant="contained"
      color="primary"
      onClick={() => systemSetter(system)}
    >
      Select
    </Button>
  )
}

const useSystemMapper = (
  systemSetter: (system: System) => void,
): ((system: System) => JobCreateSystemsTableData) => {
  return useCallback(
    (system: System): JobCreateSystemsTableData => {
      const { namespace, name, version } = system
      return {
        namespace,
        name,
        version,
        choose: ChooseButton(system, systemSetter),
      }
    },
    [systemSetter],
  )
}

const useSystemsData = (
  systems: System[],
  systemSetter: (system: System) => void,
) => {
  const systemMapper = useSystemMapper(systemSetter)
  return (systems as System[]).map(systemMapper)
}

const useSystemColumns = () => {
  return useMemo<Column<JobCreateSystemsTableData>[]>(
    () => [
      {
        Header: 'Namespace',
        accessor: 'namespace',
        width: 135,
        disableFilters: true,
        canHide: false,
      },
      {
        Header: 'System Name',
        accessor: 'name',
        width: 150,
        disableFilters: true,
        canHide: false,
      },
      {
        Header: 'System Version',
        accessor: 'version',
        width: 150,
        disableFilters: true,
        canHide: false,
      },
      {
        Header: '',
        Cell: DefaultCellRenderer,
        accessor: 'choose',
      },
    ],
    [],
  )
}

export { useSystemColumns, useSystemsData }

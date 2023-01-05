import { Button } from '@material-ui/core'
import { JobRequestCreationContext } from 'components/JobRequestCreation'
import { useSystems } from 'hooks/useSystems'
import { CannotReExecuteButton } from 'pages/RequestView/RemakeRequestButton'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Request, System } from 'types/backend-types'
import { SystemCommandPair } from 'types/custom-types'
import {
  CommandViewModelComment,
  CommandViewModelParameters,
  CommandViewRequestModel,
} from 'types/form-model-types'
import { commandsPairer } from 'utils/commandFormatters'

interface RemakeRequestButtonProps {
  request: Request
}

const RemakeRequestButton = ({ request }: RemakeRequestButtonProps) => {
  const navigate = useNavigate()
  const { getSystems } = useSystems()
  const [systemCommandPair, setSystemCommandPair] = useState<
    SystemCommandPair | undefined
  >()
  const { setSystem, setCommand, setIsJob, setRequestModel, setIsReplay } =
    useContext(JobRequestCreationContext)
  const {
    command: commandName,
    system: systemName,
    system_version: systemVersion,
    namespace,
    instance_name: instanceName,
    parameters: theParameters,
    comment: theComment,
  } = request

  useEffect(() => {
    getSystems().then((response) => {
      setSystemCommandPair(
        response.data
          .filter(
            (s: System) =>
              s.name === systemName &&
              s.version === systemVersion &&
              s.namespace === namespace,
          )
          .map(commandsPairer)
          .flat()
          .filter((p: SystemCommandPair) => p.command.name === commandName)
          .pop(),
      )
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (
    !setSystem ||
    !setCommand ||
    !setIsJob ||
    !setRequestModel ||
    !setIsReplay
  ) {
    return <CannotReExecuteButton message="ERROR: Unknown error" />
  } else if (!request) {
    return <CannotReExecuteButton message="ERROR: Request not available" />
  }
  if (!systemCommandPair) {
    return (
      <CannotReExecuteButton message="ERROR: System or Command not available" />
    )
  }

  const model: CommandViewRequestModel = {
    comment: { comment: theComment || '' } as CommandViewModelComment,
    instance_names: { instance_name: instanceName },
    parameters: theParameters as CommandViewModelParameters,
  }

  const onClick = () => {
    setSystem(systemCommandPair.system)
    setCommand(systemCommandPair.command)
    setIsJob(false)
    setIsReplay(true)
    setRequestModel(model)
    navigate(
      [
        '/systems',
        namespace,
        systemName,
        systemVersion,
        'commands',
        commandName,
      ].join('/'),
    )
  }

  return (
    <Button
      variant="contained"
      color="primary"
      style={{ float: 'right' }}
      onClick={onClick}
    >
      Remake Request
    </Button>
  )
}

export { RemakeRequestButton }

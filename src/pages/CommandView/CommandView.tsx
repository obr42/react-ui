import { Box, Stack } from '@mui/material'
import Breadcrumbs from 'components/Breadcrumbs'
import { Divider } from 'components/Divider'
import { JobRequestCreationContext } from 'components/JobRequestCreation'
import { JsonCard } from 'components/JsonCard'
import { PageHeader } from 'components/PageHeader'
import { ServerConfigContainer } from 'containers/ConfigContainer'
import {
  getJobSchema,
  getModel,
  getSchema,
  getUiSchema,
  getValidator,
} from 'formHelpers'
import { CommandViewForm } from 'pages/CommandView/CommandViewForm'
import { checkContext } from 'pages/CommandView/commandViewHelpers'
import { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AugmentedCommand, StrippedSystem } from 'types/custom-types'
import { CommandViewModel } from 'types/form-model-types'

const CommandView = () => {
  const { debugEnabled } = ServerConfigContainer.useContainer()
  const { namespace, systemName, version, commandName } = useParams()
  const context = useContext(JobRequestCreationContext)
  const { system, command, isJob, requestModel } = context

  const checkedParams = checkContext(
    namespace,
    systemName,
    version,
    commandName,
    system,
    command,
  )

  if (checkedParams) return checkedParams

  // we know that neither of these are undefined because of the call to
  // 'checkedParams'
  const theSystem = system as StrippedSystem
  const theCommand = command as AugmentedCommand

  const breadcrumbs = [namespace, systemName, version, commandName].filter(
    (x) => !!x,
  ) as string[]
  const description = theCommand.description || ''
  const title = commandName ?? ''
  const instances = theSystem.instances
  const parameters = theCommand.parameters
  const schema = isJob
    ? getJobSchema(getSchema(instances, parameters))
    : getSchema(instances, parameters)
  const uiSchema = getUiSchema(instances)
  const validator = getValidator(parameters)

  let model: CommandViewModel

  if (requestModel) {
    model = requestModel
  } else {
    model = getModel(parameters, theSystem.instances, isJob)
  }

  return (
    <Box>
      <PageHeader title={title} description={description} />
      <Divider />
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Box>
        <CommandViewForm
          schema={schema}
          uiSchema={uiSchema}
          initialModel={model}
          command={theCommand}
          isJob={isJob}
          validator={validator}
        />
      </Box>
      {debugEnabled && (
        <Stack direction={'row'} spacing={2}>
          <JsonCard title="Command" data={theCommand} />
          <JsonCard title="Schema" data={schema} />
          <JsonCard title="UI Schema" data={uiSchema} />
        </Stack>
      )}
    </Box>
  )
}

export { CommandView }

import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import * as mockData from './testData'

axios.defaults.baseURL = 'http://localhost:4000'

const mock = new MockAdapter(axios)

mock.onGet('/config').reply(200, mockData.TServerConfig)
mock.onGet('/version').reply(200, mockData.TVersionConfig)
mock.onGet('/api/v1/jobs').reply(200, mockData.TJob)
mock.onGet('/api/v1/commandpublishingblocklist').reply(200, mockData.TBlocklist)
mock.onGet('/api/v1/systems').reply(200, [mockData.TSystem])

mock.onPost('/api/v1/requests').reply(200, { id: 'testRequest' })

mock.onAny().reply(200, undefined)

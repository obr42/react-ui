import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import * as mockData from './testData'

axios.defaults.baseURL = 'http://localhost:4000'

const mock = new MockAdapter(axios)

const regexLogs = new RegExp(/(\/api\/v1\/instances\/)\w+(\/logs)/)

mock.onGet('/config').reply(200, mockData.serverConfig)
mock.onGet('/version').reply(200, mockData.versionConfig)
mock.onGet('/api/v1/jobs').reply(200, mockData.job)
mock.onGet(regexLogs).reply(200, mockData.TLog, { request_id: 'fetchedLog' })

mock.onPost('/api/v1/requests').reply(200, { id: 'testRequest' })

mock.onAny().reply(200, undefined)

module.exports = { mockAxios: mock }

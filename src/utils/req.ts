import axios from 'axios'

const service = axios.create({
  baseURL: process.env.REACT_APP_API,
  timeout: 2000,
})

service.interceptors.request.use(
  function (config: any) {
    config.metadata = { startTime: new Date() }
    const token = localStorage.getItem('lw_token')
    const authcode = localStorage.getItem('lw_authcode')
    if (token) config.headers.token = token
    if (authcode) config.headers.authcode = authcode
    return config
  },
  function (error: any) {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  function (response: any) {
    response.config.metadata.endTime = new Date()
    response.duration =
      response.config.metadata.endTime - response.config.metadata.startTime
    return response
  },
  function (error: any) {
    error.config.metadata.endTime = new Date()
    error.duration =
      error.config.metadata.endTime - error.config.metadata.startTime
    return Promise.reject(error)
  }
)

export default service

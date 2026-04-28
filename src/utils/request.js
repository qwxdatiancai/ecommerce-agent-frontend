import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: 'https://qwx666-ecommerce-agent-api.hf.space', // 强行写死！
  timeout: 5000
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      // set Authorization header
      config.headers['Authorization'] = getToken()
      return config
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default service

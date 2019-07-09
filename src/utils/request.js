import axios from 'axios'
import store from '@/store'

const getHeaders = () => {
  let token = store.state.user.token

  if (token !== '') {
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  } else {
    return {
      'Content-Type': 'application/json'
    }
  }
}

export function request (method, url, data = {}) {
  return axios({
    method: method,
    baseURL: store.state.api.baseUrl,
    url: url,
    headers: getHeaders(),
    params: (method === 'get') ? data : {},
    data: (method !== 'get') ? data : {},
    timeout: store.state.api.timeout
  })
}

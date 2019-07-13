import Vue from 'vue'
import Vuex from 'vuex'
import { Base64 } from 'js-base64'

Vue.use(Vuex)

function tokenExpired (token) {
  if (token !== undefined && typeof token === 'string' && token !== '') {
    let preloads = JSON.parse(Base64.decode(token.split('.')[1]))
    if (preloads.expired_at !== undefined) {
      return new Date(preloads.expired_at)
    } else {
      return new Date()
    }
  } else {
    return new Date()
  }
}

export default new Vuex.Store({
  state: {
    tensorSensitivity: 2.56,
    api: {
      baseUrl: 'https://server.agcx.rooti.cn',
      timeout: 5000
    },
    user: {
      id: 0,
      email: '',
      name: '',
      token: window.localStorage.getItem('token'),
      expired_at: tokenExpired(window.localStorage.getItem('token'))
    }
  },
  mutations: {
    login (state, token) {
      let preloads = JSON.parse(Base64.decode(token.split('.')[1]))
      if (preloads.expired_at !== undefined) {
        let now = new Date()
        let expiredAt = new Date(preloads.expired_at)
        if (expiredAt.getTime() - now.getTime() < 0) {
          return
        }

        state.user.id = preloads.id
        state.user.email = preloads.email
        state.user.name = preloads.name
        state.user.token = token
        state.user.expired_at = expiredAt

        window.localStorage.setItem('token', token)
      }
    },
    logout (state) {
      state.user = {
        id: 0,
        email: '',
        name: '',
        token: '',
        expired_at: new Date()
      }
      window.localStorage.setItem('token', '')
    }
  }
})

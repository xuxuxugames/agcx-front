import Vue from 'vue'
import Vuex from 'vuex'
import { Base64 } from 'js-base64'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    api: {
      baseUrl: 'http://172.20.10.3:8000',
      timeout: 5000
    },
    user: {
      id: 0,
      email: '',
      name: '',
      token: '',
      expired_at: new Date()
    }
  },
  mutations: {
    login (state, token) {
      state.user = {
        id: 1,
        email: 'kokoro@core.moe',
        name: 'kotoyuuko',
        token: Base64.encode(token),
        expired_at: new Date()
      }
      // let preloads = JSON.parse(Base64.decode(token.split('.')[1]))
      // if (preloads.expired_at !== undefined) {
      //   let now = new Date()
      //   let expiredAt = new Date(preloads.expired_at)
      //   if (expiredAt.getTime() - now.getTime() < 0) {
      //     return
      //   }

      //   state.user.id = preloads.id
      //   state.user.email = preloads.email
      //   state.user.name = preloads.name
      //   state.user.token = token
      //   state.user.expired_at = expiredAt
      // }
    },
    logout (state) {
      state.user = {
        id: 0,
        email: '',
        name: '',
        token: '',
        expired_at: new Date()
      }
    }
  }
})

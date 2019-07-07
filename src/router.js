import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Game2048 from './views/Game2048.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/2048',
      name: '2048',
      component: Game2048
    }
  ]
})

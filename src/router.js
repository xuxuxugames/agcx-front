import Vue from 'vue'
import Router from 'vue-router'
import Layout from './layouts/Layout.vue'
import Home from './views/Home.vue'
import Game2048 from './views/Game2048.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: '/home'
    },
    {
      path: '/1',
      name: 'index',
      component: Layout,
      children: [
        {
          path: '/home',
          name: 'home',
          component: Home
        }
      ]
    },
    {
      path: '/game',
      name: 'game',
      component: Layout,
      children: [
        {
          path: '/game/2048',
          name: 'game-2048',
          component: Game2048
        }
      ]
    }
  ]
})

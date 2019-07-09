import Vue from 'vue'
import Router from 'vue-router'
import Layout from './layouts/Layout.vue'
import Game from './layouts/Game.vue'
import Home from './views/Home.vue'
import Rank from './views/Rank.vue'
import About from './views/About.vue'
import Game2048 from './components/Game2048.vue'
import GameSnake from './components/GameSnake.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: '/home',
      component: Layout,
      children: [
        {
          path: '/home',
          name: 'home',
          component: Home
        },
        {
          path: '/game',
          name: 'game',
          component: Game,
          children: [
            {
              path: '/game/2048',
              name: 'game-2048',
              component: Game2048
            },
            {
              path: '/game/snake',
              name: 'game-snake',
              component: GameSnake
            }
          ]
        },
        {
          path: '/rank',
          name: 'rank',
          component: Rank
        },
        {
          path: '/about',
          name: 'about',
          component: About
        }
      ]
    }
  ]
})

<template>
  <header>
    <div class="title">
      <h1>AirControl Games Collection</h1>
      <nav class="user">
        <ul>
          <li><router-link to="/">登录</router-link></li>
          <li><router-link to="/">注册</router-link></li>
        </ul>
      </nav>
    </div>
    <el-menu
      mode="horizontal"
      :default-active="currentRoute"
      @select="handleSelect"
    >
      <el-menu-item index="home">首页</el-menu-item>
      <el-submenu index="game">
        <template slot="title">
          游戏
        </template>
        <el-menu-item index="game-2048">2048</el-menu-item>
        <el-menu-item index="game-snake">贪吃蛇</el-menu-item>
      </el-submenu>
      <el-menu-item index="rank">排行榜</el-menu-item>
    </el-menu>
  </header>
</template>

<script>
export default {
  name: 'Header',
  computed: {
    currentRoute () {
      return this.$router.currentRoute.name
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      this.$router.push({ name: key })
    }
  }
}
</script>

<style lang="scss">
header {
  .title {
    width: 100%;
    height: 70px;
    display: block;

    h1 {
      float: left;
      font-size: 20px;
      font-weight: bold;
    }

    nav.user {
      margin-top: 5px;
      float: right;

      ul {
        li {
          list-style: none;
          display: inline;

          a {
            font-size: 13px;
            text-decoration: none;
            display: inline-block;
            margin: 0 10px;
            color: #434343;
          }

          a:hover {
            color: #080808;
          }
        }
      }
    }
  }
}
</style>

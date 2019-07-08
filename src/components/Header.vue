<template>
  <header>
    <div class="title">
      <h1>AirControl Games Collection</h1>
      <nav class="user">
        <ul v-if="!authed">
          <li>
            <a href="javascript:void(0);" @click="showLogin">登录</a>
          </li>
        </ul>
        <ul v-if="authed">
          <li>
            <a href="javascript:void(0);">{{ nickname }}</a>
          </li>
          <li>
            <a href="javascript:void(0);" @click="logout">退出</a>
          </li>
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
      <el-menu-item index="about">关于</el-menu-item>
    </el-menu>
    <el-dialog title="登录" :visible.sync="showLoginForm" width="40%" center>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
        <el-form-item label="Email" prop="email" label-width="60px">
          <el-input
            v-model="loginForm.email"
            type="email"
            placeholder="请输入 Email"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" label-width="60px">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showLoginForm = false">关 闭</el-button>
        <el-button type="primary" @click="login">登 录</el-button>
      </span>
    </el-dialog>
  </header>
</template>

<script>
export default {
  name: 'Header',
  data () {
    return {
      showLoginForm: false,
      loginForm: {
        email: '',
        password: ''
      },
      loginRules: {
        email: [
          { required: true, message: '请输入 Email', trigger: 'blur' },
          { type: 'email', message: '请输入正确的 Email', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    currentRoute () {
      return this.$router.currentRoute.name
    },
    authed () {
      return this.$store.state.user.id !== 0
    },
    nickname () {
      return this.$store.state.user.name
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      this.$router.push({ name: key })
    },
    showLogin () {
      this.showLoginForm = true
    },
    login () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          let token = 'test'
          this.$store.commit('login', token)
          this.showLoginForm = false
          console.log(this.loginForm)
        } else {
          this.$notify.error({
            title: '提示信息',
            message: 'Email 或密码格式错误'
          })
        }
      })
    },
    logout () {
      this.$store.commit('logout')
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

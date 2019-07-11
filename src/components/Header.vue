<template>
  <header>
    <div class="title">
      <h1>AirControl Games Collection</h1>
      <nav class="user">
        <ul v-if="!authed">
          <li>
            <a href="javascript:void(0);" @click="showLoginForm = true">登录</a>
            <a href="javascript:void(0);" @click="showRegisterForm = true"
              >注册</a
            >
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
        <el-menu-item index="game-tetris">俄罗斯方块</el-menu-item>
      </el-submenu>
      <el-menu-item index="rank">排行榜</el-menu-item>
      <el-menu-item index="setting">设置</el-menu-item>
      <el-menu-item index="about">关于</el-menu-item>
    </el-menu>

    <el-dialog title="登 录" :visible.sync="showLoginForm" width="40%" center>
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

    <el-dialog
      title="注 册"
      :visible.sync="showRegisterForm"
      width="40%"
      center
    >
      <el-form ref="registerForm" :model="registerForm" :rules="registerRules">
        <el-form-item label="昵称" prop="name" label-width="60px">
          <el-input
            v-model="registerForm.name"
            type="text"
            placeholder="请输入昵称"
          ></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email" label-width="60px">
          <el-input
            v-model="registerForm.email"
            type="email"
            placeholder="请输入 Email"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" label-width="60px">
          <el-input
            v-model="registerForm.password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showRegisterForm = false">关 闭</el-button>
        <el-button type="primary" @click="register">注 册</el-button>
      </span>
    </el-dialog>
  </header>
</template>

<script>
import { userLogin, userCreate } from '@/requests/user'

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
      },
      showRegisterForm: false,
      registerForm: {
        name: '',
        email: '',
        password: ''
      },
      registerRules: {
        name: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ],
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
    login () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          userLogin(this.loginForm.email, this.loginForm.password).then(res => {
            if (res.status === 200) {
              let token = res.data.token
              this.$store.commit('login', token)
              this.showLoginForm = false
              this.loginForm = {
                email: '',
                password: ''
              }
            } else {
              console.log(res.data)
              this.$notify.error({
                title: '提示信息',
                message: 'Email 或密码错误'
              })
            }
          }).catch(err => {
            console.log(err)
            this.$notify.error({
              title: '提示信息',
              message: 'Email 或密码错误'
            })
          })
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
    },
    register () {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          userCreate(this.registerForm.name, this.registerForm.email, this.registerForm.password).then(res => {
            if (res.status === 201) {
              this.$notify({
                title: '提示信息',
                message: '注册成功，请登录',
                type: 'success'
              })
              this.showRegisterForm = false
              this.showLoginForm = true
              this.registerForm = {
                name: '',
                email: '',
                password: ''
              }
            } else {
              console.log(res.data)
              this.$notify.error({
                title: '提示信息',
                message: '注册失败'
              })
            }
          }).catch(err => {
            console.log(err)
            this.$notify.error({
              title: '提示信息',
              message: '注册失败'
            })
          })
        } else {
          this.$notify.error({
            title: '提示信息',
            message: '昵称、Email 或密码格式错误'
          })
        }
      })
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

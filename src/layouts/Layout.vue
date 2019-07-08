<template>
  <el-row type="flex" justify="center">
    <el-col :span="18">
      <el-container>
        <el-header>
          <Header />
        </el-header>
        <el-main>
          <router-view />
        </el-main>
        <el-footer>
          <Footer />
        </el-footer>
      </el-container>
    </el-col>
  </el-row>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'Layout',
  components: {
    Header,
    Footer
  },
  methods: {
    checkLogin () {
      let now = new Date()
      let expiredAt = this.$store.state.user.expired_at

      if (expiredAt.getTime() - now.getTime() < 0) {
        this.$store.commit('logout')
      }
    }
  },
  mounted () {
    this.checkLogin()
  }
}
</script>

<style lang="scss">
</style>

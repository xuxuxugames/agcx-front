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
  }
}
</script>

<style lang="scss">
#app {
  .el-header {
    margin-bottom: 70px;
  }
}
</style>

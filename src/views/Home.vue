<template>
  <section id="home">
    <h3>Welcome to AirControl Games Collection!</h3>
    <p v-if="!dialogVisible && !tipsVisible">
      不知道从哪里开始？点
      <el-button type="primary" size="mini" @click="showDialog">这里</el-button>
      试试看~
    </p>
    <div v-if="tipsVisible">
      <p>为了让系统记住你，我们建议你注册并登录账号~</p>
      <p>祝你玩得开心~</p>
    </div>

    <el-dialog title="可能还是需要读一读系列" :visible.sync="dialogVisible">
      <span><img src="/image/help-1.png"/></span>
      <span><img src="/image/help-2.png"/></span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
          >了 解</el-button
        >
      </span>
    </el-dialog>
  </section>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      dialogVisible: false,
      tipsVisible: false
    }
  },
  methods: {
    showDialog () {
      this.dialogVisible = true
      this.tipsVisible = true
    }
  }
}
</script>

<style lang="scss">
#home {
  width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  text-align: center;

  p {
    font-size: 13px;
    line-height: 24px;
  }

  .el-dialog {
    span {
      img {
        max-width: 100%;
      }
    }
  }
}
</style>

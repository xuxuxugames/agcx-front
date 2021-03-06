<template>
  <section id="game">
    <div class="setting">
      <el-button
        icon="el-icon-setting"
        @click="settingFormVisible = true"
        circle
      ></el-button>
    </div>
    <router-view
      ref="game"
      :onScore="updateScore"
      :onReset="restartGame"
      :onFinish="finishGame"
      :onMove="onMove"
    />
    <div class="controller">
      <div class="score">{{ score }}</div>
      <div class="image">
        <TensorController
          v-if="switchs.air"
          :onMove="tensorMove"
          :playing="!finished && switchs.air"
        ></TensorController>
      </div>
      <div class="tf-ctrl">
        <div class="arrow up" @click="handleArrowTouch(1)">
          <i class="el-icon-arrow-up"></i>
        </div>
        <div class="arrow left" @click="handleArrowTouch(0)">
          <i class="el-icon-arrow-left"></i>
        </div>
        <div class="arrow center"></div>
        <div class="arrow right" @click="handleArrowTouch(2)">
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="arrow down" @click="handleArrowTouch(3)">
          <i class="el-icon-arrow-down"></i>
        </div>
      </div>
    </div>

    <el-dialog
      title="设 置"
      :visible.sync="settingFormVisible"
      width="250px"
      center
    >
      <el-form>
        <el-form-item label="方向键控制" prop="keyboard" label-width="100px">
          <el-switch v-model="switchs.keyboard"></el-switch>
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item label="鼠标控制" prop="touch" label-width="100px">
          <el-switch v-model="switchs.touch"></el-switch>
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item label="隔空控制" prop="air" label-width="100px">
          <el-switch v-model="switchs.air"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="settingFormVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { commitScore } from '@/requests/score'
import TensorController from '@/components/TensorController.vue'

export default {
  name: 'Game',
  components: {
    TensorController
  },
  data () {
    return {
      settingFormVisible: false,
      switchs: {
        keyboard: true,
        touch: true,
        air: false
      },
      score: 0,
      finished: false
    }
  },
  mounted () {
    window.addEventListener('keydown', this.handleKeyDown.bind(this))

    if (this.$store.state.user.token === undefined || this.$store.state.user.token === '') {
      this.$notify.info({
        title: '提示信息',
        message: '您还没有登录，成绩将不会计入排行榜'
      })
    }
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this))
  },
  methods: {
    handleKeyDown (event) {
      if (this.finished) {
        return
      }
      if (!this.switchs.keyboard) {
        return
      }
      if (event.keyCode >= 37 && event.keyCode <= 40) {
        event.preventDefault()
        var direction = event.keyCode - 37
        this.move(direction)
      }
    },
    handleArrowTouch (direction) {
      if (this.finished) {
        return
      }
      if (!this.switchs.touch) {
        return
      }
      this.move(direction)
    },
    handleAirControl (direction) {
      if (this.finished) {
        return
      }
      if (!this.switchs.air) {
        return
      }
      this.move(direction)
    },
    restartGame () {
      this.score = 0
      this.finished = false
    },
    updateScore (score) {
      this.score = score
    },
    finishGame (status) {
      this.finished = true
      console.log('game finished: ' + status)
      let gameName = this.$router.currentRoute.name.split('-')[1]
      if (this.$store.state.user.id !== 0) {
        commitScore(this.$store.state.user.id, gameName, this.score).then(res => {
          if (res.status === 201) {
            this.$notify({
              title: '提示信息',
              message: '成绩已提交',
              type: 'success'
            })
          } else {
            this.$notify.error({
              title: '提示信息',
              message: '提交成绩失败'
            })
          }
        }).catch(err => {
          console.log(err)
          this.$notify.error({
            title: '提示信息',
            message: '提交成绩失败'
          })
        })
      }
    },
    onMove (direction) {
      let divs = ['left', 'up', 'right', 'down']
      let div = document.querySelector('.arrow.' + divs[direction])
      div.classList.add('active')
      setTimeout(() => {
        div.classList.remove('active')
      }, 100)
    },
    move (direction) {
      this.$refs.game.move(direction)
    },
    tensorMove (direction) {
      if (!this.switchs.air) {
        return
      }
      if (direction === -1) {
        this.switchs.air = false
        this.$notify.error({
          title: '提示信息',
          message: '使用隔空操控前请先进行设置'
        })
        return
      }
      this.move(direction)
    }
  }
}
</script>

<style lang="scss" scope>
#game {
  display: flex;
  flex-wrap: wrap;
  width: 720px;
  margin: 20px auto;

  .setting {
    z-index: 1;
    display: block;
    float: left;
    width: 0;
    height: 0;
    position: relative;
    top: -20px;
    left: -20px;
    opacity: 0.5;
    transition: 200ms;
  }

  .setting:hover {
    opacity: 1;
  }

  .controller {
    margin-left: 20px;
    width: 250px;

    .tf-ctrl {
      margin-top: 30px;
      margin-left: 50px;
      height: 200px;

      .arrow {
        margin: 0;
        width: 50px;
        height: 45px;
        border: 1px solid #bdc0ba;
        border-radius: 5px;
        transition: 100ms;
        position: relative;
        font-size: 30px;
        text-align: center;
        padding-top: 5px;
      }

      .arrow.active {
        box-shadow: 0 0 10px #787d7b;
      }

      .arrow.center {
        border: 0;
      }

      .arrow.center:hover {
        box-shadow: none;
      }

      .arrow.up {
        left: 55px;
      }

      .arrow.left {
        top: 5px;
        left: 0;
      }

      .arrow.center {
        top: -45px;
        left: 55px;
      }

      .arrow.right {
        top: -98px;
        left: 110px;
      }

      .arrow.down {
        top: -92px;
        left: 55px;
      }
    }

    .score::before {
      z-index: 1;
      display: block;
      content: "SCORE";
      position: relative;
      background-color: #fff;
      color: #787d7b;
      top: -8px;
      left: 5px;
      font-size: 10px;
      height: 10px;
      width: 48px;
      margin-bottom: 2px;
    }

    .score {
      z-index: 0;
      margin-top: 20px;
      margin-left: 50px;
      width: 160px;
      height: 50px;
      border: 1px solid #bdc0ba;
      border-radius: 5px;
      font-size: 20px;
      text-align: center;
    }

    .image {
      z-index: 0;
      width: 120px;
      height: 120px;
      border: 1px solid #bdc0ba;
      border-radius: 5px;
      margin-left: 70px;
      margin-top: 30px;
      overflow: hidden;

      video {
        margin-top: -15px;
      }
    }

    .image::before {
      content: "Air Controller OFF";
      position: relative;
      z-index: -1;
      color: #787d7b;
      display: block;
      text-align: center;
      font-size: 15px;
      height: 15px;
      top: 50px;
    }
  }
}
</style>

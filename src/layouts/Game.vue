<template>
  <el-row type="flex" justify="center">
    <el-col :span="18">
      <el-container>
        <el-header>
          <Header />
        </el-header>
        <el-main>
          <section id="game">
            <router-view
              ref="game"
              :onScore="updateScore"
              :onFinish="finishGame"
              :onMove="onMove"
            />
            <div class="controller">
              <div class="score">{{ score }}</div>
              <div class="tf-ctrl">
                <div class="arrow up" @click="move(1)">
                  <i class="el-icon-arrow-up"></i>
                </div>
                <div class="arrow left" @click="move(0)">
                  <i class="el-icon-arrow-left"></i>
                </div>
                <div class="arrow center"></div>
                <div class="arrow right" @click="move(2)">
                  <i class="el-icon-arrow-right"></i>
                </div>
                <div class="arrow down" @click="move(3)">
                  <i class="el-icon-arrow-down"></i>
                </div>
              </div>
            </div>
          </section>
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
  name: 'Game',
  components: {
    Header,
    Footer
  },
  data () {
    return {
      score: 0
    }
  },
  methods: {
    updateScore (score) {
      this.score = score
    },
    finishGame (status) {
      console.log(this.score, status)
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
    }
  }
}
</script>

<style lang="scss" scope>
#game {
  display: flex;
  flex-wrap: wrap;

  .controller {
    margin-top: 50px;
    margin-left: 20px;
    width: 250px;

    .tf-ctrl {
      margin-top: 70px;
      margin-left: 50px;

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

    .score {
      margin-left: 50px;
      width: 160px;
      height: 40px;
      border: 1px solid #bdc0ba;
      border-radius: 5px;
      font-size: 20px;
      text-align: center;
      padding-top: 10px;
    }
  }
}
</style>
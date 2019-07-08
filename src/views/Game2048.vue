<template>
  <section id="game">
    <TwentyFourtyEight
      ref="tfe"
      :onScore="updateScore"
      :onFinish="finishGame"
    />
    <div class="controller">
      <div class="score">{{ score }}</div>
      <div class="tf-ctrl">
        <div class="arrow up"><i class="el-icon-arrow-up"></i></div>
        <div class="arrow left"><i class="el-icon-arrow-left"></i></div>
        <div class="arrow center"></div>
        <div class="arrow right"><i class="el-icon-arrow-right"></i></div>
        <div class="arrow down"><i class="el-icon-arrow-down"></i></div>
      </div>
    </div>
  </section>
</template>

<script>
import TwentyFourtyEight from '@/games/twenty-fourty-eight'

export default {
  name: 'Game2048',
  components: {
    TwentyFourtyEight
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

      .arrow:hover {
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

<template>
  <section id="snake">
    <div class="game-panel">
      <div
        v-for="col in 2025"
        :key="col"
        class="col-item"
        :class="{
          snake: isSnake(col),
          food: food == col,
          'snake-head': isHead(col)
        }"
      ></div>
    </div>
    <div class="game-over" v-if="gameOver">
      <span class="game-over-text">GAME OVER</span>
      <br />
      <span class="restart" @click="restart">Click here to restart !</span>
    </div>
    <div class="game-over" v-if="success">
      <span class="game-over-text">WIN</span>
      <br />
      <span class="restart" @click="restart">Click here to restart !</span>
    </div>
  </section>
</template>

<script>
import _ from 'underscore'
export default {
  name: 'Snake',
  props: {
    onScore: Function,
    onReset: Function,
    onFinish: Function,
    onMove: Function
  },
  data () {
    return {
      score: 0,
      snakeBody: [1],
      food: 0,
      direction: 'RIGHT',
      gameOver: false,
      success: false,
      speed: 300
    }
  },
  watch: {
    'snakeBody': 'checkRule'
  },
  created () {
    this.init()
  },
  methods: {
    checkRule () {
      let uniqBady = _.uniq(this.snakeBody)
      if (uniqBady.length !== this.snakeBody.length) {
        this.stop()
      } else if (this.snakeBody.length === 2025) {
        clearInterval(this.intId)
        this.success = true
        this.onFinish('win')
      } else {
        switch (uniqBady.length) {
          case 3:
            this.changeSpeed(200)
            break
          case 6:
            this.changeSpeed(150)
            break
          case 10:
            this.changeSpeed(100)
            break
          case 20:
            this.changeSpeed(50)
            break
          default:
            break
        }
      }
    },
    changeSpeed (speed) {
      // clearInterval(this.intId)
      this.speed = speed
      this.doMove()
    },
    restart () {
      this.snakeBody = [1]
      this.direction = 'RIGHT'
      this.gameOver = false
      this.success = false
      this.speed = 300
      this.init()
      this.onReset()
    },
    stop () {
      clearInterval(this.intId)
      this.gameOver = true
      this.onFinish('lost')
    },
    isSnake (col) {
      return _.indexOf(this.snakeBody, col) > -1
    },
    isHead (col) {
      return _.last(this.snakeBody) === col
    },
    changeDirection (direction) {
      this.direction = direction
    },
    // 控制蛇的移动
    doMove () {
      clearInterval(this.intId)
      this.intId = setInterval(() => {
        const last = _.last(this.snakeBody)
        let newBody = []
        if (last === this.food) {
          newBody = this.snakeBody
          this.food = _.random(1, 2025)
          this.score += this.snakeBody.length
          this.onScore(this.score)
        } else {
          newBody = _.rest(this.snakeBody)
        }
        if (last > 2025) {
          // 向下运动穿墙
          newBody.push(last - 2025)
        } else if (last < 1) {
          // 向上运动穿墙
          newBody.push(2025 + last)
        } else if (last % 45 === 1 && this.direction === 'LEFT') {
          newBody.push(last + 44)
        } else if (last % 45 === 0 && this.direction === 'RIGHT') {
          newBody.push(last - 44)
        } else {
          // 控制蛇的基本移动
          switch (this.direction) {
            case 'LEFT':
              newBody.push(last - 1)
              break
            case 'TOP':
              newBody.push(last - 45)
              break
            case 'RIGHT':
              newBody.push(last + 1)
              break
            case 'DOWN':
              newBody.push(last + 45)
              break
            default:
              newBody.push(last + 1)
              break
          }
        }
        this.snakeBody = newBody
      }, this.speed)
    },
    move (direction) {
      if (direction === 0 && this.direction !== 'LEFT' && this.direction !== 'RIGHT') {
        this.direction = 'LEFT'
      } else if (direction === 1 && this.direction !== 'TOP' && this.direction !== 'DOWN') {
        this.direction = 'TOP'
      } else if (direction === 2 && this.direction !== 'LEFT' && this.direction !== 'RIGHT') {
        this.direction = 'RIGHT'
      } else if (direction === 3 && this.direction !== 'TOP' && this.direction !== 'DOWN') {
        this.direction = 'DOWN'
      } else {
        return
      }
      this.onMove(direction)
    },
    init () {
      this.score = 0
      this.food = _.random(1, 2025)
      this.doMove()
    }
  }
}
</script>

<style lang="scss" scoped>
#snake {
  width: 450px;
  background-color: #000;
}
</style>

<style scoped>
.game-panel {
  position: relative;
  width: 450px;
  height: 450px;
  overflow: hidden;
  line-height: 0;
  margin: auto;
}

.col-item {
  background: black;
  width: 10px;
  height: 10px;
  display: inline-block;
}

.snake {
  background: white;
}

.snake-head {
  background: white;
}

.food {
  background: white;
}

.game-over {
  position: fixed;
  top: 190px;
  bottom: 0;
  left: 0;
  right: 0;
  margin-top: 170px;
  margin-right: 250px;
  text-align: center;
  color: white;
}

.game-over-text {
  font-size: 60px;
}

.restart {
  /*margin-top: 30px;*/
  font-size: 30px;
  color: white;
}
</style>

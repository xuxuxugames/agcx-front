<template>
  <div class="player">
    <div class="panel">
      <h2 class="nextText">Next</h2>
      <div class="nextBox">
        <block v-if="nextBlock" :init="nextBlock" :stage="stage" class="next" :style="nextBlockStyle" :key="nextBlock.id"/>
      </div>
      <div class="buttons">
        <button v-if="state.playing" @click="pause">{{state.pause?'Resume':'Pause'}}</button>
        <button v-else @click="start" autofocus>{{state.gameover?'Restart':'Start'}}</button>
      </div>
      <h2 class="state">{{stateText}}</h2>
    </div>
    <div :style="{height:height*cellSize+'px',width:width*cellSize+'px'}" class="game">
      <ground :stage="stage" ref="ground" class="ground" @clearRow="clearRow" @clearAll="clearAll"/>
      <block v-if="curBlock" :init="curBlock" :stage="stage" ref="shadow" :shadow="true"/>
      <block v-if="curBlock" :init="curBlock" :stage="stage" ref="block" :key="curBlock.id"/>
    </div>
  </div>
</template>

<script>
import block from './block.vue'
import ground from './ground.vue'
import stageComputed from './stageComputed'
import soundService from './soundService/soundService.mjs'
import _ from 'lodash'

let blockId = 0
export default {
  name: 'player',
  props: ['stage', 'keys'],
  mixins: [stageComputed, soundService],
  data () {
    return {
      curBlock: null,
      nextBlock: null,
      actionOf: {},
      tickInterval: 0,
      rowCleared: null,
      // 当前等级
      level: null,
      // 当前获取的分数
      score: null,
      // 当前状态 格式：｛gameover: bool, playing: bool, pause: bool｝
      state: null,
      statistics: null
    }
  },
  computed: {
    tickTime () { return Math.max(11 - this.level, 1) * 50 },
    nextBlockStyle () {
      return { left: `calc(50% - ${this.cellSize}px)`, top: `calc(50% + ${this.cellSize}px)` }
    },
    canPlay () {
      let { gameover, pause, playing } = this.state
      return !gameover && !pause && playing
    },
    stateText () {
      let { gameover, pause } = this.state
      if (gameover) return 'Game Over!'
      if (pause) return 'Pause'
      return ''
    }
  },
  created () {
    _.forEach(this.keys, (v, k) => this.$set(this.actionOf, v, k))
    window.addEventListener('keydown', this.keydown)
    this.reset()
  },
  methods: {
    reset () {
      Object.assign(this, {
        rowCleared: 0,
        level: 0,
        score: 0,
        state: { playing: false, gameover: false, pause: false },
        statistics: _(this.stage.blocks).map(x => [x, 0]).fromPairs().assign({ TOTAL: 0 }).value()
      })
    },
    playBgm (type = `bgm${this.level % 4 + 1}`, isRepeat = true) {
      this.playSound(type, isRepeat)
    },
    playFX (name) { this.playEffect(name) },
    start () {
      if (this.state.playing) return
      this.reset()
      this.$refs.ground.reset()
      this.createNextBlock()
      this.next()
      this.state.playing = true
      this.playBgm()
    },
    tick () {
      if (!this.canPlay) return
      this.move(0, -1)
    },
    setTick () { this.tickInterval = setInterval(this.tick, this.tickTime) },
    clearTick () { this.tickInterval = clearInterval(this.tickInterval) },
    resetTick () {
      this.clearTick()
      this.setTick()
    },
    clearRow (n) {
      this.rowCleared += n
      this.getScore([0, 40, 100, 300, 1200][n] * (this.level + 1))
      this.level = Math.floor(this.rowCleared / 10)
      this.playFX('lineClear')
    },
    clearAll () { this.getScore(3000 * (this.level + 1)) },
    keydown ($event) {
      if ($event.keyCode === 32) $event.preventDefault()
      if (!this.state.playing) return
      if ($event.keyCode === 27) return this.pause()
      if (!this.canPlay) return
      switch (this.actionOf[$event.keyCode]) {
        case 'straight':
          this.moveStraight()
          $event.preventDefault()
          break
        case 'left':
          this.move(-1, 0)
          $event.preventDefault()
          break
        case 'rotate' :
          this.rotate()
          $event.preventDefault()
          break
        case 'right':
          this.move(1, 0)
          $event.preventDefault()
          break
        case 'down':
          this.move(0, -1)
          this.resetTick()
          $event.preventDefault()
          break
      }
    },
    pause () {
      if (this.state.pause) {
        this.state.pause = false
        this.resumeSound()
        this.setTick()
      } else {
        this.state.pause = true
        this.pauseSound()
        this.clearTick()
      }
      this.$emit('pause', this.state.pause)
    },
    pushBlock () {
      let { block, ground } = this.$refs
      this.getScore(3 * (this.level + 1))
      let allPushed = ground.push(block.cells)
      this.curBlock = null
      allPushed ? this.next() : this.gameover()
      this.playFX('drop')
    },
    move (x, y) {
      let { block, ground } = this.$refs
      let touched = ground.checkTouched(block.predictMove(x, y))
      if (!touched) {
        block.move(x, y)
        this.updateShadow()
      } else if (y < 0) this.pushBlock() // go down and touched
      return touched
    },
    moveStraight () {
      while (!this.move(0, -1)) {}
      this.getScore(21 + (3 * this.level))
    },
    getScore (v) {
      if (!this.canPlay) return
      this.score += v
    },
    updateShadow () {
      let { shadow, block, ground } = this.$refs
      let { idx, x, y } = block
      Object.assign(shadow, { idx, x, y })
      while (!ground.checkTouched(shadow.predictMove(0, -1))) shadow.move(0, -1)
    },
    rotate () {
      let { block, ground } = this.$refs
      let rotate = block.predictRotate()
      let touched = ground.checkTouched(rotate)
      if (!touched) {
        block.rotate(0)
        this.updateShadow()
        return
      }
      let x = rotate.map(([x]) => x)
      _(1).range(_.max(x) - _.min(x) + 1)
        .flatMap(x => [-x, x])
        .forEach(x => {
          if (ground.checkTouched(block.predictRotate(x))) return
          block.rotate(x)
          this.updateShadow()
          return false
        })
    },
    createNextBlock () {
      let type = _.sample(this.blocks)
      this.statistics[type]++
      this.statistics.TOTAL++
      let shapes = this.blockType[type]
      this.nextBlock = { shapes, pos: [0, 0], class: type, id: blockId++ }
    },
    gameover () {
      if (this.state.gameover) return
      Object.assign(this.state, { gameover: true, playing: false })
      this.clearTick()
      this.$emit('gameover', this)
      this.playBgm('gameover', false)
    },
    next () {
      this.curBlock = Object.assign({}, this.nextBlock)
      this.curBlock.pos = [Math.floor(this.width / 2) - 1, this.height]
      this.$nextTick(() => {
        this.resetTick()
        if (this.move(0, -1)) return
        let { block, ground } = this.$refs
        ground.checkTouched(block.predictMove(0, -1)) || block.move(0, -1)
        this.createNextBlock()
      })
    }
  },
  watch: {
    level (v) { v && this.playBgm() }
  },
  destroyed () { window.removeEventListener('keyodwn', this.keydown) },
  components: { ground, block }
}
</script>

<style scoped>
  .player {
    white-space: nowrap;
    display: inline-block;
    background: white;
    padding: 0;
    color: #222;
    width: 450px;
  }
  .player > * {
    display: inline-block;
    vertical-align: top;
  }
  .game {position: relative;
    outline: solid 1px gray;
    background-color: black;
    overflow: hidden;
  }
  .buttons {
    margin-top: 100px;
    text-align: center;
  }
  .buttons button {
    width: 80px;
    height: 45px;
    border: 1px solid #bdc0ba;
    border-radius: 5px;
    transition: 100ms;
    position: relative;
    font-size: 14px;
    text-align: center;
    background-color: white;
  }
  .panel {
    padding: 0px 10px;
  }
  .nextText {
    height: 20px;
    text-align: center;
    margin-right: 10px;
    font-size: 14px;
    color: #909399;
    margin-top: 70px
  }
  .nextBox {
    width: 125px;
    height: 125px;
    position: relative;
    background-color: #222;
    border-radius: 5px
  }
  .nextBox .next {
    position: absolute;
  }
  .state {
    text-align: center;
    font-size: 20px;
  }
</style>

<template>
  <Tetris
    ref="tetris"
    :onScore="onScore"
    :onReset="onReset"
    :onFinish="onFinish"
    :onMove="onMove"
  />
</template>

<script>
import Tetris from '@/games/tetris'

export default {
  name: 'GameTetris',
  components: {
    Tetris
  },
  mounted () {
    this.onScore(0)
  },
  props: {
    onScore: Function,
    onReset: Function,
    onFinish: Function,
    onMove: Function
  },
  methods: {
    move (direction) {
      this.$refs.tetris.move(direction)
    }
  }
}
</script>

<style lang="scss" scope>
</style>

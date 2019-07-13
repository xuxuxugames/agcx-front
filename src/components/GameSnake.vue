<template>
  <Snake
    ref="snake"
    :onScore="onScore"
    :onReset="onReset"
    :onFinish="onFinish"
    :onMove="onMove"
  />
</template>

<script>
import Snake from '@/games/snake'

export default {
  name: 'GameSnake',
  components: {
    Snake
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
      this.$refs.snake.move(direction)
    }
  }
}
</script>

<style lang="scss" scope>
</style>

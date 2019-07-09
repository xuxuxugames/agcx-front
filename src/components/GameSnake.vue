<template>
  <Snake ref="snake" :onScore="onScore" :onFinish="onFinish" :onMove="onMove" />
</template>

<script>
import Snake from '@/games/snake'

export default {
  name: 'GameSnake',
  components: {
    Snake
  },
  props: {
    onScore: Function,
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

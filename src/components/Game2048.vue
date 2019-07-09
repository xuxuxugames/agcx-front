<template>
  <TwentyFourtyEight
    ref="tfe"
    :onScore="onScore"
    :onReset="onReset"
    :onFinish="onFinish"
    :onMove="onMove"
  />
</template>

<script>
import TwentyFourtyEight from '@/games/twenty-fourty-eight'

export default {
  name: 'Game2048',
  components: {
    TwentyFourtyEight
  },
  props: {
    onScore: Function,
    onReset: Function,
    onFinish: Function,
    onMove: Function
  },
  methods: {
    move (direction) {
      this.$refs.tfe.move(direction)
    }
  }
}
</script>

<style lang="scss" scope>
</style>

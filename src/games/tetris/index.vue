<template>
  <section id="tetris"></section>
</template>

<script>
export default {
  name: 'Tetris',
  props: {
    onScore: Function,
    onReset: Function,
    onFinish: Function,
    onMove: Function
  },
  methods: {
    move (direction) {
    }
  }
}
</script>

<style lang="scss" scoped>
#tetris {
  width: 450px;
  background-color: #000;
}
</style>

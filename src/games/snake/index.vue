<template>
  <section id="snake"></section>
</template>

<script>
export default {
  name: 'Snake',
  props: {
    onScore: Function,
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
#snake {
  width: 450px;
  background-color: #000;
}
</style>

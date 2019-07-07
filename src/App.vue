<template>
  <div id="app">
    <TwentyFourtyEight ref="tfe" />
  </div>
</template>

<script>
import TwentyFourtyEight from './games/twenty-fourty-eight'

export default {
  name: 'app',
  components: {
    TwentyFourtyEight
  },
  mounted () {
    // this.$refs.tfe.move(0)
    // this.$refs.tfe.move(1)
  }
}
</script>

<style>
</style>

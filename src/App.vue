<template>
  <div id="app">
    <TwentyFourtyEight
      ref="tfe"
      :onScore="updateScore"
      :onFinish="finishGame"
    />
    <p>{{ score }}</p>
  </div>
</template>

<script>
import TwentyFourtyEight from './games/twenty-fourty-eight'

export default {
  name: 'app',
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

<style>
</style>

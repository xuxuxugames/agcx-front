<template>
  <section>
    <TwentyFourtyEight
      ref="tfe"
      :onScore="updateScore"
      :onFinish="finishGame"
    />
    <p>{{ score }}</p>
  </section>
</template>

<script>
import TwentyFourtyEight from '@/games/twenty-fourty-eight'

export default {
  name: 'Game2048',
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

<style lang="scss">
</style>

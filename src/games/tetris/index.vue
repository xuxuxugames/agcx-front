<template>
  <section id="tetris">
    <div class="tetris">
      <player
        :onScore="onScore"
        :onReset="onReset"
        :onFinish="onFinish"
        :onMove="onMove"
        :stage="stage"
        :keys="{ straight: 32, left: 37, rotate: 38, right: 39, down: 40 }"
        ref="player"
      />
    </div>
  </section>
</template>

<script>
import player from './player.vue'
import stageComputed from './stageComputed'
export default {
  name: 'Tetris',
  mixins: [stageComputed],
  props: {
    onScore: Function,
    onReset: Function,
    onFinish: Function,
    onMove: Function
  },
  data () {
    return {
      stage: {
        cellSize: 30,
        width: 10,
        height: 22,
        blockType: {
          I: [
            [[-1, 1], [0, 1], [1, 1], [2, 1]],
            [[1, 2], [1, 1], [1, 0], [1, -1]],
            [[2, 0], [1, 0], [0, 0], [-1, 0]],
            [[0, -1], [0, 0], [0, 1], [0, 2]]
          ],
          O: [
            [[0, 0], [0, 1], [1, 1], [1, 0]],
            [[0, 1], [1, 1], [1, 0], [0, 0]],
            [[1, 1], [1, 0], [0, 0], [0, 1]],
            [[1, 0], [0, 0], [0, 1], [1, 1]]
          ],
          T: [
            [[0, 1], [-1, 0], [0, 0], [1, 0]],
            [[1, 0], [0, 1], [0, 0], [0, -1]],
            [[0, -1], [1, 0], [0, 0], [-1, 0]],
            [[-1, 0], [0, -1], [0, 0], [0, 1]]
          ],
          S: [
            [[0, 1], [1, 1], [-1, 0], [0, 0]],
            [[1, 0], [1, -1], [0, 1], [0, 0]],
            [[0, -1], [-1, -1], [1, 0], [0, 0]],
            [[-1, 0], [-1, 1], [0, -1], [0, 0]]
          ],
          Z: [
            [[-1, 1], [0, 1], [0, 0], [1, 0]],
            [[1, 1], [1, 0], [0, 0], [0, -1]],
            [[1, -1], [0, -1], [0, 0], [-1, 0]],
            [[-1, -1], [-1, 0], [0, 0], [0, 1]]
          ],
          J: [
            [[-1, 1], [-1, 0], [0, 0], [1, 0]],
            [[1, 1], [0, 1], [0, 0], [0, -1]],
            [[1, -1], [1, 0], [0, 0], [-1, 0]],
            [[-1, -1], [0, -1], [0, 0], [0, 1]]
          ],
          L: [
            [[1, 1], [1, 0], [0, 0], [-1, 0]],
            [[1, -1], [0, -1], [0, 0], [0, 1]],
            [[-1, -1], [-1, 0], [0, 0], [1, 0]],
            [[-1, 1], [0, 1], [0, 0], [0, -1]]
          ]
        },
        blocks: ['I', 'O', 'T', 'S', 'Z', 'J', 'L']
      }
    }
  },
  methods: {
    move (direction) {
      this.$refs.player.doMove(direction)
    }
  },
  components: { player }
}
</script>

<style lang="scss" scoped>
#tetris {
  width: 450px;
  background-color: #000;
}
</style>

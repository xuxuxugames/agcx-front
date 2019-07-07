<template>
  <div class="board" tabIndex="1">
    <div v-for="(rowItem, rowIndex) in board.cells" :key="rowIndex">
      <Cell v-for="(colItem, colIndex) in rowItem" :key="colIndex"></Cell>
    </div>
    <TileView v-for="tile in tiles" :tile="tile" :key="tile.id"></TileView>
    <Overlay :board="board" :onrestart="onRestart"></Overlay>
  </div>
</template>

<script>
import Cell from './Cell.vue'
import TileView from './TileView.vue'
import Overlay from './Overlay.vue'
import { Board } from './board'

export default {
  data () {
    return {
      board: new Board()
    }
  },
  mounted () {
    window.addEventListener('keydown', this.handleKeyDown.bind(this))
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this))
  },
  computed: {
    tiles () {
      return this.board.tiles
        .filter(tile => tile.value !== 0)
    },
    score () {
      return this.board.score
    }
  },
  methods: {
    handleKeyDown (event) {
      if (this.board.hasWon()) {
        return
      }
      if (event.keyCode >= 37 && event.keyCode <= 40) {
        event.preventDefault()
        var direction = event.keyCode - 37
        this.board.move(direction)
      }
    },
    onRestart () {
      this.board = new Board()
    },
    move (direction) {
      this.board.move(direction)
    }
  },
  components: {
    Cell,
    TileView,
    Overlay
  }
}
</script>

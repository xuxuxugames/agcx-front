<template>
  <section id="twenty-fourty-eight">
    <div class="board" tabIndex="1">
      <div v-for="(rowItem, rowIndex) in board.cells" :key="rowIndex">
        <Cell v-for="(colItem, colIndex) in rowItem" :key="colIndex"></Cell>
      </div>
      <TileView v-for="tile in tiles" :tile="tile" :key="tile.id"></TileView>
      <Overlay :board="board" :onrestart="restart"></Overlay>
    </div>
  </section>
</template>

<script>
import Cell from './Cell.vue'
import TileView from './TileView.vue'
import Overlay from './Overlay.vue'
import { Board } from './board'

export default {
  name: 'TwentyFourtyEight',
  components: {
    Cell,
    TileView,
    Overlay
  },
  props: {
    onScore: Function,
    onReset: Function,
    onFinish: Function,
    onMove: Function
  },
  computed: {
    tiles () {
      return this.board.tiles
        .filter(tile => tile.value !== 0)
    },
    score () {
      return this.board.score
    },
    status () {
      if (this.board.hasWon()) {
        return 'win'
      }
      if (this.board.hasLost()) {
        return 'lost'
      }
      return 'playing'
    }
  },
  methods: {
    restart () {
      this.board = new Board()
      this.onReset && this.onReset()
    },
    move (direction) {
      this.board.move(direction)
      this.onMove(direction)
      this.onScore(this.score)
      if (this.board.hasWon() || this.board.hasLost()) {
        this.onFinish(this.status)
      }
    }
  },
  data () {
    return {
      board: new Board()
    }
  }
}
</script>

<style lang="scss" scope>
@font-face {
  font-family: "Clear Sans";
  src: url("../../assets/fonts/clear-sans.ttf") format("truetype");
}

#twenty-fourty-eight {
  font-family: "Clear Sans", sans-serif;
  font-size: 21px;
  width: 450px;

  .text {
    order: 2;
    padding-top: 40px;
    width: 440px;
    font-weight: bold;
  }

  .board {
    order: 1;
    width: 440px;
    height: 440px;
    padding: 5px;
    background-color: #baa;
    border-radius: 7px;
    outline: none;
    position: relative;
  }

  .board .cell,
  .tile {
    user-select: none;
    cursor: default;
  }

  .cell,
  .tile {
    width: 100px;
    height: 100px;
    margin: 5px;
    line-height: 90px;
    display: inline-block;
    font-size: 55px;
    font-weight: bold;
    text-align: center;
    vertical-align: middle;
    border-radius: 7px;
    font-family: "Clear Sans";
    color: #766;
    background-color: #dcb;
  }

  .tile0 {
    background-color: #dcb;
  }

  .tile2 {
    background-color: #eee;
  }

  .tile4 {
    background-color: #eec;
  }

  .tile8 {
    color: #ffe;
    background-color: #fb8;
  }

  .tile16 {
    color: #ffe;
    background-color: #f96;
  }

  .tile32 {
    color: #ffe;
    background-color: #f75;
  }

  .tile64 {
    color: #ffe;
    background-color: #f53;
  }

  .tile128 {
    color: #ffe;
    background-color: #ec7;
    font-size: 45px;
  }

  .tile256 {
    color: #ffe;
    background-color: #ec6;
    font-size: 45px;
  }

  .tile512 {
    color: #ffe;
    background-color: #ec5;
    font-size: 45px;
  }

  .tile1024 {
    color: #fff;
    background-color: #ec3;
    font-size: 35px;
  }

  .tile2048 {
    color: #fff;
    background-color: #ec2;
    font-size: 35px;
  }

  .tile {
    position: absolute;
  }

  .tile.merged {
    display: none;
  }

  .tile.merged.isMoving {
    display: inline;
  }

  .tile.new,
  .overlay {
    animation-duration: 0.2s;
    animation-name: newTile;
    animation-fill-mode: forwards;
    animation-delay: 0.15s;
    transform: scale(0);
  }

  @keyframes newTile {
    from {
      transform: scale(0);
    }

    to {
      transform: scale(1);
    }
  }

  .overlay {
    position: absolute;
    top: 0px;
    bottom: 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    left: 0px;
    right: 0px;
    font-size: 55px;
    font-weight: bolder;
    background-color: rgba(221, 221, 221, 0.5);
    border-radius: 7px;
  }

  .tryAgain {
    background-color: #876;
    color: #fff;
    height: 40px;
    width: 200px;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    border: none;
    border-radius: 5px;
  }

  .overlay .message {
    color: #666;
  }

  @for $row from 0 through 3 {
    @for $column from 0 through 3 {
      .position_#{$row}_#{$column}:not(.isMoving) {
        top: 110px * $row + 5px;
        left: 110px * $column + 5px;
      }
    }
  }

  @for $fromRow from 0 through 3 {
    @for $toRow from 0 through 3 {
      $name: row_from_#{$fromRow}_to_#{$toRow};

      @if $fromRow == $toRow {
        .#{$name} {
          top: 110px * $toRow + 5px;
        }
      } @else {
        .#{$name} {
          animation-duration: 0.2s;
          animation-name: $name;
          animation-fill-mode: forwards;
        }

        @keyframes #{$name} {
          from {
            top: 110px * $fromRow + 5px;
          }
          to {
            top: 110px * $toRow + 5px;
          }
        }
      }
    }
  }

  @for $fromColumn from 0 through 3 {
    @for $toColumn from 0 through 3 {
      $name: column_from_#{$fromColumn}_to_#{$toColumn};

      @if $fromColumn == $toColumn {
        .#{$name} {
          left: 110px * $toColumn + 5px;
        }
      } @else {
        .#{$name} {
          animation-duration: 0.2s;
          animation-name: $name;
          animation-fill-mode: forwards;
        }

        @keyframes #{$name} {
          from {
            left: 110px * $fromColumn + 5px;
          }
          to {
            left: 110px * $toColumn + 5px;
          }
        }
      }
    }
  }
}
</style>

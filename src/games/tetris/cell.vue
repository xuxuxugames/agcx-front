<template>
  <div :style="style" :class="display" class="cell"></div>
</template>

<script>
import stageComputed from './stageComputed'

export default {
  name: 'cell',
  props: ['stage', 'data', 'pos'],
  mixins: [stageComputed],
  computed: {
    display () { return this.data.class },
    style () {
      return {
        width: this.cellSize + 'px',
        height: this.cellSize + 'px',
        left: this.pos[0] * this.cellSize + 'px',
        bottom: this.pos[1] * this.cellSize + 'px'
      }
    }
  }
}
</script>

<style scoped>
.cell {
  position: absolute;
  box-sizing: border-box;
  border-style: outset;
  border-width: 3px;
  border-top-color: rgba(255, 255, 255, 0.3);
  border-left-color: rgba(255, 255, 255, 0.3);
}
.cell.I {
  /*cyan*/
  background-color: lightblue;
  border-right-color: lightblue;
  border-bottom-color: lightblue;
}
.cell.O {
  /*yellow*/
  background-color: lightyellow;
  border-right-color: lightyellow;
  border-bottom-color: lightyellow;
}
.cell.T {
  /*magenta*/
  background-color: lightpink;
  border-right-color: lightpink;
  border-bottom-color: lightpink;
}
.cell.S {
  /*lime*/
  background-color: lightgreen;
  border-right-color: lightgreen;
  border-bottom-color: lightgreen;
}
.cell.Z {
  /*red*/
  background-color: lightcoral;
  border-right-color: lightcoral;
  border-bottom-color: lightcoral;
}
.cell.J {
  /*blue*/
  background-color: lightcyan;
  border-right-color: lightcyan;
  border-bottom-color: lightcyan;
}
.cell.L {
  /*orange*/
  background-color: lightsalmon;
  border-right-color: lightsalmon;
  border-bottom-color: lightsalmon;
}
</style>

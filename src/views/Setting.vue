<template>
  <section id="setting">
    <div class="image">
      <p>camera</p>
    </div>
    <div class="control">
      <div class="arrows">
        <div class="arrow up" @click="handleArrow(1)">
          <i v-if="counts.up === 0" class="el-icon-arrow-up"></i>
          <span v-if="counts.up !== 0">{{ counts.up }}</span>
        </div>
        <div class="arrow left" @click="handleArrow(0)">
          <i v-if="counts.left === 0" class="el-icon-arrow-left"></i>
          <span v-if="counts.left !== 0">{{ counts.left }}</span>
        </div>
        <div class="arrow center"></div>
        <div class="arrow right" @click="handleArrow(2)">
          <i v-if="counts.right === 0" class="el-icon-arrow-right"></i>
          <span v-if="counts.right !== 0">{{ counts.right }}</span>
        </div>
        <div class="arrow down" @click="handleArrow(3)">
          <i v-if="counts.down === 0" class="el-icon-arrow-down"></i>
          <span v-if="counts.down !== 0">{{ counts.down }}</span>
        </div>
      </div>
      <div class="train">
        <el-button type="primary">保 存</el-button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Setting',
  data () {
    return {
      counts: {
        left: 0,
        up: 0,
        right: 0,
        down: 0
      }
    }
  },
  methods: {
    handleArrow (direction) {
      let dirs = ['left', 'up', 'right', 'down']
      this.counts[dirs[direction]] += 1
      let div = document.querySelector('.arrow.' + dirs[direction])
      div.classList.add('active')
      setTimeout(() => {
        div.classList.remove('active')
      }, 100)
    }
  }
}
</script>

<style lang="scss">
#setting {
  display: flex;
  flex-wrap: wrap;
  width: 660px;
  margin: 10px auto;

  .image {
    width: 400px;
    height: 400px;
    border: 1px solid #bdc0ba;
    border-radius: 5px;
    overflow: hidden;
  }

  .control {
    width: 250px;
    margin-top: 20px;

    .arrows {
      margin-top: 30px;
      margin-left: 50px;
      height: 200px;

      .arrow {
        user-select: none;
        margin: 0;
        width: 50px;
        height: 40px;
        border: 1px solid #bdc0ba;
        border-radius: 5px;
        transition: 100ms;
        position: relative;
        font-size: 24px;
        text-align: center;
        padding-top: 10px;
      }

      .arrow.active {
        box-shadow: 0 0 10px #787d7b;
      }

      .arrow.center {
        border: 0;
      }

      .arrow.center:hover {
        box-shadow: none;
      }

      .arrow.up {
        left: 55px;
      }

      .arrow.left {
        top: 5px;
        left: 0;
      }

      .arrow.center {
        top: -45px;
        left: 55px;
      }

      .arrow.right {
        top: -98px;
        left: 110px;
      }

      .arrow.down {
        top: -92px;
        left: 55px;
      }
    }

    .train {
      margin-left: 50px;
      margin-top: 30px;

      .el-button {
        width: 160px;
      }
    }
  }
}
</style>

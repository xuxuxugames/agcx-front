<template>
  <section id="setting">
    <div class="image">
      <video
        autoplay
        playsinline
        muted
        id="webcam"
        width="224"
        height="224"
      ></video>
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
        <el-button type="primary" :v-loading="saving" @click="train"
          >保 存</el-button
        >
      </div>
    </div>
  </section>
</template>

<script>
import * as tf from '@tensorflow/tfjs'
import * as tfd from '@tensorflow/tfjs-data'
import { Dataset } from '@/utils/tensorflow/dataset'
import { loadTruncatedMobileNet, trainModel, loadModel } from '@/utils/tensorflow'

export default {
  name: 'Setting',
  data () {
    return {
      counts: {
        left: 0,
        up: 0,
        right: 0,
        down: 0
      },
      loading: true,
      webcam: null,
      dataset: null,
      mobileNet: null,
      saving: false,
      model: null,
      loadedModel: null,
      canPredict: true
    }
  },
  async mounted () {
    await this.init()
  },
  destroyed () {
    if (this.webcam !== null) {
      this.webcam.stop()
    }
  },
  methods: {
    async init () {
      try {
        this.webcam = await tfd.webcam(document.getElementById('webcam'))
      } catch (e) {
        console.log(e)
      }
      this.dataset = new Dataset(4)
      this.mobileNet = await loadTruncatedMobileNet()
      const screenShot = await this.webcam.capture()
      this.mobileNet.predict(screenShot.expandDims(0))
      screenShot.dispose()

      try {
        this.model = await loadModel()
        await this.timer()
      } catch (e) {
        console.log('no model found')
        this.model = null
      }

      this.loading = false
    },
    async getImage () {
      const img = await this.webcam.capture()
      const processedImg = tf.tidy(() => img.expandDims(0).toFloat().div(127).sub(1))
      img.dispose()
      return processedImg
    },
    async addExample (label) {
      let img = await this.getImage()
      this.dataset.addExample(this.mobileNet.predict(img), label)
      img.dispose()
    },
    async handleArrow (direction) {
      if (this.loading) {
        return
      }
      await this.addExample(direction)
      let dirs = ['left', 'up', 'right', 'down']
      this.counts[dirs[direction]] += 1
      let div = document.querySelector('.arrow.' + dirs[direction])
      div.classList.add('active')
      setTimeout(() => {
        div.classList.remove('active')
      }, 100)
    },
    async train () {
      this.saving = true
      await tf.nextFrame()
      await tf.nextFrame()
      this.model = await trainModel(this.mobileNet, this.dataset, this.model)
      this.saving = false
      this.$notify({
        title: '提示信息',
        message: '模型保存成功',
        type: 'success'
      })
      await this.timer()
    },
    async predict () {
      if (this.canPredict) {
        const img = await this.getImage()
        const embeddings = this.mobileNet.predict(img)

        const predictions = this.model.predict(embeddings)
        const classData = (await predictions.as1D().data())
        const predictedClass = predictions.as1D().argMax()
        const classId = (await predictedClass.data())[0]

        img.dispose()

        if (classData[classId] > this.$store.state.tensorSensitivity) {
          console.log(classId, classData)
          this.activeClass(classId)
          this.canPredict = false
          setTimeout(() => {
            this.canPredict = true
          }, 1000)
        }

        await tf.nextFrame()
      }
    },
    activeClass (direction) {
      let divs = ['left', 'up', 'right', 'down']
      let div = document.querySelector('.arrow.' + divs[direction])
      div.classList.add('active')
      setTimeout(() => {
        div.classList.remove('active')
      }, 100)
    },
    async timer () {
      const timer = setInterval(async () => {
        await this.predict()
      }, 100)

      this.$once('hook:beforeDestroy', () => {
        clearInterval(timer)
      })
    }
  }
}
</script>

<style lang="scss">
#setting {
  display: flex;
  flex-wrap: wrap;
  width: 610px;
  margin: 10px auto;

  .image {
    width: 350px;
    height: 350px;
    border: 1px solid #bdc0ba;
    border-radius: 5px;
    overflow: hidden;

    #webcam {
      position: relative;
      top: 63px;
      left: 63px;
      transform: scaleX(-1.5625) scaleY(1.5625);
    }
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

<template>
  <section id="tensor-control">
    <video
      autoplay
      playsinline
      muted
      id="webcam"
      width="224"
      height="224"
    ></video>
  </section>
</template>

<script>
import * as tf from '@tensorflow/tfjs'
import * as tfd from '@tensorflow/tfjs-data'
import { Dataset } from '@/utils/tensorflow/dataset'
import { loadTruncatedMobileNet, loadModel } from '@/utils/tensorflow'

export default {
  name: 'TensorController',
  props: {
    onMove: Function,
    playing: Boolean
  },
  data () {
    return {
      webcam: null,
      dataset: null,
      mobileNet: null,
      model: null,
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
        this.onMove(-1)
      }

      this.dataset = new Dataset(4)
      this.mobileNet = await loadTruncatedMobileNet()
      const screenShot = await this.webcam.capture()
      this.mobileNet.predict(screenShot.expandDims(0))
      screenShot.dispose()

      try {
        this.model = await loadModel()
      } catch (e) {
        console.log(e)
        this.onMove(-1)
      }

      this.timer()
    },
    async getImage () {
      const img = await this.webcam.capture()
      const processedImg = tf.tidy(() => img.expandDims(0).toFloat().div(127).sub(1))
      img.dispose()
      return processedImg
    },
    async predict () {
      if (this.playing && this.canPredict) {
        const img = await this.getImage()
        const embeddings = this.mobileNet.predict(img)
        const predictions = this.model.predict(embeddings)
        const classData = (await predictions.as1D().data())
        const predictedClass = predictions.as1D().argMax()
        const classId = (await predictedClass.data())[0]
        img.dispose()

        if (classData[classId] > 2.56) {
          console.log(classId, classData)
          this.onMove(classId)
          this.canPredict = false
          setTimeout(() => {
            this.canPredict = true
          }, 1000)
        }

        await tf.nextFrame()
      }
    },
    timer () {
      const timer = setInterval(() => {
        this.predict()
      }, 100)

      this.$once('hook:beforeDestroy', () => {
        clearInterval(timer)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#tensor-control {
  width: 120px;
  height: 120px;

  #webcam {
    transform: scaleX(-0.54) scaleY(0.54);
    position: relative;
    top: -52px;
    left: -52px;
  }
}
</style>

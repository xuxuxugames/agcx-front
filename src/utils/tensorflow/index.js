import * as tf from '@tensorflow/tfjs'

export async function loadTruncatedMobileNet () {
  let mobilenet

  try {
    mobilenet = await tf.loadLayersModel('indexeddb://mobilenet')
  } catch (e) {
    mobilenet = await tf.loadLayersModel(
      'https://storage.googleapis.koder.me/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json'
    )
    await mobilenet.save('indexeddb://mobilenet')
  }

  const layer = mobilenet.getLayer('conv_pw_13_relu')
  return tf.model({ inputs: mobilenet.inputs, outputs: layer.output })
}

export async function trainModel (mobileNet, dataset, model = null) {
  if (dataset.xs == null) {
    throw new Error('Add some examples before training!')
  }

  if (model === null) {
    model = tf.sequential({
      layers: [
        tf.layers.flatten({
          inputShape: mobileNet.outputs[0].shape.slice(1)
        }),
        tf.layers.dense({
          units: 100,
          activation: 'relu',
          kernelInitializer: 'varianceScaling',
          useBias: true
        }),
        tf.layers.dense({
          name: 'data',
          units: 4,
          kernelInitializer: 'varianceScaling',
          useBias: false
        }),
        tf.layers.softmax({
          name: 'softmax'
        })
      ]
    })
  }

  const optimizer = tf.train.adam(0.0001)
  model.compile({ optimizer: optimizer, loss: 'categoricalCrossentropy' })
  const batchSize = Math.floor(dataset.xs.shape[0] * 0.4)
  if (!(batchSize > 0)) {
    throw new Error(`Batch size is 0 or NaN. Please choose a non-zero fraction.`)
  }

  await model.fit(dataset.xs, dataset.ys, {
    batchSize,
    epochs: 40,
    callbacks: {
      onBatchEnd: async (batch, logs) => {
        console.log(logs.loss.toFixed(5))
      }
    }
  })

  await model.save('indexeddb://air-model')
  console.log('model saved')

  const dataLayer = model.getLayer('data')
  const modelWithoutSoftmax = tf.model({ inputs: model.inputs, outputs: dataLayer.output })
  return modelWithoutSoftmax
}

export async function loadModel () {
  const model = await tf.loadLayersModel('indexeddb://air-model')
  const layer = model.getLayer('data')
  return tf.model({ inputs: model.inputs, outputs: layer.output })
}

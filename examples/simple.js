const { CasScaleClient } = require('@things-factory/node-casscale')
const { sleep } = require('../build/utils')

;(async function () {
  var client = new CasScaleClient('localhost', 8000)
  await client.connect()

  for (let idx = 0; idx < 10000000; idx++) {
    await sleep(1000)
    console.log('weight info: ', await client.getWeight())
  }

  client.disconnect()
  console.log('disconnected')
})()

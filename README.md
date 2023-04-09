# @things-factory/node-casscale

TRobot FDC client module for nodejs.

## Install

```bash
$ npm install @things-factory/node-casscale --save
```

## Examples

Run the examples from the examples directory.
```javascript
const { TRobotFdcClient } = require('@things-factory/node-casscale')
const { sleep } = require('../build/utils')

;(async function () {
  var client = new TRobotFdcClient('localhost', 8000)
  await client.connect()
  console.log('connected')
  await sleep(1000)

  let resp = await client.getActq()
  console.log('ACTQ: ', resp)
  await sleep(1000)

  resp = await client.getAptq()
  console.log('APTQ: ', resp)
  await sleep(1000)

  resp = await client.getActm()
  console.log('ACTM: ', resp)
  await sleep(1000)

  resp = await client.getApos()
  console.log('APOS: ', resp)
  await sleep(1000)

  client.disconnect()
  console.log('disconnected')
})()

```


## API Documentation

...

## Test

`npm test`.

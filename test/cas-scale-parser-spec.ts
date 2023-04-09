import { CasScaleDataParser } from '../src/cas-scale-parser'

describe('CasScaleDataParser', function () {
  describe('#one packet data', function () {
    this.timeout(100000000)

    it('should parse the normal data', async () => {
      var parser = new CasScaleDataParser()

      var testData = Buffer.from('ST,GS,09,   0.015 kg\r\n')
      var testData2 = Buffer.from('ST,GS,09,   0.017 kg\r\n')

      var parsed = parser.extractScaleData(testData)
      parsed = parser.extractScaleData(testData2)
      console.log(parsed)
    })
  })

  describe('#split data - 1', function () {
    this.timeout(100000000)

    it('should parse the normal data', async () => {
      var parser = new CasScaleDataParser()

      var testData = Buffer.from('ST,GS,09,')
      var parsed = parser.extractScaleData(testData)
      console.log(parsed)

      testData = Buffer.from('   0.015 kg\r\n')
      parsed = parser.extractScaleData(testData)
      console.log(parsed)
    })
  })

  describe('#split data - 2', function () {
    this.timeout(100000000)

    it('should parse the normal data', async () => {
      var parser = new CasScaleDataParser()

      var testData = Buffer.from('1234567789\r\nST,GS,09,')
      var parsed = parser.extractScaleData(testData)
      console.log(parsed)

      testData = Buffer.from('   0.015 kg\r\nST,GS,09, ')
      parsed = parser.extractScaleData(testData)

      testData = Buffer.from('  0.015 kg\r\n')
      parsed = parser.extractScaleData(testData)
      console.log(parsed)
    })
  })
})

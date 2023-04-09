export interface CasScaleData {
  status: string
  weightType: string
  devNo: number
  lampStatus: number
  weight: number
}

/*

Scale Data Format
(US|ST|OL),(GS|NT),[0-9].,[0-9,\s,.]{8}\s(kg|t )


*/
export class CasScaleDataParser {
  private recvBuffer: Buffer = Buffer.alloc(0)
  private bufferEnd: string = '0d0a'
  private recvBufferLen: number = 22
  private recvPattern: RegExp = /^(US|ST|OL),(GS|NT),[0-9]/

  constructor() {}

  extractScaleData(data: Buffer): CasScaleData | null {
    // 1. store the input data into the recv buffer.
    this.recvBuffer = Buffer.concat([this.recvBuffer, data])

    // 2. find '0d0a' and extract Buffer
    let foundIndex = this.recvBuffer.indexOf(this.bufferEnd, 0, 'hex')

    // recvBufferLen - 2('0d0a')
    if (foundIndex !== this.recvBufferLen - 2) {
      this.recvBuffer = foundIndex >= 0 ? data.subarray(foundIndex + 2) : this.recvBuffer
      if (this.recvBuffer.length > this.recvBufferLen) {
        this.recvBuffer = Buffer.alloc(0)
      }
      return null
    }

    // check pattern for header data
    if (!this.recvPattern.test(this.recvBuffer.toString())) {
      console.error('received the wrong pattern')
      return null
    }

    var status = this.recvBuffer.subarray(0, 2).toString()
    var weightType = this.recvBuffer.subarray(3, 5).toString()
    var devNo = this.recvBuffer.subarray(6, 7)[0]
    var lampStatus = this.recvBuffer.subarray(7, 8)[0]
    let weightUnit = this.recvBuffer.subarray(18, 20).toString()
    var weight = parseFloat(this.recvBuffer.subarray(9, 17).toString())
    weight = weightUnit == 't' ? weight * 1000 : weight

    // arrange the left bytes which is not handled
    if (this.recvBuffer.length >= this.recvBufferLen) {
      this.recvBuffer = this.recvBuffer.subarray(22)
    }

    return {
      status,
      weightType,
      devNo,
      lampStatus,
      weight
    }
  }
}

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
  private packetLen: number = 22
  private recvPattern: RegExp = /^(US|ST|OL),(GS|NT),[0-9]/
  private status = 'ST'
  private weightType = 'GT'
  private devNo: number = 0
  private lampStatus: number = 0
  private weight: number = 0.0

  constructor() {}

  extractScaleData(data: Buffer): CasScaleData | null {
    let foundAvailPacket: boolean = true
    // 1. store the input data into the recv buffer.
    this.recvBuffer = Buffer.concat([this.recvBuffer, data])

    do {
      // 2. find '0d0a' and extract Buffer
      foundAvailPacket = true
      let foundIndex = this.recvBuffer.indexOf(this.bufferEnd, 0, 'hex')

      // packetLen - 2('0d0a')
      if (foundIndex !== this.packetLen - 2) {
        foundAvailPacket = false
      }

      // check pattern for header data
      if (!this.recvPattern.test(this.recvBuffer.toString())) {
        console.error('received the wrong pattern')
        foundAvailPacket = false
      }

      if (foundAvailPacket) {
        this.status = this.recvBuffer.subarray(0, 2).toString()
        this.weightType = this.recvBuffer.subarray(3, 5).toString()
        this.devNo = this.recvBuffer.subarray(6, 7)[0]
        this.lampStatus = this.recvBuffer.subarray(7, 8)[0]
        var weightUnit = this.recvBuffer.subarray(18, 20).toString()
        this.weight = parseFloat(this.recvBuffer.subarray(9, 17).toString())
        this.weight = weightUnit == 't' ? this.weight * 1000 : this.weight
      }

      // no found '0d0a' and buffer size > packet lenght => clear recv buffer
      if (foundIndex < 0 && this.recvBuffer.length >= this.packetLen) {
        this.recvBuffer = Buffer.alloc(0)
      }
      if (foundIndex >= 0) {
        this.recvBuffer = this.recvBuffer.subarray(foundIndex + 2)
      }
      // if (foundIndex >= 0 && this.recvBuffer.length < this.packetLen) {
      //   this.recvBuffer = Buffer.alloc(0)
      // }
      // // found '0d0a' then remove the packet that is already parsed
      // if (this.recvBuffer.length >= this.packetLen) {
      //   this.recvBuffer = this.recvBuffer.subarray(foundIndex + 2)
      // }
    } while (this.recvBuffer.indexOf(this.bufferEnd, 0, 'hex') >= 0)

    return {
      status: this.status,
      weightType: this.weightType,
      devNo: this.devNo,
      lampStatus: this.lampStatus,
      weight: this.weight
    }
  }
}

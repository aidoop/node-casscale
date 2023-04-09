import { Socket } from 'net'
import PromiseSocket from 'promise-socket'

import { CasScaleData, CasScaleDataParser } from './cas-scale-parser'

const debug = require('debug')('aidoop:cas-scale-client')

export class CasScaleClient {
  public socket
  public serverIp
  public serverPort
  public weight: CasScaleData | null
  private _parser: CasScaleDataParser

  constructor(serverIp, serverPort) {
    this.socket
    this.serverIp = serverIp
    this.serverPort = serverPort

    this._parser = new CasScaleDataParser()
  }

  async connect() {
    const socket = new Socket()
    socket.setKeepAlive(true, 60000)

    socket.on('data', data => {
      debug(`data: ${data.toString('utf8')}`)
      // extract the weight data
      console.log('data: ', data)
      this.weight = this._parser.extractScaleData(data)
      console.log('weight: ', this.weight)
    })

    socket.on('end', () => {
      debug('disconnected')
    })

    socket.on('error', err => {
      debug(`error: ${err.message}`)
    })

    this.socket = new PromiseSocket(socket)

    await this.socket.connect(this.serverPort, this.serverIp)

    debug(`Connect: Server IP (${this.serverIp})`)
  }

  disconnect() {
    this.socket && this.socket.destroy()
    this.socket = null
  }

  shutdown() {
    this.disconnect()
  }

  getWeight(): CasScaleData | null {
    return this.weight
  }

  async _sendMessage(buf, size?) {
    await this.socket.write(buf, size || buf.length)
  }

  async _recvMessage() {
    var message = await this.socket.read()
    if (!message) {
      console.error('socker closed')
      throw new Error('socket closed')
    }
    return message
  }
}

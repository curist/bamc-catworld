import Bamc from 'bamc-core'
import { Terminal } from 'xterm'

const debug = require('debug')('bamc-cw:App')

import {h, Component} from 'preact'

export default class App extends Component {
  componentDidMount() {
    const term = new Terminal()
    term.open(this.container)

    const url = 'wss://cw2.twmuds.com/websocket/v1939'
    const bamc = this.bamc = Bamc(url)
    bamc.on('line', l => term.write(l + '\n'))
    bamc.on('iac:sub:gmcp', buffer => debug(buffer.toString()))
  }

  render() {
    return <div>
      <div ref={ref => this.container = ref} />
    </div>
  }
}

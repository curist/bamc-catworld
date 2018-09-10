import Bamc from 'bamc-core'

const debug = require('debug')('bamc-cw:App')

import {h, Component} from 'preact'

export default class App extends Component {
  constructor() {
    super()
    const url = 'wss://cw2.twmuds.com/websocket/v1939'
    const bamc = this.bamc = Bamc(url)
    bamc.on('line', l => debug(l))
    bamc.on('iac:sub:gmcp', buffer => debug(buffer))
  }
  render() {
    return <div>
      <div>
        <h2>
          Welcome to preact
        </h2>
      </div>
      <div>
        <p>Edit <code>src/components/App.js</code> and save to hot reload your changes.</p>
      </div>
    </div>
  }
}

import Bamc from 'bamc-core'
import ConvertAnsi from 'ansi-to-html'

import css from './App.css'

const debug = require('debug')('bamc-cw:App')

import {h, Component} from 'preact'

export default class App extends Component {
  componentDidMount() {
    const ansi = new ConvertAnsi()

    const url = 'wss://cw2.twmuds.com/websocket/v1939'
    const bamc = this.bamc = Bamc(url)
    bamc.on('line', l => {
      this.container.innerHTML += (ansi.toHtml(l) + '\n')
      this.container.scrollTop = this.container.scrollHeight
    })
    bamc.on('iac:sub:gmcp', buffer => debug(buffer.toString()))
  }

  render() {
    return <div className={css.App}>
      <pre className={css.term}
        ref={ref => this.container = ref} />
      <input className={css.input} />
    </div>
  }
}

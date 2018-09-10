import Bamc from 'bamc-core'
import autobind from 'autobind-decorator'
import ConvertAnsi from 'ansi-to-html'
const ansi = new ConvertAnsi()
const debug = require('debug')('bamc-cw:App')

import {h, Component} from 'preact'

import css from './App.css'

@autobind
export default class App extends Component {
  componentDidMount() {
    const url = 'wss://cw2.twmuds.com/websocket/v1939'
    const bamc = this.bamc = Bamc(url)
    bamc.on('line', l => {
      this.container.innerHTML += (ansi.toHtml(l) + '\n')
      this.container.scrollTop = this.container.scrollHeight
    })
    bamc.on('iac:sub:gmcp', buffer => debug(buffer.toString()))
  }

  submit(e) {
    e.preventDefault()
    const value = this.inputRef.value
    this.bamc.emit('action', {
      type: 'send',
      message: value,
    })
    this.inputRef.select()
  }

  render() {
    return <div className={css.App}>
      <pre className={css.term} ref={ref => this.container = ref} />
      <form onsubmit={this.submit}>
        <input className={css.input} ref={ref => this.inputRef = ref}
          spellcheck={false} />
      </form>
    </div>
  }
}

import Bamc from 'bamc-core'
import autobind from 'autobind-decorator'
import ConvertAnsi from 'ansi-to-html'
const ansi = new ConvertAnsi()
const debug = require('debug')('bamc-cw:App')

import {h, Component} from 'preact'

import css from './App.css'

// done/done@cw2 wss://cw2.twmuds.com/websocket/v1939
// alright/alright@cat wss://catworld.muds.tw/websocket/v1939
@autobind
export default class App extends Component {
  componentDidMount() {
    const url = 'wss://catworld.muds.tw/websocket/v1939'
    const bamc = this.bamc = Bamc(url)
    const container = this.container
    bamc.on('line', l => {
      container.innerHTML += (ansi.toHtml(l) + '\n')
      container.scrollTop = container.scrollHeight
    })
    bamc.on('iac:sub:gmcp', buffer => debug(buffer.toString()))
    window.gmcp = gmcp => bamc.emit('action', { type: 'cmd', message: gmcp })
  }

  submit(e) {
    e.preventDefault()
    const value = this.inputRef.value || ' '
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
          spellcheck={false} autofocus={true} />
      </form>
    </div>
  }
}

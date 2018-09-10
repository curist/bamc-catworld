import Bamc from 'bamc-core'
import autobind from 'autobind-decorator'
import ConvertAnsi from 'ansi-to-html'
const ansi = new ConvertAnsi()
const debug = require('debug')('bamc-cw:App')

import {h, Component} from 'preact'

import css from './App.css'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const MAX_LINES = 5000

// done/done@cw2 wss://cw2.twmuds.com/websocket/v1939
// alright/alright@cat wss://catworld.muds.tw/websocket/v1939
@autobind
export default class App extends Component {
  state = {
    lineIndex: 0,
    lines: [],
    prevCommand: null,
  }
  componentDidMount() {
    const url = 'wss://cw2.twmuds.com/websocket/v1939'
    // const url = 'wss://catworld.muds.tw/websocket/v1939'
    const bamc = this.bamc = Bamc(url)
    const container = this.container
    bamc.on('line', async l => {
      const lineIndex = this.state.lineIndex + 1

      const lines = this.state.lines.concat([{
        index: lineIndex,
        content: ansi.toHtml(l),
      }]).slice(-1 * MAX_LINES)

      this.setState({ lineIndex, lines })

      await delay(0)
      container.scrollTop = container.scrollHeight
    })
    bamc.on('iac:sub:gmcp', async buffer => debug(buffer.toString()))
  }

  submit(e) {
    e.preventDefault()
    const { prevCommand } = this.state
    const value = this.inputRef.value || ' '
    if(/^:/.test(value)) {
      this.bamc.emit('action', { type: 'cmd', message: value.slice(1) })
      this.inputRef.value = prevCommand || ''
    } else {
      this.bamc.emit('action', { type: 'send', message: value })
      this.setState({ prevCommand: value })
    }

    this.inputRef.select()
  }

  render() {
    const { lines } = this.state
    return <div className={css.App}>
      <pre className={css.term} ref={ref => this.container = ref}>
        {
          lines.map(({index, content}) => <div
            key={index} dangerouslySetInnerHTML={{__html: content}}
          />)
        }
      </pre>
      <form onsubmit={this.submit}>
        <input className={css.input} ref={ref => this.inputRef = ref}
          spellcheck={false} autofocus={true} />
      </form>
    </div>
  }
}

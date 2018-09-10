import Bamc from 'bamc-core'
import autobind from 'autobind-decorator'
import ConvertAnsi from 'ansi-to-html'
import keycode from 'keycode'
const ansi = new ConvertAnsi()
const debug = require('debug')('bamc-cw:App')

import {h, Component} from 'preact'

import css from './App.css'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const defer = async task => {
  await delay(0)
  return task()
}

const MAX_LINES = 2000

// done/done@cw2 wss://cw2.twmuds.com/websocket/v1939
// alright/alright@cat wss://catworld.muds.tw/websocket/v1939
@autobind
export default class App extends Component {
  state = {
    lineIndex: 0,
    lines: [],
    commandHistory: [],
    commandHistoryIndex: null,
    prevCommand: null,
  }
  componentDidMount() {
    // const url = 'wss://cw2.twmuds.com/websocket/v1939'
    const url = 'wss://catworld.muds.tw/websocket/v1939'
    const bamc = this.bamc = Bamc(url)
    const container = this.container
    bamc.on('line', async l => {
      const lineIndex = this.state.lineIndex + 1

      const lines = this.state.lines.concat([{
        index: lineIndex,
        content: ansi.toHtml(l),
      }]).slice(-1 * MAX_LINES)

      this.setState({
        lines,
        lineIndex,
      })

      await delay(0)
      container.scrollTop = container.scrollHeight
    })
    bamc.on('iac:sub:gmcp', async buffer => debug(buffer.toString()))
  }

  handleCommand(e) {
    e.preventDefault()
    const { commandHistory, prevCommand } = this.state
    const cmd = this.inputRef.value || ' '

    // focus input after command sent
    defer(() => this.inputRef.select())

    if(/^:/.test(cmd)) {
      this.bamc.emit('action', { type: 'cmd', message: cmd.slice(1) })
      this.inputRef.value = prevCommand || ''
      return
    }

    this.bamc.emit('action', { type: 'send', message: cmd })

    if(cmd == prevCommand) {
      return
    }

    this.setState({
      commandHistoryIndex: commandHistory.length,
      commandHistory: commandHistory.concat([cmd]).slice(-50),
      prevCommand: cmd,
    })
  }

  handleSpecialKeys(e) {
    const { commandHistory, commandHistoryIndex } = this.state
    const maxIndex = commandHistory.length - 1
    const i = commandHistoryIndex == null
      ? maxIndex :  commandHistoryIndex

    switch(keycode(e)) {
      case 'up': {
        const nextCmdHistoryIndex = Math.max(0, i - 1)
        const cmd = commandHistory[nextCmdHistoryIndex]
        this.inputRef.value = cmd
        this.inputRef.select()
        this.setState({ commandHistoryIndex: nextCmdHistoryIndex })
        break
      }
      case 'down': {
        const nextCmdHistoryIndex = Math.min(maxIndex, i + 1)
        const cmd = commandHistory[nextCmdHistoryIndex]
        this.inputRef.value = cmd
        this.inputRef.select()
        this.setState({ commandHistoryIndex: nextCmdHistoryIndex })
        break
      }
      default: {

      }
    }
  }

  render({}, { lines }) {
    return <div className={css.App}>
      <pre className={css.term} ref={ref => this.container = ref}>
        {
          lines.map(({index, content}) => <div key={index}
            dangerouslySetInnerHTML={{__html: content}}
          />)
        }
      </pre>
      <form onsubmit={this.handleCommand}>
        <input className={css.input} ref={ref => this.inputRef = ref}
          onKeyUp={this.handleSpecialKeys}
          spellcheck={false} autofocus={true} />
      </form>
    </div>
  }
}

import bamc from 'bamc-core'

import {h, Component} from 'preact'

export default class App extends Component {
  render() {
    console.log(bamc)
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

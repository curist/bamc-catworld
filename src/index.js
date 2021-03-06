import 'src/index.css'

import {h, render} from 'preact'

if (process.env.NODE_ENV === 'development') {
  // Enable use of React Developer Tools
  require('preact/devtools')
  console.log(`localStorage.debug: ${localStorage.debug}`)
}

let root
function init() {
  let App = require('src/components/App').default
  root = render(<App/>, document.querySelector('#app'), root)
}

if (module.hot) {
  module.hot.accept('./components/App', init)
}

init()

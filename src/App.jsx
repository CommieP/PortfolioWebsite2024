import './App.css'
import { Provider } from 'react-redux'
import store from './packages/store'
import RoutesHOC from './packages/routes'

function App() {
  return (
    <>
      <Provider store={store}>
        <RoutesHOC></RoutesHOC>
      </Provider>
    </>
  )
}

export default App

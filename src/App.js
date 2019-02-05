import React, { Component } from 'react';
import './App.css';
import Game from './containers/game';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './reducers/'

const store = createStore(rootReducer);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <Game />
        </div>
      </Provider>
    );
  }
}

export default App;

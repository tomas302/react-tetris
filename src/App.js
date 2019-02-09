import React, { Component } from 'react';
import './App.css';
import Game from './containers/game';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './reducers/'

const store = createStore(rootReducer);

document.addEventListener('touchmove', function(event) {
  event = event.originalEvent || event;
  if (event.scale !== 1) {
     event.preventDefault();
  }
}, false);

class App extends Component {

  constructor(props) {
    super(props);
    
    this.backToStartScreen = this.backToStartScreen.bind(this);
  }
  
  backToStartScreen() {
    this.forceUpdate();
  }

  render() {
    return (
      <Provider store={store}>
        <div id="App">
          <Game key={ store.getState().gameKey } backToStartScreen={ this.backToStartScreen } />
        </div>
      </Provider>
    );
  }
}

export default App;

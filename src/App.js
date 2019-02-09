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
    
    this.state = {
      startAgain: false
    };

    this.refreshApp = this.refreshApp.bind(this);
  }
  
  refreshApp(startAgain) {
    this.forceUpdate();
    this.setState({
      startAgain: startAgain
    });
  }

  render() {
    return (
      <Provider store={store}>
        <div id="App">
          <Game key={ store.getState().gameKey } refreshApp={ this.refreshApp } running={ this.state.startAgain } />
        </div>
      </Provider>
    );
  }
}

export default App;

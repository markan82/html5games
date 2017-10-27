import React, { Component } from 'react';
import './App.css';
import Game from './Game';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Game imageUrl="/mke.jpg" puzzleDifficulty='4' />
      </div>
    );
  }
}

export default App;

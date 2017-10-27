import React, { Component } from 'react';
import './App.css';
import Game from './Game';

class App extends Component {

  render() {
    console.log(this.state);
    return (
      <div className="App">
        <Game imageUrl="/mke.jpg" puzzleDifficulty='2' />
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import './App.css';
import Game from './Game';

import { Switch, Route } from 'react-router-dom'
import { Link } from 'react-router-dom'

import './css/bootstrap.min.css';

const App = (rootPath) => (
  <main>
    <Switch>
      <Route exact path={rootPath + '/'} component={Home}/>
      <Route path={rootPath + '/selectImage'} component={SelectImage}/>
      <Route path={rootPath + '/about'} component={About}/>
      <Route path={rootPath + '/game'} component={Game}/>
    </Switch>
  </main>
)

const Home = () => (
  <div className='home'>
    <Link to={{ pathname: '/selectImage', piece: 4 }} className='btn btn-light'>4x4</Link>
    <Link to={{ pathname: '/selectImage', piece: 5 }} className='btn btn-light'>5x5</Link>
    <Link to={{ pathname: '/selectImage', piece: 6 }} className='btn btn-light'>6x6</Link>
    <Link to={{ pathname: '/selectImage', piece: 7 }} className='btn btn-light'>7x7</Link>
    <Link to={{ pathname: '/selectImage', piece: 8 }} className='btn btn-light'>8x8</Link>
  </div>
);

var imgs = [
  'calla-2888884_1920.jpg',
  'landscape-2883693_1280.jpg',
  'weather.jpg',
  'mke.jpg',
  'calla-2888884_1920.jpg',
  'landscape-2883693_1280.jpg',
  'weather.jpg',
  'mke.jpg',
  'calla-2888884_1920.jpg',
  'landscape-2883693_1280.jpg',
  'weather.jpg',
  'mke.jpg'
];

const SelectImage = ({location}) => (
  <div className='select-image'>
    {imgs.map((e, index) => (
      <div className='image' key={index}>
        <Link to={{ pathname: '/game', piece: location.piece, imgSrc: 'imgs/'+e }}>
          <img src={'imgs/'+e} className='img-thumbnail' alt='이미지' />
        </Link>
      </div>))}
  </div>
);

/*
class SelectImage extends Component {
  render = () => {
    console.log(this.props);
    return (
    <div className='select-image'>
      {imgs.map((e, index) => (
        <div className='image' key={index}>
          <Link to={{ pathname: '/game', piece: this.props.location.piece, image:e }}>
            <img src={'/imgs/'+e} className='img-thumbnail' />
          </Link>
        </div>))}
    </div>
    );
  }
}
*/

/*
const Header = () => (
  <header>
    <nav>
      <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/about'>About</Link></li>
      </ul>
    </nav>
  </header>
)
*/

/*
class App extends Component {
  render() {
    return (
      <div className="App">
        <Game imageUrl="/mke.jpg" puzzleDifficulty='4' />
      </div>
    );
  }
}
*/

class About extends Component {
  render() {
      return (
          <h2>Hey, I am ABOUT!</h2>
      );
  }
}

export default App;

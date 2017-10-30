import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker';

console.log(window.location.pathname);

ReactDOM.render((
    <BrowserRouter>
        <App rootPath={window.location.pathname}/>
    </BrowserRouter>
), document.getElementById('root'));
registerServiceWorker();
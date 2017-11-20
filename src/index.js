import React from 'react';
import ReactDOM from 'react-dom';
import {unregister} from './registerServiceWorker';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import './index.css';
import Home from './components/Home';
import GameView from './components/GameView';
import Help from './components/Help';


ReactDOM.render(
    <BrowserRouter>
        <div className="main">
            <Switch>
                <Route path="/game/:opponent" component={GameView}/>
                <Route path="/" component={Home}/>
            </Switch>
            <Route path="*/help" component={Help} />
        </div>
    </BrowserRouter>
    , document.getElementById('root')
);

unregister();
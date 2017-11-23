import React from 'react';
import ReactDOM from 'react-dom';
import {unregister} from './registerServiceWorker';
import {BrowserRouter, Route} from 'react-router-dom';
import { AnimatedSwitch, AnimatedRoute } from 'react-router-transition';

import './index.css';
import Home from './components/Home';
import GameView from './components/GameView';
import Help from './components/Help';


ReactDOM.render(
    <BrowserRouter>
        <div className="main">
            <AnimatedSwitch
                atEnter={{ opacity: 0 }}
                atLeave={{ opacity: 1 }}
                atActive={{ opacity: 1 }}
                className="switch-wrapper"
            >        
                <Route path="/game/:opponent" component={GameView}/>
                <Route path="/" component={Home}/>
            </AnimatedSwitch>
            <AnimatedRoute
                atEnter={{ opacity: 0 }}
                atLeave={{ opacity: 0 }}
                atActive={{ opacity: 1 }}
                path="*/help" 
                component={Help}/>

        </div>
    </BrowserRouter>
    , document.getElementById('root')
);

unregister();
import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from 'registerServiceWorker';
import promise from 'redux-promise';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import reducers from 'reducers';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import './index.css';
import Home from 'components/Home';
import Game from 'components/Game';



const helpStore = applyMiddleware(promise)(createStore)(reducers);

ReactDOM.render(
    <Provider store={helpStore}>
        <BrowserRouter>
            <div className="main">
                <Switch>
                    <Route path="/game/:opponent" component={Game}/>
                    <Route path="/" component={Home}/>
                </Switch>
            </div>
        </BrowserRouter>
    </Provider>
    , document.getElementById('root')
);
registerServiceWorker();
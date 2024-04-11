import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
//provider will keep track of that store which is global state that allows us to access the store from anywhere inside of the app not need to be inside that exact parent or child component can be accessed from anywhere

import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import reducers from './reducers';

import App from './App.js';
import './index.css'

const store = createStore(reducers, compose(applyMiddleware(thunk)));

ReactDom.render(
    <Provider store={store}>
        <BrowserRouter>
        
        <App />
        </BrowserRouter>
    </Provider>, 
    document.getElementById('root')
);


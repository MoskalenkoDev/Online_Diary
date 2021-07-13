import React from 'react';
import ReactDOM from 'react-dom';
import {WrappedApp} from './components/App/App';
import {createStore} from 'redux';
import {Provider} from 'react-redux'; // провайдер нужен чтобы соединить редакс с реакт аппом
import {rootReducer} from './Redux/rootReducer';

if(!window.localStorage.getItem("language")) window.localStorage.setItem("language","ua");
const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()); // передаем в провайдер

ReactDOM.render(<Provider store = {store}><WrappedApp/></Provider>,document.getElementById("root"));
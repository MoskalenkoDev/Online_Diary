import React from 'react';
import ReactDOM from 'react-dom';
import {WrappedApp} from './components/App/App';
import {Provider} from 'react-redux'; // провайдер нужен чтобы соединить редакс с реакт аппом
import { store } from './Redux/store';
import 'react-dates/initialize';

if(!window.localStorage.getItem("language")) window.localStorage.setItem("language","ua");
ReactDOM.render(<Provider store = {store}><WrappedApp/></Provider>,document.getElementById("root"));
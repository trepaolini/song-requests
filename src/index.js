import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import firebase from 'firebase';
import 'bootstrap/dist/css/bootstrap.css';


let config = {
    apiKey: "AIzaSyAeAzQzIhyJy9UsLCsXPxQyt6HSBqyn9Qo",
    authDomain: "ps-7-22f17.firebaseapp.com",
    databaseURL: "https://ps-7-22f17.firebaseio.com",
    projectId: "ps-7-22f17",
    storageBucket: "",
    messagingSenderId: "852467515401"
};
firebase.initializeApp(config);
ReactDOM.render(<App />, document.getElementById('root'));

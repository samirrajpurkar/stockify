import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import * as firebase from 'firebase';

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyCXeCkVOdWN_MkwID2cHzxVV-miIl0sNRU",
    authDomain: "stockifyfirebase.firebaseapp.com",
    databaseURL: "https://stockifyfirebase.firebaseio.com",
    projectId: "stockifyfirebase",
    storageBucket: "stockifyfirebase.appspot.com",
    messagingSenderId: "729840171264"
  };
  firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

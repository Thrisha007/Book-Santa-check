import firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
    apiKey: "AIzaSyA9O5KJuE285imJlzLxvPq5nF9hUlL2_os",
    authDomain: "book-santa-b6610.firebaseapp.com",
    databaseURL: "https://book-santa-b6610.firebaseio.com",
    projectId: "book-santa-b6610",
    storageBucket: "book-santa-b6610.appspot.com",
    messagingSenderId: "125076157798",
    appId: "1:125076157798:web:960d3d8c7744d13fde04a7",
    measurementId: "G-TXTD5J41MJ"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();
const firebaseConfig = {
    apiKey: "AIzaSyAekw7dR4Jgzte2NBw3aA105K0VAdomm-U",
    authDomain: "q-sorting-pictogram-evaluator.firebaseapp.com",
    databaseURL: "https://q-sorting-pictogram-evaluator-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "q-sorting-pictogram-evaluator",
    storageBucket: "q-sorting-pictogram-evaluator.appspot.com",
    messagingSenderId: "763393271305",
    appId: "1:763393271305:web:072b1ad29fa3d4a49f7ad8",
    measurementId: "G-RHJ6Q5P64B"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

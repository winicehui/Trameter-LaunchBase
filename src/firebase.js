import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyCbaY3908tKjJYVQvTRbO0YoQl7Uu5e8e0",
    authDomain: "launchbase-581e0.firebaseapp.com",
    databaseURL: "https://launchbase-581e0.firebaseio.com",
    projectId: "launchbase-581e0",
    storageBucket: "launchbase-581e0.appspot.com",
    messagingSenderId: "907413473568",
    appId: "1:907413473568:web:333bc1c7087e707fe66f45",
    measurementId: "G-G3WR24SVQD"
}

firebase.initializeApp(firebaseConfig);

export default firebase;
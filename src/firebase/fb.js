import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAWF2P-uzKBgHcqrzc9-gZctR1hMfpvcCc",
    authDomain: "food-blog-da3f9.firebaseapp.com",
    databaseURL: "https://food-blog-da3f9.firebaseio.com",
    projectId: "food-blog-da3f9",
    storageBucket: "food-blog-da3f9.appspot.com",
    messagingSenderId: "591390816694",
    appId: "1:591390816694:web:6eb1c3de9ae76ee6f5a917"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore()
const storage = firebase.storage()

export {db, storage}
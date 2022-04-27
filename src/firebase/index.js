import firebase from 'firebase'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyANh1QhQDP-Gk4DX94ZOeK3etlhFW_rMF0",
    authDomain: "twitter-clone-19b55.firebaseapp.com",
    projectId: "twitter-clone-19b55",
    storageBucket: "twitter-clone-19b55.appspot.com",
    messagingSenderId: "745026341032",
    appId: "1:745026341032:web:fcd228afd4cb390cbb1a9d",
    measurementId: "G-C45PNXRB0H"
};

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()
export const db = firebase.firestore()
export const storage = firebase.storage()

export const USER_COLEECTION = db.collection('users')
export const TWEET_COLEECTION = db.collection('tweets')
export const COMMENT_COLLECTION = db.collection('comments')
export const RETWEET_COLLECTION = db.collection('retweets')
export const LIKE_COLLECTION = db.collection('likes')
export const MESSAGE_COLLECTION = db.collection('messages')
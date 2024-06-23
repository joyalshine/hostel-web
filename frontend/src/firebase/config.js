import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBPcyiYLuQzc6jWfPoHStd-Pros4HYGEXI",
  authDomain: "vit-hostel-app.firebaseapp.com",
  projectId: "vit-hostel-app",
  storageBucket: "vit-hostel-app.appspot.com",
  messagingSenderId: "628776946173",
  appId: "1:628776946173:web:2cef151ea0793e980ab194",
  measurementId: "G-9F3N2ZJXNM",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const Firebase = firebaseApp.firestore();

const time = firebase.firestore.FieldValue.serverTimestamp();

export { Firebase, time };

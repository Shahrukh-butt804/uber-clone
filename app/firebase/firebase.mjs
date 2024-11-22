// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBym762YkRnsEN4TgpQM1Za_lyrnV_zAqk",
  authDomain: "uber-clone-dd26c.firebaseapp.com",
  projectId: "uber-clone-dd26c",
  storageBucket: "uber-clone-dd26c.appspot.com",
  messagingSenderId: "128384096011",
  appId: "1:128384096011:web:1719cb1b22cd1773a9340e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
export default app;
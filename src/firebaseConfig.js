import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA9p84YFSaRrWYI5c2Dm4CwmgtJuWTys9g",
  authDomain: "aiden-shiv.firebaseapp.com",
  projectId: "aiden-shiv",
  storageBucket: "aiden-shiv.appspot.com",
  messagingSenderId: "701389143848",
  appId: "1:701389143848:web:3cc71c72b92baac7d55a1d",
  measurementId: "G-RNTHBZZKJ2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();
const signInWithGoogle = () => signInWithPopup(auth, provider)
  .then((result) => {
    // Example of how to use the result
    // const credential = GoogleAuthProvider.credentialFromResult(result);
    // const token = credential.accessToken;
    // const user = result.user;
    // Use user info as needed
  }).catch((error) => {
    // Example of how to handle errors
    // const errorCode = error.code;
    // const errorMessage = error.message;
    // const email = error.email;
    // const credential = GoogleAuthProvider.credentialFromError(error);
    // Handle errors as needed
  });

export { auth, db, signInWithGoogle };

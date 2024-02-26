// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9p84YFSaRrWYI5c2Dm4CwmgtJuWTys9g",
  authDomain: "aiden-shiv.firebaseapp.com",
  projectId: "aiden-shiv",
  storageBucket: "aiden-shiv.appspot.com",
  messagingSenderId: "701389143848",
  appId: "1:701389143848:web:3cc71c72b92baac7d55a1d",
  measurementId: "G-RNTHBZZKJ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Define signInWithGoogle
const provider = new GoogleAuthProvider();
const signInWithGoogle = () => signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // Optional: Update UI or state with user information
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // Optional: Update UI or log errors
  });

// Export auth, db, and signInWithGoogle for use in your app
export { auth, db, signInWithGoogle };

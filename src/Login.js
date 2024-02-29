import React from 'react';
import { signInWithGoogle } from './firebaseConfig'; // Make sure this is correctly imported
import './Login.css'; // Assuming you will create a CSS file for the login page

const Login = () => {
  return (
    <div className="login-container">
      <h1>Login to A.I.D.E.N</h1>
      <button className="login-btn" onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
};

export default Login;

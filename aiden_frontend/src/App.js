import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from './firebaseConfig';
import Navbar from './Navbar';
import TaskList from './TaskList';
import AddTaskForm from './AddTaskForm';
import Login from './Login';
import UserProfile from './UserProfile'; // Import UserProfile
import { AuthProvider } from './AuthProvider'; // Import AuthProvider

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <Router>
      <AuthProvider value={{currentUser}}> {/* Ensure AuthProvider correctly passes down the currentUser */}
        <div>
          {currentUser ? (
            <>
              <Navbar handleLogout={handleLogout} currentUser={currentUser}/>
              <Routes>
                <Route path="/" element={<TaskList />} />
                <Route path="/add-task" element={<AddTaskForm />} />
                <Route path="/profile" element={<UserProfile />} /> {/* Add route for UserProfile */}
                <Route path="/login" element={<Navigate to="/" />} />
              </Routes>
            </>
          ) : (
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          )}
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

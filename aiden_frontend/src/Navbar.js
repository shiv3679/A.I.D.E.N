import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthProvider'; // Adjust based on your actual import
import './Navbar.css';

function Navbar({ handleLogout, currentUser }) {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">A.I.D.E.N</Link>
      <ul className="nav-links">
        <li>
          <Link to="/add-task" className="nav-link">Add Task</Link>
        </li>
        <li className="nav-link">Hi, {currentUser.displayName || 'User'}</li>
        <li>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

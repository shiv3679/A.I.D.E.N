import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Ensure this path is correct

function Navbar({ handleLogout, currentUser }) {
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">A.I.D.E.N</Link>
      <button
        className={`hamburger ${isNavExpanded ? "is-active" : ""}`}
        onClick={() => setIsNavExpanded(!isNavExpanded)}
      >
        <span>&#9776;</span>
      </button>
      <div className={`nav-links ${isNavExpanded ? "expanded" : ""}`}>
        <Link to="/" className="nav-link">Tasks</Link> {/* Make sure this is included for navigation */}
        <Link to="/add-task" className="nav-link">Add Task</Link>
        <Link to="/profile" className="nav-link">Profile</Link>
        <span className="nav-link">Hi, {currentUser.displayName || 'User'}</span>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;

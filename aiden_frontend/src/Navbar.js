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
      <ul className={`nav-links ${isNavExpanded ? "expanded" : ""}`}>
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

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/styles.css';

const Header = () => {
  return (
    <header className="top-bar">
      <div className="container">
        <Link to="/" className="logo-text">Vitaran Learning</Link>
        <div className="nav-buttons">
          <a href="#about">About Us</a>
          <a href="#contact">Contact Us</a>
          <Link to="/login">Log In</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;


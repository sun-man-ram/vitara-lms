import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';

const Header = () => {
  return (
    <header className="top-bar">
      <div className="container">
        <Link to="/" className="logo-text">Vitaran Learning</Link>
      </div>
    </header>
  );
};

export default Header;


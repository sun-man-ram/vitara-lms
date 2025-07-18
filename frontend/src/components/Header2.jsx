import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ onLogout }) => {
  const handleProfileClick = () => {
    const dropdown = document.querySelector('.dropdown-menu');
    dropdown.classList.toggle('show');
  };

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      const profileBtn = document.querySelector('.profile-button');
      const dropdownMenu = document.querySelector('.dropdown-menu');
      if (profileBtn && dropdownMenu && !profileBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove('show');
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="top-bar">
      <div className="container">
        <Link to="/dashboard/SuperAdminDash" className="logo-link">
            <div className="logo">Vitaran <span>Learning</span></div>
        </Link>

        <div className="profile-dropdown">
          <button className="header-button profile-button" onClick={handleProfileClick}>
            <i className="fas fa-user"></i>
            <span className="username">Srihari Kakumani</span>
            <i className="fas fa-caret-down"></i>
          </button>
          <div className="dropdown-menu">
            <a href="#">Edit Profile</a>
            <a href="#">Change Password</a>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

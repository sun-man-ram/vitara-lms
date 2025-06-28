import React from 'react';
import '../../styles/admin.css';
import Calendar from '../../components/Calendar.jsx';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';


const SuperAdmin = () => {
  const toggleSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
    const icon = sidebar.querySelector('.toggle-btn i');
    icon.classList.toggle('fa-angle-double-left');
    icon.classList.toggle('fa-angle-double-right');
  };

  const handleProfileClick = () => {
    const dropdown = document.querySelector('.dropdown-menu');
    dropdown.classList.toggle('show');
  };

  const navigate = useNavigate();
    const handleLogout = () => {
    localStorage.removeItem('token');
    console.log("Logging out...")
    navigate('/login', { replace: true });
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
    <div>
      {/* Header */}
      <header className="top-bar">
        <div className="container">
          <div className="logo">Vitaran <span>Learning</span></div>
          <div className="profile-dropdown">
            <button className="header-button profile-button" onClick={handleProfileClick}>
              <i className="fas fa-user"></i>
              <span className="username">Srihari Kakumani</span>
              <i className="fas fa-caret-down"></i>
            </button>
            <div className="dropdown-menu">
              <a href="#">Edit Profile</a>
              <a href="#">Change Password</a>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>

          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div className="sidebar" id="sidebar">
        <div className="toggle-btn" onClick={toggleSidebar}>
          <i className="fas fa-angle-double-left"></i>
        </div>
        <ul>
          <li><a href="#"><i className="fas fa-home"></i><span>Home</span></a></li>
          <li><a href="#"><i className="fas fa-user-graduate"></i><span>My Class</span></a></li>
          <li><a href="#"><i className="fas fa-pen"></i><span>Marks Entry</span></a></li>
          <li><a href="#"><i className="fas fa-chart-bar"></i><span>Reports</span></a></li>
          <li><a href="#"><i className="fas fa-trophy"></i><span>Leaderboard Quiz</span></a></li>
          <li><a href="#"><i className="fas fa-chalkboard-teacher"></i><span>Teacher Corner</span></a></li>
          <li><a href="#"><i className="fas fa-book"></i><span>Learning Tools</span></a></li>
          <li><a href="#"><i className="fas fa-tasks"></i><span>Assessments</span></a></li>
          <li><a href="#"><i className="fas fa-bookmark"></i><span>Bookmark</span></a></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h1>Welcome Admin</h1>
        </div>

        <div className="title-cards" style={{ marginTop: '40px' }}>
          <a href="schoolRegistration.html" style={{ textDecoration: 'none' }}>
            <div className="title-card school-registration">School Registration</div>
          </a>
          <a href="exams.html" style={{ textDecoration: 'none' }}>
            <div className="title-card examinations">Examinations</div>
          </a>
          <a href="results.html" style={{ textDecoration: 'none' }}>
            <div className="title-card results">Results</div>
          </a>
        </div>
      </div>

      {/* Calendar Component */}
      <Calendar />
    </div>
  );
};

export default SuperAdmin;

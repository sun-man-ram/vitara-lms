import React from 'react';
import '../../styles/admin.css';
import Calendar from '../../components/Calendar.jsx';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from '../../components/Header2.jsx';
import Sidebar from '../../components/Sidebar.jsx';

const SuperAdmin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    console.log("Logging out...");
    navigate('/login', { replace: true });
  };

  return (
    <div>
      <Header onLogout={handleLogout} />
      <Sidebar />

      {/* Main Content */}
      <div className="main-content">
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h1>Welcome Admin</h1>
        </div>

        <div className="title-cards" style={{ marginTop: '40px' }}>
          <Link to="/school-registration" style={{ textDecoration: 'none' }}>
            <div className="title-card school-registration">School Registration</div>
          </Link>
          <Link to="/schools" style={{ textDecoration: 'none' }}>
            <div className="title-card school-registration">My Schools</div>
          </Link>
          <Link to="/class-registration" style={{ textDecoration: 'none' }}>
            <div className="title-card school-registration">Class Registration</div>
          </Link>
          <Link to="/view-classes" style={{ textDecoration: 'none' }}>
            <div className="title-card school-registration">Show Classes</div>
          </Link>
          <Link to="/student-registration" style={{ textDecoration: 'none' }}>
            <div className="title-card school-registration">Add Students</div>
          </Link>
          <Link to="/show-students" style={{ textDecoration: 'none' }}>
            <div className="title-card school-registration">Show Students</div>
          </Link>

          <Link to="/exams" style={{ textDecoration: 'none' }}>
            <div className="title-card examinations">Examinations</div>
          </Link>
          <Link to="/results" style={{ textDecoration: 'none' }}>
            <div className="title-card results">Results</div>
          </Link>
        </div>
      </div>

      {/* Calendar Component */}
      <Calendar />
    </div>
  );
};

export default SuperAdmin;

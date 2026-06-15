//import './Header.css';
import { useNavigate } from 'react-router-dom';

const Header = ({ studentName }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <header className="top-bar">
      <div className="container">
        <div className="logo-text white-text">
          Vitaran <span className="yellow-text">Learning</span>
        </div>
        <div className="nav-buttons">
          <span style={{ color: '#fff', marginRight: '15px' }}>{studentName}</span>
          <button onClick={handleLogout} className="header-button">Log Out</button>
        </div>
      </div>
    </header>
  );
};

export default Header;

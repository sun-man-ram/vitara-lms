import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header2.jsx';
import SchoolForm from '../components/SchoolForm.jsx';
import ExcelUpload from '../components/ExcelUpload.jsx';
import '../styles/schoolRegistration.css';

const SchoolRegistrationPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  const goToSchoolsPage = () => {
    navigate('/schools');
  };

  return (
    <>
      <Header onLogout={handleLogout} />

      <div className="d-flex justify-content-end px-4 mt-3">
        <button className="btn btn-primary" onClick={goToSchoolsPage}>
          Show Schools
        </button>
      </div>

      <main>
        <div className="container p-0">
          <div className="row">
            <ExcelUpload />
            <SchoolForm />
            
          </div>
        </div>
      </main>
    </>
  );
};

export default SchoolRegistrationPage; // ✅ THIS FIXES YOUR ERROR

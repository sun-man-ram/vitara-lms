import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header2.jsx';
import ClassForm from '../components/ClassForm.jsx';
import ClassExcelUpload from '../components/ClassExcelUpload.jsx';
//import '../styles/classRegistration.css';

const ClassRegistrationPage = () => {
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
            <ClassExcelUpload />
            <ClassForm />
          </div>
        </div>
      </main>
    </>
  );
};

export default ClassRegistrationPage;

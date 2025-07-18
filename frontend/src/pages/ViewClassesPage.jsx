import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header2.jsx';
import { useNavigate } from 'react-router-dom';

const ViewClassesPage = () => {
  const navigate = useNavigate();

  const [schoolId, setSchoolId] = useState('');
  const [classes, setClasses] = useState([]);
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5100/api/school/all')
      .then(res => setSchools(res.data))
      .catch(err => console.error('Failed to fetch schools', err));
  }, []);

  const handleFetchClasses = () => {
    if (!schoolId) return;
    axios.get(`http://localhost:5100/api/class/by-school/${schoolId}`)
      .then(res => setClasses(res.data))
      .catch(err => console.error('Failed to fetch classes', err));
  };

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return (
    <>
      {/* ✅ Pass handleLogout to Header */}
      <Header onLogout={handleLogout} />
      
      <div className="container mt-4">
        <h3>Select a School</h3>
        <div className="d-flex gap-2 align-items-center">
          <select
            className="form-select w-50"
            value={schoolId}
            onChange={(e) => setSchoolId(e.target.value)}
          >
            <option value="">-- Choose School --</option>
            {schools.map((school) => (
              <option key={school.schoolId} value={school.schoolId}>
                {school.schoolName} ({school.schoolId})
              </option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={handleFetchClasses}>
            Show Classes
          </button>
        </div>

        {classes.length > 0 && (
          <div className="table-responsive mt-4">
            <table className="table table-bordered table-hover text-center">
              <thead className="table-dark">
                <tr>
                  <th>Class ID</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Course</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((cls) => (
                  <tr key={cls.classId}>
                    <td>{cls.classId}</td>
                    <td>{cls.className}</td>
                    <td>{cls.section}</td>
                    <td>{cls.course}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default ViewClassesPage;

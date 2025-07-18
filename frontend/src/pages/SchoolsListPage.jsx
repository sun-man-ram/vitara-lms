import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header2.jsx';
import '../styles/SchoolsListPage.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const SchoolsListPage = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editSchool, setEditSchool] = useState(null);
  const [selectedSchools, setSelectedSchools] = useState([]);
  const [filterBoard, setFilterBoard] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await axios.get('http://localhost:5100/api/school/all');
        if (Array.isArray(res.data)) {
          setSchools(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch schools:', err);
        alert('Failed to fetch schools');
      }
    };

    fetchSchools();
  }, []);

  const handleToggleStatus = async (schoolId) => {
    try {
      const res = await axios.put(`http://localhost:5100/api/school/toggle/${schoolId}`);
      const updatedStatus = res.data.active;
      setSchools(prev =>
        prev.map(s => (s.schoolId === schoolId ? { ...s, active: updatedStatus } : s))
      );
    } catch (err) {
      console.error('Toggle failed:', err);
      alert('Failed to toggle school status');
    }
  };

  const openEditModal = (school) => {
    setEditSchool(school);
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditSchool(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      const { schoolId, ...updateData } = editSchool;
      const res = await axios.put(`http://localhost:5100/api/school/update/${schoolId}`, updateData);
      const updated = res.data.school;

      setSchools(prev =>
        prev.map(s => (s.schoolId === updated.schoolId ? updated : s))
      );
      setEditModalOpen(false);
    } catch (err) {
      console.error('Edit failed:', err);
      alert('Failed to update school');
    }
  };

  const toggleSchoolSelection = (schoolId) => {
    setSelectedSchools(prev =>
      prev.includes(schoolId)
        ? prev.filter(id => id !== schoolId)
        : [...prev, schoolId]
    );
  };

  const exportToExcel = (filtered) => {
    const exportData = filtered.map(s => ({
      SchoolCode: s.schoolCode, // ✅ Add this line
      SchoolID: s.schoolId,
      Password: s.password,
      Incharge: s.iitFoundationInchargeName,
      Email: s.officialEmail,
      Phone: s.contactNumber
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    const sheetName = prompt('Enter sheet name:', 'Schools');
    const fileName = prompt('Enter filename:', 'school_credentials');
  
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName || 'Schools');
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `${fileName || 'schools'}.xlsx`);
  };


  const filteredSchools = schools.filter(s => {
    const boardMatch = !filterBoard || s.boardOfAffiliation === filterBoard;
    const statusMatch = !filterStatus || (filterStatus === 'active' ? s.active : !s.active);
    return boardMatch && statusMatch;
  });

  return (
    <div className="container pt-3">
      <Header onLogout={handleLogout} />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-primary">🎓 Registered Schools</h2>
        <span className="badge bg-secondary fs-6">Total: {filteredSchools.length}</span>
      </div>

      <div className="d-flex gap-3 mb-3">
        <select className="form-select" value={filterBoard} onChange={e => setFilterBoard(e.target.value)}>
          <option value="">All Boards</option>
          <option value="CBSE">CBSE</option>
          <option value="ICSE">ICSE</option>
          <option value="IB">IB</option>
        </select>
        <select className="form-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="text-end mb-3">
        <button
          className="btn btn-success me-2"
          onClick={() => exportToExcel(schools.filter(s => selectedSchools.includes(s.schoolId)))}
          disabled={selectedSchools.length === 0}
        >
          Export Selected
        </button>
        <button
          className="btn btn-outline-primary"
          onClick={() => exportToExcel(filteredSchools)}
        >
          Export All (Filtered)
        </button>
      </div>

      <div className="table-responsive shadow-sm rounded-3">
        <table className="table table-hover table-striped table-bordered align-middle">
          <thead className="table-dark text-center">
            <tr>
              <th><input type="checkbox" checked={selectedSchools.length === filteredSchools.length} onChange={(e) => setSelectedSchools(e.target.checked ? filteredSchools.map(s => s.schoolId) : [])} /></th>
              <th>School ID</th>
              <th>School Code</th>
              <th>Name</th>
              <th>Board</th>
              <th>Email</th>
              <th>Address</th>
              <th>Incharge</th>
              <th>Status</th>
              <th>Password</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {filteredSchools.map((school) => (
              <tr key={school._id}>
                <td><input type="checkbox" checked={selectedSchools.includes(school.schoolId)} onChange={() => toggleSchoolSelection(school.schoolId)} /></td>
                <td>{school.schoolId}</td>
                <td>{school.schoolCode}</td>
                <td>{school.schoolName}</td>
                <td>{school.boardOfAffiliation}</td>
                <td>{school.officialEmail}</td>
                <td>{school.address}</td>
                <td>{school.iitFoundationInchargeName}</td>
                <td><button className={`btn btn-sm ${school.active ? 'btn-success' : 'btn-danger'}`} onClick={() => handleToggleStatus(school.schoolId)}>{school.active ? 'Active' : 'Inactive'}</button></td>
                <td>{school.password || 'Not Found'}</td>
                <td><button className="btn btn-sm btn-outline-primary" onClick={() => openEditModal(school)}>Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editModalOpen && editSchool && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit School: {editSchool.schoolName}</h5>
                <button type="button" className="btn-close" onClick={() => setEditModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                {['schoolName', 'boardOfAffiliation', 'officialEmail', 'address', 'iitFoundationInchargeName', 'inchargeContactNumber', 'inchargeEmail'].map((field, index) => (
                  <div className="form-group mb-2" key={index}>
                    <label className="form-label text-capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                    <input className="form-control" name={field} value={editSchool[field]} onChange={handleEditChange} />
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditModalOpen(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleEditSubmit}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolsListPage;

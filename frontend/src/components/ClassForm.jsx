import React, { useState } from 'react';
import axios from 'axios';

const ClassForm = () => {
  const [formData, setFormData] = useState({
    schoolId: '',
    className: '',
    section: '',
    course: '',
  });
  const [courses] = useState([
    "Integrated MPC",
    "Integrated MBiPC",
    "Olympiad MPC",
    "Olympiad MBiPC",
    "Advanced MPC",
    "Advanced MBiPC",
    "Revised Advanced MPC",
    "Revised Advanced MBiPC"
  ]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5100/api/class/create', formData);
      alert(res.data.message);
      setFormData({ schoolId: '', className: '', section: '', course: '' });
    } catch (err) {
      console.error(err);
      alert('Class registration failed');
    }
  };

  return (
    <div className="col-12 mb-4">
      <div className="card">
        <div className="card-header bg-primary text-white">New Class Registration</div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>School ID</label>
                <input type="text" name="schoolId" className="form-control" value={formData.schoolId} onChange={handleChange} required />
              </div>
              <div className="form-group col-md-6">
                <label>Class Name</label>
                <input type="text" name="className" className="form-control" value={formData.className} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Section</label>
                <input type="text" name="section" className="form-control" value={formData.section} onChange={handleChange} required />
              </div>
              <div className="form-group col-md-6">
                <label>Course</label>
                <select name="course" className="form-control" value={formData.course} onChange={handleChange} required>
                  <option value="">Select Course</option>
                  {courses.map(course => <option key={course} value={course}>{course}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-success">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClassForm;

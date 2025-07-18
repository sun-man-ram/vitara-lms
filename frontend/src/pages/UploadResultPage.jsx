import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header2.jsx';
import Sidebar from '../components/Sidebar.jsx';

const UploadResultPage = () => {
  const [examId, setExamId] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [file, setFile] = useState(null);
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await axios.get('http://localhost:5100/api/exam/all');
        setExams(res.data);
      } catch (err) {
        console.error('Error fetching exams:', err);
      }
    };
    fetchExams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!examId || !schoolId || !file) return alert('Please select all fields and a file');

    const formData = new FormData();
    formData.append('examId', examId);
    formData.append('schoolId', schoolId);
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5100/api/result/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert('❌ Failed to upload result');
    }
  };

  return (
    <div>
      <Header />
      <Sidebar />
      <div className="main-content container mt-4">
        <h2>📤 Upload Results</h2>
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-4">
            <label className="form-label">Exam</label>
            <select
              className="form-select"
              value={examId}
              onChange={(e) => setExamId(e.target.value)}
            >
              <option value="">-- Select Exam --</option>
              {exams.map((exam) => (
                <option key={exam.examId} value={exam.examId}>
                  {exam.examId} - {exam.course} ({exam.type})
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">School ID</label>
            <input
              type="text"
              className="form-control"
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Excel File</label>
            <input
              type="file"
              accept=".xlsx, .xls"
              className="form-control"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-success">Upload Result</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadResultPage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header2.jsx';
import Sidebar from '../components/Sidebar.jsx';

const ExamsPage = () => {
  const [date, setDate] = useState('');
  const [course, setCourse] = useState('');
  const [type, setType] = useState('');
  const [exams, setExams] = useState([]);

  const fetchExams = async () => {
    try {
      const res = await axios.get('http://localhost:5100/api/exam/all');
      setExams(res.data);
    } catch (err) {
      console.error('Error fetching exams:', err);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    const updateExamStatuses = async () => {
      const today = new Date();
      for (const exam of exams) {
        const examDate = new Date(exam.date);
        if (
          exam.status === 'yet to be conducted' &&
          examDate < today
        ) {
          try {
            await axios.put(`http://localhost:5100/api/exam/update-status/${exam.examId}`, {
              status: 'result yet to upload',
            });
            fetchExams(); // refresh
          } catch (err) {
            console.error('Failed to update exam status:', err);
          }
        }
      }
    };

    if (exams.length) updateExamStatuses();
  }, [exams]);

  const handleCreateExam = async (e) => {
    e.preventDefault();
    if (!date || !course || !type) return alert('Please fill all fields');
    try {
      await axios.post('http://localhost:5100/api/exam/create', {
        date,
        course,
        type,
      });
      alert('✅ Exam created successfully!');
      setDate('');
      setCourse('');
      setType('');
      fetchExams();
    } catch (err) {
      console.error('Error creating exam:', err);
      alert('❌ Failed to create exam');
    }
  };

  const handleDeleteExam = async (examId) => {
    const confirmed = window.confirm(`Are you sure you want to delete Exam ID ${examId}?`);
    if (!confirmed) return;
    try {
      await axios.delete(`http://localhost:5100/api/exam/delete/${examId}`);
      alert(`🗑️ Exam ${examId} deleted successfully`);
      fetchExams();
    } catch (err) {
      console.error('Error deleting exam:', err);
      alert('❌ Failed to delete exam');
    }
  };

  return (
    <div>
      <Header />
      <Sidebar />

      <div className="main-content container mt-4">
        <h2>Create Exam</h2>
        <form className="row g-3 mb-4" onSubmit={handleCreateExam}>
          <div className="col-md-4">
            <label className="form-label">Exam Date</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Course</label>
            <select
              className="form-select"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            >
              <option value="">-- Select Course --</option>
              {[
                'Integrated MPC',
                'Integrated MBiPC',
                'Olympiad MPC',
                'Olympiad MBiPC',
                'Advanced MPC',
                'Advanced MBiPC',
                'Revised Advanced MPC',
                'Revised Advanced MBiPC',
              ].map((c, idx) => (
                <option key={idx} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Exam Type</label>
            <select
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">-- Select Type --</option>
              <option value="mains">Mains</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Create Exam
            </button>
          </div>
        </form>

        <h3>📋 All Exams</h3>
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center">
            <thead className="table-dark">
              <tr>
                <th>Exam ID</th>
                <th>Date</th>
                <th>Course</th>
                <th>Type</th>
                <th>Status</th>
                <th>Created On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam.examId}>
                  <td>{exam.examId}</td>
                  <td>{new Date(exam.date).toLocaleDateString()}</td>
                  <td>{exam.course}</td>
                  <td>{exam.type}</td>
                  <td>{exam.status}</td>
                  <td>{new Date(exam.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteExam(exam.examId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {exams.length === 0 && (
                <tr>
                  <td colSpan="7">No exams created yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExamsPage;

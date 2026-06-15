import { useEffect, useState } from 'react';
import axios from '../../utils/axiosConfig';
import Header from '../../components/Header3';
import ProfileCard from '../../components/ProfileCard';
import ResultCard from '../../components/ResultCard';
import ChartCard from '../../components/ChartCard';
import OverviewCard from '../../components/OverviewCard';
import CalendarPopup from '../../components/CalenderPopup';
import '../../styles/StudentDashboard.css'; // 👈 custom CSS file

const StudentDashboard = () => {
  const [student, setStudent] = useState({});
  const [classInfo, setClassInfo] = useState({});
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [results, setResults] = useState(null);
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/student/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("📘 Student Data:", res.data);
        setStudent(res.data);

        const classRes = await axios.get(`/class/${res.data.classId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("📗 Class Data:", classRes.data);
        setClassInfo(classRes.data);
      } catch (error) {
        console.error('❌ Error fetching student or class info:', error);
      }
    };

    const fetchExams = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/exam/upcoming', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("📙 Upcoming Exams:", res.data);
        setExams(res.data);
      } catch (error) {
        console.error('❌ Error fetching exams:', error);
      }
    };

    const fetchOverview = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/student/overview', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("📕 Overview:", res.data);
        setOverview(res.data);
      } catch (err) {
        console.error('❌ Error fetching overview:', err);
      }
    };

    fetchStudent();
    fetchExams();
    fetchOverview();
  }, []);

  const handleExamSelect = async (examId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/student/results?examId=${examId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("📊 Selected Exam Result:", res.data);
      setResults(res.data);
      setSelectedExamId(examId);
    } catch (error) {
      console.error('❌ Error fetching result:', error);
    }
  };

  return (
    <>
      <Header studentName={student.studentName || 'Student'} />
      <main className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome, {student.studentName}</h1>
          <p>Explore your academic profile and test results.</p>
        </div>

        <div className="dashboard-section">
          <ProfileCard student={student} classInfo={classInfo} exams={exams} onSelect={handleExamSelect} />
        </div>

        {results && (
          <div className="dashboard-section side-by-side">
            <ResultCard result={results} />
            <ChartCard result={results} />
          </div>
        )}

        {overview && (
          <div className="dashboard-section">
            <OverviewCard overview={overview} />
          </div>
        )}

        <div className="dashboard-section">
          <CalendarPopup exams={exams} />
        </div>
      </main>
    </>
  );
};

export default StudentDashboard;

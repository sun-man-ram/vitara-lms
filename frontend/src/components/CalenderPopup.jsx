import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';

const CalendarPopup = () => {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/exam/upcoming', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExams(res.data);
      } catch (err) {
        console.error('Error fetching upcoming exams:', err);
      }
    };

    fetchExams();
  }, []);

  if (!exams.length) return <div>No upcoming exams.</div>;

  return (
    <section className="calendar-popup">
      <h2>Upcoming Tests</h2>
      <ul>
        {exams.map((exam) => (
          <li key={exam.examId}>
            {new Date(exam.date).toLocaleDateString()} — {exam.course}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CalendarPopup;

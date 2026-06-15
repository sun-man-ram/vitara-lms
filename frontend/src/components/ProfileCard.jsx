import React from 'react';

const ProfileCard = ({ student, classInfo, exams, onSelect }) => {
  return (
    <section className="card profile-card">
      <h2>Student Profile</h2>
      <p><strong>Name:</strong> {student.studentName}</p>
      <p><strong>Class:</strong> {classInfo.className} - {classInfo.section}</p>
      <p><strong>Course:</strong> {classInfo.course}</p>

      <label htmlFor="examSelect">Select Exam:</label>
      <select id="examSelect" onChange={(e) => onSelect(e.target.value)} defaultValue="">
        <option value="" disabled>Select Exam</option>
        {exams.map(exam => (
          <option key={exam.examId} value={exam.examId}>
            {new Date(exam.date).toLocaleDateString()} — {exam.course}
          </option>
        ))}
      </select>
    </section>
  );
};

export default ProfileCard;

import React from 'react';

const ResultCard = ({ result }) => {
  if (!result) return null;

  const getGrade = (score) => {
    return score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D';
  };

  const subjects = Object.entries(result.marks || {});

  return (
    <section className="card result-card small-card">
      <h2>Subject-wise Scores</h2>
      <table className="score-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Marks</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map(([subject, marks]) => (
            <tr key={subject} className={marks < 40 ? 'weak' : ''}>
              <td>{subject.toUpperCase()}</td>
              <td>{marks}</td>
              <td>{getGrade(marks)}</td>
            </tr>
          ))}
          <tr className="total">
            <td>Total</td>
            <td colSpan="2">
              <strong>{result.total} / {result.maxMarks * subjects.length}</strong>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="ranks">
        <h3>Ranks</h3>
        <ul>
          <li>Section Rank: <strong>{result.sectionRank}</strong></li>
          <li>Class Rank: <strong>{result.classRank}</strong></li>
          <li>Overall Rank: <strong>{result.overallRank}</strong></li>
        </ul>
      </div>
    </section>
  );
};

export default ResultCard;

import React from 'react';

const OverviewCard = ({ overview }) => {
  if (!overview) return null;

  return (
    <section className="overview-card">
      <div className="overview-item">
        <h4>Total Tests</h4>
        <p>{overview.totalTests}</p>
      </div>
      <div className="overview-item">
        <h4>Average Score</h4>
        <p>{overview.averageScore}%</p>
      </div>
      <div className="overview-item">
        <h4>Best Subject</h4>
        <p>{overview.bestSubject}</p>
      </div>
      <div className="overview-item">
        <h4>Weakest Subject</h4>
        <p>{overview.weakestSubject}</p>
      </div>
    </section>
  );
};

export default OverviewCard;

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ChartCard = ({ result }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (!result || !chartRef.current) return;

    const subjects = Object.keys(result.marks || {});
    const scores = subjects.map((s) => result.marks[s]);

    const ctx = chartRef.current.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: subjects.map((s) => s.toUpperCase()),
        datasets: [
          {
            label: 'Scores',
            data: scores,
            backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#f44336'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [result]);

  if (!result) return <div className="card chart-card small-card">No chart data</div>;

  return (
    <div className="card chart-card small-card">
      <h2>Graphical Analysis</h2>
      <div className="chart-wrapper">
        <canvas ref={chartRef} width="200" height="200"></canvas>
      </div>
    </div>
  );
};

export default ChartCard;

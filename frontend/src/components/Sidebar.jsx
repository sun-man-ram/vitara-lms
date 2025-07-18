import React from 'react';

const Sidebar = () => {
  const toggleSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
    const icon = sidebar.querySelector('.toggle-btn i');
    icon.classList.toggle('fa-angle-double-left');
    icon.classList.toggle('fa-angle-double-right');
  };

  return (
    <div className="sidebar" id="sidebar">
      <div className="toggle-btn" onClick={toggleSidebar}>
        <i className="fas fa-angle-double-left"></i>
      </div>
      <ul>
        <li><a href="#"><i className="fas fa-home"></i><span>Home</span></a></li>
        <li><a href="#"><i className="fas fa-user-graduate"></i><span>My Class</span></a></li>
        <li><a href="#"><i className="fas fa-pen"></i><span>Marks Entry</span></a></li>
        <li><a href="#"><i className="fas fa-chart-bar"></i><span>Reports</span></a></li>
        <li><a href="#"><i className="fas fa-trophy"></i><span>Leaderboard Quiz</span></a></li>
        <li><a href="#"><i className="fas fa-chalkboard-teacher"></i><span>Teacher Corner</span></a></li>
        <li><a href="#"><i className="fas fa-book"></i><span>Learning Tools</span></a></li>
        <li><a href="#"><i className="fas fa-tasks"></i><span>Assessments</span></a></li>
        <li><a href="#"><i className="fas fa-bookmark"></i><span>Bookmark</span></a></li>
      </ul>
    </div>
  );
};

export default Sidebar;

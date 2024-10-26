// src/components/Dashboard.js
import React from 'react';

function Dashboard() {
  return (
    <div className="dashboard">
      <h2>Welcome to the Football Championship Management System</h2>
      <section>
        <h3>Manage Teams</h3>
        {/* Tùy chọn: Hiển thị thông tin về các đội */}
      </section>
      <section>
        <h3>Upcoming Matches</h3>
        {/* Tùy chọn: Hiển thị các trận đấu sắp diễn ra */}
      </section>
      <section>
        <h3>League Standings</h3>
        {/* Tùy chọn: Hiển thị bảng xếp hạng */}
      </section>
    </div>
  );
}

export default Dashboard;

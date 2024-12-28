import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Teams.css";

function Teams({
  teams: initialTeams, 
  onDeleteTeam,
  API_URL
}) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [allTeams, setAllTeams] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const teamsPerPage = 4;

  // Fetch all teams when the component mounts
  useEffect(() => {
    const fetchAllTeams = async () => {
      try { 
        const response = await fetch(`${API_URL}/doi-bong`);
        if (!response.ok) {
          throw new Error('Failed to fetch teams');
        }
        const data = await response.json();
        setAllTeams(data.doiBong);
      } catch (error) {
        console.error('Error fetching teams:', error);
        // Handle error appropriately
      }
    };

    fetchAllTeams();
  }, []); // Empty dependency array means this runs once on mount

  // Update filtered teams when the search term changes
  useEffect(() => {
    // The filtering logic remains the same
    setCurrentPage(1); // Reset to the first page when the filter changes
  }, [searchTerm]);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa đội bóng này?"
    );
    if (confirmDelete) {
      onDeleteTeam(id);
    }
  };

  const handleToPlayer = (id) => {
    navigate(`/doi-bong/${id}/cau-thu`);
  };

  const handleEdit = (id) => {
    navigate(`/doi-bong/${id}/edit`);
  };

  const clearSearch = () => setSearchTerm("");

  // Get filtered teams for the current page
  const indexOfLastTeam = currentPage * teamsPerPage;
  const indexOfFirstTeam = indexOfLastTeam - teamsPerPage;
  const term = searchTerm.trim().toLowerCase();
  const currentTeams = allTeams
    .filter((team) => team.TenDoiBong.toLowerCase().includes(term))
    .slice(indexOfFirstTeam, indexOfLastTeam);

  const totalTeams = allTeams.filter((team) =>
    team.TenDoiBong.toLowerCase().includes(term)
  ).length;
  const totalPages = Math.ceil(totalTeams / teamsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={currentPage === i ? "active" : ""}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="teams">
      <h2>Danh sách đội bóng</h2>
      <Link to="/tao-moi/doi-bong" className="add-player-button">
        Thêm đội bóng mới
      </Link>
      <div className="search-container">
        <div className="search-input-wrapper">
          <p>Tìm kiếm</p>
          <input
            type="text"
            placeholder="Tìm kiếm đội bóng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={clearSearch}>
              ✕
            </button>
          )}
        </div>
      </div>

      {currentTeams.length > 0 ? (
        <>
          <ul>
            {currentTeams.map((team) => (
              <li key={team.MaDoiBong}>
                <h3>
                  <Link to={`/doi-bong/${team.MaDoiBong}`}>{team.TenDoiBong}</Link>
                </h3>
                <p>Thành phố: {team.ThanhPhoTrucThuoc}</p>
                <p>Sân nhà: {team.MaSan ? team.TenSan : "Chưa xác định"}</p>
                <div className="actions">
                  <button
                    className="toplayer"
                    onClick={() => handleToPlayer(team.MaDoiBong)}
                  >
                    Cầu thủ
                  </button>
                  <button className="edit" onClick={() => handleEdit(team.MaDoiBong)}>
                    Sửa
                  </button>
                  <button className="delete" onClick={() => handleDelete(team.MaDoiBong)}>
                    Xóa
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {totalPages > 1 && (
            <div className="pagination">
              {renderPageNumbers()}
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <p>Không tìm thấy đội bóng nào.</p>
        </div>
      )}
    </div>
  );
}

export default Teams;
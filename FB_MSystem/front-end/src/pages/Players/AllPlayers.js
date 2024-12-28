import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import PlayerList from "./PlayerList";
import "./Players.css";

function AllPlayers({ API_URL }) {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const playersPerPage = 5; // You can adjust this number
  const maxVisiblePages = 5;

  useEffect(() => {
    const fetchAllPlayers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/cau-thu`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error("Failed to fetch players");
        }
        setPlayers(data.cauThu);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllPlayers();
  }, [API_URL]);

  const handleDeletePlayer = async (playerId) => {
    try {
      const response = await fetch(`${API_URL}/cau-thu/${playerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete player");
      }

      setPlayers((prevPlayers) =>
        prevPlayers.filter((player) => player.MaCauThu !== playerId)
      );
    } catch (error) {
      console.error("Error deleting player:", error);
      setError(error.message);
    }
  };

  const handleNavigate = (player) => {
    navigate(`/cau-thu/${player.MaCauThu}`, { state: { player } });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  const filteredPlayers = useMemo(() => {
    return players.filter((player) =>
      player.TenCauThu.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [players, searchTerm]);

  // Pagination logic
  const indexOfLastPlayer = currentPage * playersPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
  const currentPlayers = useMemo(() => filteredPlayers.slice(indexOfFirstPlayer, indexOfLastPlayer), [filteredPlayers, indexOfFirstPlayer, indexOfLastPlayer]);

  const totalPages = Math.ceil(filteredPlayers.length / playersPerPage);

  const paginate = useCallback((pageNumber) => setCurrentPage(pageNumber), []);

  const renderPageNumbers = useMemo(() => {
    const pageNumbers = [];
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => paginate(i)}
            className={currentPage === i ? "active-page" : "page-button"}
          >
            {i}
          </button>
        );
      }
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, currentPage + Math.floor((maxVisiblePages - 1) / 2));

      if (endPage - startPage + 1 < maxVisiblePages) {
        if (startPage === 1) {
          endPage = Math.min(totalPages, maxVisiblePages);
        } else {
          startPage = Math.max(1, totalPages - maxVisiblePages + 1);
        }
      }

      if (startPage > 1) {
        pageNumbers.push(
          <button key="prev-dots" className="page-button">
            ...
          </button>
        );
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => paginate(i)}
            className={currentPage === i ? "active-page" : "page-button"}
          >
            {i}
          </button>
        );
      }

      if (endPage < totalPages) {
        pageNumbers.push(
          <button key="next-dots" className="page-button">
            ...
          </button>
        );
      }
    }
    return pageNumbers;
  }, [currentPage, paginate, totalPages, maxVisiblePages]);

  return (
    <div className="players-container">
      <h2>Danh sách cầu thủ</h2>

      <Link to="/tao-moi/cau-thu" className="add-player-button">
        Thêm cầu thủ mới
      </Link>

      <input
        type="text"
        placeholder="Tìm kiếm cầu thủ..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />

      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : currentPlayers.length > 0 ? (
        <>
          <PlayerList
            players={currentPlayers}
            onDelete={handleDeletePlayer}
            onNavigate={handleNavigate}
          />
          {totalPages > 1 && (
            <div className="pagination-container">
              {renderPageNumbers}
            </div>
          )}
        </>
      ) : (
        <p>Không tìm thấy cầu thủ phù hợp</p>
      )}
    </div>
  );
}

export default AllPlayers;
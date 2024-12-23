import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import PlayerList from "./PlayerList";
import "./Players.css";

function AllPlayers() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [playersPerPage] = useState(10);

  useEffect(() => {
    const fetchAllPlayers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/players`);
        if (!response.ok) {
          throw new Error("Failed to fetch players");
        }
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPlayers();
  }, []);

  const handleDeletePlayer = async (playerId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/players/${playerId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete player");
      }

      setPlayers((prevPlayers) =>
        prevPlayers.filter((player) => player.id !== playerId)
      );
    } catch (error) {
      console.error("Error deleting player:", error);
      setError(error.message);
    }
  };

  const handleNavigate = (player) => {
    navigate(`/players/${player.id}`, { state: { player } });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPlayer = currentPage * playersPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
  const currentPlayers = filteredPlayers.slice(
    indexOfFirstPlayer,
    indexOfLastPlayer
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="players-container">
      <h2>Danh sách cầu thủ</h2>

      <Link to="/create/player" className="add-player-button">
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
          <Pagination
            playersPerPage={playersPerPage}
            totalPlayers={filteredPlayers.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </>
      ) : (
        <p>Không tìm thấy cầu thủ phù hợp</p>
      )}
    </div>
  );
}

function Pagination({ playersPerPage, totalPlayers, paginate, currentPage }) {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPlayers / playersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <a
              onClick={() => paginate(number)}
              href="#!"
              className={`page-link ${currentPage === number ? "active" : ""}`}
            >
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default AllPlayers;
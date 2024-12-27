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

  useEffect(() => {
    const fetchAllPlayers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/cau-thu`);
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
        `http://localhost:5000/cau-thu/${playerId}`,
        {
          method: "DELETE",
        }
      );

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
  };

  const filteredPlayers = players.filter((player) =>
    player.TenCauThu.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="players-container">
      <h2>Danh sách cầu thủ</h2>

      <Link to="/create/cau-thu" className="add-player-button">
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
      ) : filteredPlayers.length > 0 ? (
        <PlayerList
          players={filteredPlayers}
          onDelete={handleDeletePlayer}
          onNavigate={handleNavigate}
        />
      ) : (
        <p>Không tìm thấy cầu thủ phù hợp</p>
      )}
    </div>
  );
}

export default AllPlayers;
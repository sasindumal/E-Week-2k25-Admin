import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import { Eye, Edit, Trophy, TrendingUp, Users, Target, Calendar } from "lucide-react";
import "./AdminLeaderBoard.css";
import { useNavigate } from "react-router-dom";

const AdminLeaderBoard = () => {
   const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [leaderBoardRows, setLeaderBoardRows] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const navigate= useNavigate();
  
  const handleEditPoints = (team,points) => {
    navigate(`/admin/edit-points/${team}/${points}`); // Navigate to edit points page with team name
  };
  
  const fetchUpcomingEvents = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/createEvents/UpcomingEvents`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch upcoming events: ${response.status}`);
      }
      const data = await response.json();
      setUpcomingEvents(data);
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      setUpcomingEvents([]);
    }
  };

useEffect(() => {
  // Removed authentication check - anyone can access
  console.log("AdminLeaderBoard page accessed");
}, []);

  useEffect(() => {
    const fetchLeaderBoard = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/LeaderBoard/getLeaderBoard`);
        if (!response.ok) {
          throw new Error(`Failed to fetch leaderboard data: ${response.status}`);
        }
        const data = await response.json();
        const teams = ["E21", "E22", "E23", "E24", "Staff"];
        const teamData = teams.map((team) => {
          const rankArray = data[`${team}Rank`] || [];
          const totalWonEvents = rankArray.filter(
            (rank) => rank && rank.toLowerCase() === "winners"
          ).length;
          const members = team === "Staff" ? Math.floor(Math.random() * 5) + 15 : Math.floor(Math.random() * 10) + 40;

          return {
            team,
            members,
            points: data[`${team}Points`] || 0,
            totalWonEvents,
            podiums: rankArray.filter(
              (rank) => rank && rank.toLowerCase() !== "thirdrunnerup"
            ).length,
            improvement: data[`${team}Improvement`] || 0,
          };
        });

        const sortedTeams = teamData.sort((a, b) => b.points - a.points);
        setLeaderBoardRows(sortedTeams);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        // Set empty array as fallback
        setLeaderBoardRows([]);
        alert("Failed to load leaderboard data. Please try refreshing the page.");
      }
    };

    fetchLeaderBoard();
    fetchUpcomingEvents();
  }, []);

  const getRowBackground = (rank) => {
    if (rank === 1)
      return "linear-gradient(90deg, #4a2c0a 0%, #7a4f1a 100%)"; // Gold-brown
    if (rank === 2)
      return "linear-gradient(90deg, #2a1a3d 0%, #4a2a5d 100%)"; // Purple
    return "linear-gradient(90deg, #1a1a2e 0%, #2e2e4a 100%)"; // Dark gradient
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Trophy className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Trophy className="w-4 h-4 text-amber-600" />;
    return null;
  };

  return (
    <div className="admin-leaderboard">
      <Sidebar />
      <main className="leaderboard-main">
        {/* Header */}
        <div className="leaderboard-header">
          <h1 className="page-title">Leaderboard Management</h1>
          <p className="page-subtitle">
            Manage competition scores, batch rankings, and event results
          </p>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons-container">
          <button className="action-button primary" title="View Batch Rankings">
            <Trophy className="w-5 h-5" />
            Batch Rankings
          </button>
          <button className="action-button secondary" title="View Event Scores">
            <Target className="w-5 h-5" />
            Event Scores
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon teams">
              <Users className="w-6 h-6" />
            </div>
            <div className="stat-content">
              <div className="stat-number">4</div>
              <div className="stat-label">Active Teams</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon wins">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="stat-content">
              <div className="stat-number">
                {leaderBoardRows.reduce((sum, row) => sum + row.totalWonEvents, 0)}
              </div>
              <div className="stat-label">Total Wins</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon events">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="stat-content">
              <div className="stat-number">{upcomingEvents.length}</div>
              <div className="stat-label">Events to Win</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon improvement">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="stat-content">
              <div className="stat-number">
                {leaderBoardRows.length > 0 
                  ? Math.round(leaderBoardRows.reduce((sum, row) => sum + row.improvement, 0) / leaderBoardRows.length)
                  : 0
                }%
              </div>
              <div className="stat-label">Avg Improvement</div>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="leaderboard-container">
          <div className="table-header">
            <h2 className="table-title">Team Rankings</h2>
            <p className="table-subtitle">Current standings and performance metrics</p>
          </div>
          
          <div className="leaderboard-table-wrapper">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Batch</th>
                  <th>Total Points</th>
                  <th>Events Won</th>
                  <th>Podiums</th>
                  <th>Improvement</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {leaderBoardRows.map((row, i) => {
                  const rank = i + 1;
                  const bgValue = getRowBackground(rank);

                  return (
                    <tr
                      key={row.team}
                      className="leaderboard-row"
                      style={{
                        background: bgValue,
                        borderRadius: "12px",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <td className="rank-cell">
                        <div className="rank-content">
                          {getRankIcon(rank)}
                          <span className="rank-number">#{rank}</span>
                        </div>
                      </td>
                      <td className="team-cell">
                        <div className="team-info">
                          <div className="team-name">{row.team}</div>
                          <div className="team-members">{row.members} members</div>
                        </div>
                      </td>
                      <td className="points-cell">
                        <div className="points-content">
                          <div className="points-value">{row.points.toLocaleString()}</div>
                          <div className={`improvement-badge ${row.improvement >= 0 ? 'positive' : 'negative'}`}>
                            {row.improvement >= 0
                              ? `+${row.improvement.toFixed(1)}%`
                              : `${row.improvement.toFixed(1)}%`}
                          </div>
                        </div>
                      </td>
                      <td className="wins-cell">
                        <div className="wins-badge">
                          {row.totalWonEvents}
                        </div>
                      </td>
                      <td className="podiums-cell">
                        <div className="podiums-badge">
                          {row.podiums}
                        </div>
                      </td>
                      <td className="improvement-cell">
                        <div className={`improvement-indicator ${row.improvement >= 0 ? 'positive' : 'negative'}`}>
                          <TrendingUp className="w-4 h-4" />
                          <span>{row.improvement >= 0
                            ? `+${row.improvement.toFixed(1)}%`
                            : `${row.improvement.toFixed(1)}%`}
                          </span>
                        </div>
                      </td>
                      <td className="actions-cell">
                        <div className="action-buttons">
                          <button
                            className="action-button view"
                            title="View Details"
                            type="button"
                          >
                            <Eye size={20} />
                          </button>
                          <button 
                            onClick={() => handleEditPoints(row.team,row.points)}
                            className="action-button edit"
                            title="Edit Points"
                            type="button"
                          >
                            <Edit size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLeaderBoard;

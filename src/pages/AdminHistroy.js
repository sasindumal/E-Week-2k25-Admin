import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar"; // Assuming Sidebar is in the same directory
import { History, Plus, Edit, Trash2, Eye, RefreshCw, FileText, Trophy, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminHistory = () => {
  const navigate = useNavigate();
   const BASE_URL = process.env.REACT_APP_BASE_URL;
  useEffect(() => {
  const fetchAdminData = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const res = await fetch(`${BASE_URL}/api/EweekLogin/admin`, {
      headers: { Authorization:`Bearer ${token}`},
    });
    
    if (res.status === 401) {
      localStorage.removeItem("adminToken");
      navigate("/login");
    } else {
      const data = await res.json();
      console.log(data.message);
    }
  };

  fetchAdminData();
}, []);


  const [histroy, setHistroy] = useState([]); // initialize as array
  const AllHistroy = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/EweekHistroy/getEweekHistroy`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setHistroy(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

 

  // Call on component mount
  useEffect(() => {
    AllHistroy();
  }, []);

  const [historyData, setHistoryData] = useState([
    {
      id: 1,
      year: "2024",
      title: "E-Week 2024",
      theme: "Innovation Beyond Boundaries",
      overallChampion: "E20",
      totalEvents: 25,
      totalParticipants: 1200,
      status: "completed",
      highlights: [
        "First virtual-hybrid event format",
        "Record participation of 1200+ students",
        "Introduction of AI/ML competitions",
      ],
      champions: {
        "Programming Contest": "E20 - Code Warriors",
        "Robotics Championship": "E21 - Mech Masters",
        "Design Competition": "E22 - Creative Minds",
        "Gaming Tournament": "E20 - Pro Gamers",
      },
      statistics: {
        events: 25,
        participants: 1200,
        prizes: "$50,000",
        sponsors: 15,
      },
    },
    {
      id: 2,
      year: "2023",
      title: "E-Week 2023",
      theme: "Engineering the Future",
      overallChampion: "E19",
      totalEvents: 22,
      totalParticipants: 950,
      status: "completed",
      highlights: [
        "Return to in-person events",
        "Launch of startup pitch competition",
        "International collaboration events",
      ],
      champions: {
        "Programming Contest": "E19 - Binary Blazers",
        "Robotics Championship": "E20 - Tech Titans",
        "Design Competition": "E19 - Design Dynamos",
        "Gaming Tournament": "E21 - Game Changers",
      },
      statistics: {
        events: 22,
        participants: 950,
        prizes: "$35,000",
        sponsors: 12,
      },
    },
    {
      id: 3,
      year: "2022",
      title: "E-Week 2022",
      theme: "Digital Transformation",
      overallChampion: "E18",
      totalEvents: 20,
      totalParticipants: 800,
      status: "completed",
      highlights: [
        "First fully digital E-Week",
        "Global online participation",
        "Virtual reality competitions",
      ],
      champions: {
        "Programming Contest": "E18 - Digital Warriors",
        "Robotics Championship": "E19 - Robo Revolution",
        "Design Competition": "E18 - Pixel Pioneers",
        "Gaming Tournament": "E18 - Virtual Victors",
      },
      statistics: {
        events: 20,
        participants: 800,
        prizes: "$25,000",
        sponsors: 10,
      },
    },
  ]);

  const [activeTab, setActiveTab] = useState("years");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const handleDeleteYear = async (_id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/EweekHistroy/deleteEweekHistoryById`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: _id }),
      });
      AllHistroy();

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete event");
      }
    } catch (error) {
      console.error("Delete event error:", error);
      alert("Failed to delete event: " + error.message);
    }
  };

 const handleEditYear = (id) => {
  navigate(`/admin/editHistroy/${id}`);
};


  const handleAdd = () => {
    navigate("/admin/addHistroy");
  };

  const filteredHistory = histroy.filter((year) => {
    const matchesSearch =
      (year.eventName && year.eventName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (year.description && year.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (year.winners && year.winners.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === "all" || year.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-section">
      <Sidebar />
      <main>
        <div style={{ marginLeft: "240px", padding: "2rem", color: "red" }}>
          <div className="section-header">
            <div className="header-content">
              <h1>History Management</h1>
              <p className="section-description">
                Manage E-Week legacy data, champion records, and historical achievements
              </p>
            </div>
            <div className="header-actions">
              <button className="action-btn secondary" onClick={() => console.log("Update archives")}>
                <RefreshCw className="w-4 h-4" />
                Update Archives
              </button>
              <button className="action-btn secondary">
                <FileText className="w-4 h-4" />
                Export History
              </button>
              <button className="action-btn primary" onClick={handleAdd}>
                <Plus className="w-4 h-4" />
                Add Year Record
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button className={`tab-button ${activeTab === "years" ? "active" : ""}`} onClick={() => setActiveTab("years")}>
              <History className="w-4 h-4" />
              <span>Year Records</span>
            </button>
            <button className={`tab-button ${activeTab === "champions" ? "active" : ""}`} onClick={() => setActiveTab("champions")}>
              <Trophy className="w-4 h-4" />
              <span>Champions</span>
            </button>
          </div>

          {/* Controls */}
          <div className="section-controls">
            <div className="search-bar">
              <Search className="w-4 h-4" />
              <input
                type="text"
                placeholder="Search years, themes, or champions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-controls">
              <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="ongoing">Ongoing</option>
                <option value="planned">Planned</option>
              </select>
            </div>
          </div>

          {/* Statistics */}
          <div className="history-stats">
            <div className="history-stat">
              <span className="stat-number">{histroy.length}</span>
              <span className="stat-label">Total Years</span>
            </div>
            <div className="history-stat">
              <span className="stat-number">
                {histroy.reduce((sum, y) => sum + (y.events ? y.events.length : 0), 0)}
              </span>
              <span className="stat-label">Total Events</span>
            </div>
            <div className="history-stat">
              <span className="stat-number">
                {histroy.reduce((sum, y) => sum + (y.totalParticipants || 0), 0)}
              </span>
              <span className="stat-label">Total Participants</span>
            </div>
            <div className="history-stat">
              <span className="stat-number">
                {histroy.filter((y) => y.status?.toLowerCase() === "completed" || y.status?.toLowerCase() === "finished").length}
              </span>
              <span className="stat-label">Completed Years</span>
            </div>
          </div>

          {activeTab === "years" && (
            <div className="history-timeline">
              {filteredHistory.map((year) => (
                <div key={year._id} className="history-card">
                  <div className="history-header">
                    <div className="year-info">
                      <h3 className="year-title">{year.eventName}</h3>
                      <p className="year-theme">"{year.description}"</p>
                      <div className="year-meta">
                        <span className="year-badge">Started:{year.Startdate ? new Date(year.Startdate).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "-"}</span>
                        <span className="year-badge">Ended:{year.Enddate ? new Date(year.Enddate).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "-"}</span>
                       
                        <span className="champion-badge">🏆 {year.winners}</span>
                      </div>
                    </div>
                    <div className="history-actions">
                      <button className="action-icon" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="action-icon" title="Edit Year" onClick={() => handleEditYear(year._id)}>
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="action-icon danger" title="Delete Year" onClick={() => handleDeleteYear(year._id)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="history-content">
                    <div className="statistics-grid">
                      <div className="stat-item">
                        <span className="stat-value">{year.events ? year.events.length : 0}</span>
                        <span className="stat-name">Events</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">{year.totalParticipants || 0}</span>
                        <span className="stat-name">Participants</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">{year.statistics?.prizes || "-"}</span>
                        <span className="stat-name">Prizes</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">{year.sponsors && year.sponsors.length > 0 ? year.sponsors[0] : "-"}</span>
                        <span className="stat-name">Sponsors</span>
                      </div>
                    </div>

                    <div className="highlights-section">
                      <h4>Key Highlights</h4>
                      <ul className="highlights-list">
                        {year.Highlights || "No highlights available"}
                      </ul>
                    </div>

                    <div className="champions-section">
                      <h4>Event Champions</h4>
                      <div className="champions-grid">
                        {year.events && year.events.length > 0 ? (
                          year.events.map((ev, idx) => (
                            <div key={idx} className="champion-item">
                              <span className="event-name">{ev.title}</span>
                              <span className="champion-name">{ev.winners || "-"}</span>
                            </div>
                          ))
                        ) : (
                          <p>No events available</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "champions" && (
            <div className="champions-overview">
              <div className="champions-grid">
                {historyData.map((year) => (
                  <div key={year.id} className="year-champions-card">
                    <div className="champions-header">
                      <h3>{year.year} Champions</h3>
                      <span className="overall-champion">🏆 {year.overallChampion}</span>
                    </div>
                    <div className="champions-list">
                      {Object.entries(year.champions).map(([event, champion]) => (
                        <div key={event} className="champion-row">
                          <span className="event-title">{event}</span>
                          <span className="champion-team">{champion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredHistory.length === 0 && (
            <div className="empty-state">
              <History className="w-16 h-16" />
              <h3>No history records found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminHistory;

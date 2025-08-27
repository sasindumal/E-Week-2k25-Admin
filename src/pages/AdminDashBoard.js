import Sidebar from "./sidebar"; // Adjust path if needed
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Ensure you have react-router-dom installed

import {
  LayoutDashboard,
  Calendar,
  Trophy,
  Users,
  
 
  Upload,
  Activity,
  
  
  CheckCircle,
  
  MapPin,
  Target,
  Zap,
 
} from "lucide-react";

const AdminDashBoard = () => {

  



   const Navigate = useNavigate();
 const BASE_URL = process.env.REACT_APP_BASE_URL;
   useEffect(() => {
  const fetchAdminData = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      Navigate("/login");
      return;
    }
    console.log("Token:", token);
    
    const res = await fetch(`${BASE_URL}/api/EweekLogin/admin`, {
  method: "POST", // use POST to send a body
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ token }), // send token in body
  
});


    if (res.status === 401) {
      localStorage.removeItem("adminToken");
      Navigate("/login");
    } else {
      const data = await res.json();
     
    }
  };

  fetchAdminData();
}, []);



  const [upcoming, setUpcoming] = useState([]);
  const [live, setLive] = useState([]);
  const [finished, setFinished] = useState([]);
  const [refreshing, setRefreshing] = useState(false);


  const fetchUpcomingEvents = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/createEvents/UpcomingEvents`);
        if (!response.ok) {
          throw new Error("Failed to fetch upcoming events");
        }
        const data = await response.json();
        setUpcoming(data);
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      }
    };
  
    const fetchLiveEvents = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/createEvents/LiveEvents`);
        if (!response.ok) {
          throw new Error("Failed to fetch upcoming events");
        }
        const data = await response.json();
        setLive(data);
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      }
    };
  
     const fetchFinishedEvents = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/createEvents/FinishedEvents`);
        if (!response.ok) {
          throw new Error("Failed to fetch upcoming events");
        }
        const data = await response.json();
        setFinished(data);
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      }
    };
  
  useEffect(() => {
    fetchUpcomingEvents();
    fetchLiveEvents();
    fetchFinishedEvents();
   
  }, []);

  const handleQuickAction = (action) => {
    switch (action) {
      case "View All Events":
        console.log("Viewing all events");
        Navigate("/admin/ManageEvents");
        break;
      case "View Event Results":
        console.log("Viewing participants");
        Navigate("/admin/ManageEvents");
        break;
      case "Add Event":
        console.log("Viewing participants");
        Navigate("/admin/EventForm");
        break;
      case "Update Scores":
        console.log("Updating scores");
        Navigate("/admin/leaderboard");
        break;
      default:
        console.log("Unknown action");
    }
  };


     const daysRemaining = (eventDate) => {
  const today = new Date(); 
  const targetDate = new Date(eventDate);

  // Difference in milliseconds
  const diffTime = targetDate - today;

  // Convert ms → days
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

  return (
    <div style={{ minHeight: "100vh" }}>
      <Sidebar />
      <main
        style={{
          marginLeft: "240px", // <-- IMPORTANT if sidebar fixed width 240px & fixed position
          padding: "2rem",
          color: "red",
          backgroundColor: "#121212",
        }}
      >
        <h1>Admin Dashboard</h1>
        <p style={{ color: "white" }}>
           Welcome back! Here's what's happening with E-Week 2025.
        </p>

              {/* Enhanced Stats Grid */}
      <div className="stats-grid">
        <div
          className="stat-card clickable"
          onClick={() => handleQuickAction("View Events")}
        >
          <div className="stat-icon events">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="stat-content">
            <div className="stat-header">
              <h3>{upcoming.length+live.length+live.length}</h3>
              <div className="stat-trend positive">
                <Zap className="w-4 h-4" />
                <span>+12</span>
              </div>
            </div>
            <p>Total Events</p>
            <div className="stat-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "75%" }}></div>
              </div>
              <span className="progress-text">75% completion rate</span>
            </div>
          </div>
        </div>
        <div
          className="stat-card clickable"
          onClick={() => handleQuickAction("View Participants")}
        >
          <div className="stat-icon participants">
            <Users className="w-6 h-6" />
          </div>
          <div className="stat-content">
            <div className="stat-header">
              <h3>{600}</h3>
              <div className="stat-trend positive">
                <Target className="w-4 h-4" />
                <span>+{2.5}%</span>
              </div>
            </div>
            <p>Total Participants</p>
            <div className="stat-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "88%" }}></div>
              </div>
              <span className="progress-text">88% engagement rate</span>
            </div>
          </div>
        </div>
        <div
          className="stat-card clickable"
          onClick={() => handleQuickAction("View Live Events")}
        >
          <div className="stat-icon active">
            <Activity className="w-6 h-6" />
          </div>
          <div className="stat-content">
            <div className="stat-header">
              <h3>{live.length}</h3>
              <div className="stat-trend live">LIVE</div>
            </div>
            <p>Active Events</p>
            <div className="stat-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill active"
                  style={{ width: "100%" }}
                ></div>
              </div>
              <span className="progress-text">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
       {/* Enhanced Content Grid */}
      <div className="dashboard-content">
        {/* Upcoming Events */}
        <div className="content-card events-card">
          <div className="card-header">
            <h3>Upcoming Events</h3>
            <div className="header-actions">
              <button
                className="view-all"
                onClick={() => handleQuickAction("View All Events")}
              >
                View All
              </button>
            </div>
          </div>
          <div className="events-list">
            {upcoming.map((event) => (
              <div key={event._id} className="event-item upcoming">
                <div className="event-info">
                  <div className="event-main">
                    <h4 className="event-name">{event.title}</h4>
                    <div className="event-meta">
                      <span className="event-date">
                        <Calendar className="w-3 h-3" />
                        {new Date(event.date).toLocaleDateString()} at{" "}
                        {event.time}
                      </span>
                      <span className="event-location">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </span>
                    </div>
                  </div>
                  <div className="event-stats">
                    <div className="participants-stat">
                      <span className="stat-value">
                        {event.MaxNoOfParticipantsPerTeam===0
                          ? "All can Participate"
                          : event.MaxNoOfParticipantsPerTeam * event.maxTeamsPerBatch}
                      </span>
                      <span className="stat-label">Participants</span>
                    </div>
                    <div className="days-left">
                      <span>{daysRemaining(event.date)} days remaining</span>
                      
                    </div>
                  </div>
                </div>
                <div className="event-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${(event.participants / event.maxParticipants) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="progress-text">
                  
                    
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

          {/* Completed Events */}
        <div className="content-card events-card">
          <div className="card-header">
            <h3>Recent Completed Events</h3>
            <div className="header-actions">
              <button
                className="view-all"
                onClick={() => handleQuickAction("View Event Results")}
              >
                View Results
              </button>
            </div>
          </div>
          <div className="events-list">
            {finished.slice(0, 5).map((event) => (
              <div key={event._id} className="event-item completed">
                <div className="event-info">
                  <div className="event-main">
                    <h4 className="event-name">{event.title}</h4>
                    <div className="event-meta">
                      <span className="event-date">
                        <CheckCircle className="w-3 h-3" />
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      <span className="event-winner">
                        <Trophy className="w-3 h-3" />
                        {event.winners}
                      </span>
                    </div>
                  </div>
                  <div className="event-stats">
                    <div className="participants-stat">
                      <span className="stat-value">{event.MaxNoOfParticipantsPerTeam===0
                        ?"All can Participate"
                      :event.MaxNoOfParticipantsPerTeam * event.maxTeamsPerBatch}</span>
                      <span className="stat-label">Participants</span>
                    </div>
                 
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="content-card quick-actions-card">
          <div className="card-header">
            <h3>Quick Actions</h3>
            <span className="card-subtitle">Most used admin tasks</span>
          </div>
          <div className="quick-actions">
            <button
              className="quick-action primary"
              onClick={() => handleQuickAction("Add Event")}
            >
              <div className="action-icon">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="action-content">
                <span className="action-title">Add Event</span>
                <span className="action-description">
                  Create new competition
                </span>
              </div>
            </button>
            <button
              className="quick-action"
              onClick={() => handleQuickAction("Upload Images")}
            >
              <div className="action-icon">
                <Upload className="w-5 h-5" />
              </div>
              <div className="action-content">
                <span className="action-title">Upload Images</span>
                <span className="action-description">Add to gallery</span>
              </div>
            </button>
            <button
              className="quick-action"
              onClick={() => handleQuickAction("Update Scores")}
            >
              <div className="action-icon">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="action-content">
                <span className="action-title">Update Scores</span>
                <span className="action-description">Manage leaderboard</span>
              </div>
            </button>
            <button
              className="quick-action"
              onClick={() => handleQuickAction("Add Participant")}
            >
              <div className="action-icon">
                <Users className="w-5 h-5" />
              </div>
              <div className="action-content">
                <span className="action-title">Add Participant</span>
                <span className="action-description">Register new user</span>
              </div>
            </button>
          </div>
        </div>
        </div>
        </main>
    </div>
  );
};

export default AdminDashBoard;

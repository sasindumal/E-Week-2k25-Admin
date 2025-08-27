import Sidebar from "./sidebar"; // Adjust path if needed
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Ensure you have react-router-dom installed
import "./AdminDashBoard.css";

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
  Plus,
  BarChart3,
  TrendingUp,
  Clock,
  Award,
  Star,
} from "lucide-react";

const AdminDashBoard = () => {
   const Navigate = useNavigate();
 const BASE_URL = process.env.REACT_APP_BASE_URL;
   useEffect(() => {
  // Removed authentication check - anyone can access admin dashboard
  console.log("Admin dashboard accessed");
}, []);

  const [upcoming, setUpcoming] = useState([]);
  const [live, setLive] = useState([]);
  const [finished, setFinished] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUpcomingEvents = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/createEvents/UpcomingEvents`);
        if (!response.ok) {
          throw new Error(`Failed to fetch upcoming events: ${response.status}`);
        }
        const data = await response.json();
        setUpcoming(data);
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
        // Set empty array as fallback
        setUpcoming([]);
      }
    };
  
    const fetchLiveEvents = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/createEvents/LiveEvents`);
        if (!response.ok) {
          throw new Error(`Failed to fetch live events: ${response.status}`);
        }
        const data = await response.json();
        setLive(data);
      } catch (error) {
        console.error("Error fetching live events:", error);
        // Set empty array as fallback
        setLive([]);
      }
    };
  
     const fetchFinishedEvents = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/createEvents/FinishedEvents`);
        if (!response.ok) {
          throw new Error(`Failed to fetch finished events: ${response.status}`);
        }
        const data = await response.json();
        setFinished(data);
      } catch (error) {
        console.error("Error fetching finished events:", error);
        // Set empty array as fallback
        setFinished([]);
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

  const getEventStatusColor = (event) => {
    if (event.status === 'live') return 'text-green-400';
    if (event.status === 'finished') return 'text-gray-400';
    return 'text-blue-400';
  };

  const getEventStatusIcon = (event) => {
    if (event.status === 'live') return <Activity className="w-4 h-4 text-green-400" />;
    if (event.status === 'finished') return <CheckCircle className="w-4 h-4 text-gray-400" />;
    return <Clock className="w-4 h-4 text-blue-400" />;
  };

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <main className="dashboard-main">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">
              Welcome back! Here's what's happening with E-Week 2025.
            </p>
          </div>
          <div className="header-actions">
            <button 
              onClick={() => handleQuickAction("Add Event")}
              className="add-event-btn"
            >
              <Plus className="w-5 h-5" />
              Add Event
            </button>
          </div>
        </div>

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
                <h3 className="stat-number">{upcoming.length + live.length + finished.length}</h3>
                <div className="stat-trend positive">
                  <Zap className="w-4 h-4" />
                  <span>+12</span>
                </div>
              </div>
              <p className="stat-label">Total Events</p>
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
                <h3 className="stat-number">600</h3>
                <div className="stat-trend positive">
                  <Target className="w-4 h-4" />
                  <span>+2.5%</span>
                </div>
              </div>
              <p className="stat-label">Total Participants</p>
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
                <h3 className="stat-number">{live.length}</h3>
                <div className="stat-trend live">LIVE</div>
              </div>
              <p className="stat-label">Active Events</p>
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

          <div className="stat-card">
            <div className="stat-icon completed">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="stat-content">
              <div className="stat-header">
                <h3 className="stat-number">{finished.length}</h3>
                <div className="stat-trend completed">
                  <Award className="w-4 h-4" />
                  <span>Completed</span>
                </div>
              </div>
              <p className="stat-label">Finished Events</p>
              <div className="stat-progress">
                <div className="progress-bar">
                  <div className="progress-fill completed" style={{ width: `${(finished.length / (upcoming.length + live.length + finished.length)) * 100}%` }}></div>
                </div>
                <span className="progress-text">{Math.round((finished.length / (upcoming.length + live.length + finished.length)) * 100)}% success rate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Content Grid */}
        <div className="dashboard-content">
          {/* Upcoming Events */}
          <div className="content-card events-card">
            <div className="card-header">
              <div className="header-left">
                <h3 className="card-title">Upcoming Events</h3>
                <span className="event-count">{upcoming.length} events</span>
              </div>
              <div className="header-actions">
                <button
                  className="view-all-btn"
                  onClick={() => handleQuickAction("View All Events")}
                >
                  View All
                </button>
              </div>
            </div>
            <div className="events-list">
              {upcoming.slice(0, 3).map((event) => (
                <div key={event._id} className="event-item upcoming">
                  <div className="event-info">
                    <div className="event-main">
                      <h4 className="event-name">{event.title}</h4>
                      <div className="event-meta">
                        <span className="event-date">
                          <Calendar className="w-3 h-3" />
                          {new Date(event.date).toLocaleDateString()} at {event.time}
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
                          {event.MaxNoOfParticipantsPerTeam === 0
                            ? "All can Participate"
                            : event.MaxNoOfParticipantsPerTeam * event.maxTeamsPerBatch}
                        </span>
                        <span className="stat-label">Participants</span>
                      </div>
                      <div className="days-left">
                        <Clock className="w-3 h-3" />
                        <span>{daysRemaining(event.date)} days remaining</span>
                      </div>
                    </div>
                  </div>
                  <div className="event-status-badge upcoming">
                    <Clock className="w-3 h-3" />
                    Upcoming
                  </div>
                </div>
              ))}
              {upcoming.length === 0 && (
                <div className="no-events">
                  <Calendar className="w-8 h-8 text-gray-400" />
                  <p>No upcoming events scheduled</p>
                </div>
              )}
            </div>
          </div>

          {/* Live Events */}
          <div className="content-card events-card">
            <div className="card-header">
              <div className="header-left">
                <h3 className="card-title">Live Events</h3>
                <span className="event-count live">{live.length} events</span>
              </div>
              <div className="header-actions">
                <button
                  className="view-all-btn"
                  onClick={() => handleQuickAction("View All Events")}
                >
                  View All
                </button>
              </div>
            </div>
            <div className="events-list">
              {live.slice(0, 3).map((event) => (
                <div key={event._id} className="event-item live">
                  <div className="event-info">
                    <div className="event-main">
                      <h4 className="event-name">{event.title}</h4>
                      <div className="event-meta">
                        <span className="event-date">
                          <Calendar className="w-3 h-3" />
                          {new Date(event.date).toLocaleDateString()}
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
                          {event.MaxNoOfParticipantsPerTeam === 0
                            ? "All can Participate"
                            : event.MaxNoOfParticipantsPerTeam * event.maxTeamsPerBatch}
                        </span>
                        <span className="stat-label">Participants</span>
                      </div>
                    </div>
                  </div>
                  <div className="event-status-badge live">
                    <Activity className="w-3 h-3" />
                    LIVE
                  </div>
                </div>
              ))}
              {live.length === 0 && (
                <div className="no-events">
                  <Activity className="w-8 h-8 text-gray-400" />
                  <p>No live events at the moment</p>
                </div>
              )}
            </div>
          </div>

          {/* Completed Events */}
          <div className="content-card events-card">
            <div className="card-header">
              <div className="header-left">
                <h3 className="card-title">Recent Completed Events</h3>
                <span className="event-count completed">{finished.length} events</span>
              </div>
              <div className="header-actions">
                <button
                  className="view-all-btn"
                  onClick={() => handleQuickAction("View Event Results")}
                >
                  View Results
                </button>
              </div>
            </div>
            <div className="events-list">
              {finished.slice(0, 3).map((event) => (
                <div key={event._id} className="event-item completed">
                  <div className="event-info">
                    <div className="event-main">
                      <h4 className="event-name">{event.title}</h4>
                      <div className="event-meta">
                        <span className="event-date">
                          <CheckCircle className="w-3 h-3" />
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                        {event.winners && (
                          <span className="event-winner">
                            <Trophy className="w-3 h-3" />
                            {event.winners}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="event-stats">
                      <div className="participants-stat">
                        <span className="stat-value">
                          {event.MaxNoOfParticipantsPerTeam === 0
                            ? "All can Participate"
                            : event.MaxNoOfParticipantsPerTeam * event.maxTeamsPerBatch}
                        </span>
                        <span className="stat-label">Participants</span>
                      </div>
                    </div>
                  </div>
                  <div className="event-status-badge completed">
                    <CheckCircle className="w-3 h-3" />
                    Completed
                  </div>
                </div>
              ))}
              {finished.length === 0 && (
                <div className="no-events">
                  <CheckCircle className="w-8 h-8 text-gray-400" />
                  <p>No completed events yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Quick Actions */}
          <div className="content-card quick-actions-card">
            <div className="card-header">
              <h3 className="card-title">Quick Actions</h3>
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

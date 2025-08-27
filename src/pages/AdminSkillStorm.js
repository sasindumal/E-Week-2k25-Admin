import React from 'react';
import { useState,useEffect } from 'react';
import Sidebar from "./sidebar";
import { useNavigate } from 'react-router-dom';
import {
  Trophy, Hammer, Award, Users, Star, Briefcase ,
    Plus, Edit, Trash2, Eye, CheckCircle, Gamepad2,
  Medal,
  
  Crown,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  
  Target,
  Zap,
  BarChart3,
  Activity,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  X,
} from "lucide-react";
const AdminSkillStorm = () => {
   const BASE_URL = process.env.REACT_APP_BASE_URL;
   const [activeTab, setActiveTab] = useState("events");
   
   const navigate = useNavigate();

 const handleClick = () => {
    navigate("/admin/EventForm");
  };
const handleEndEdit = async (id) => {
  navigate("/admin/SetResult", { state: { eventId: id } });
}
const handleChangetoLive = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/api/createEvents/ChangeToLive`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ eventId: id }),
    });

    const data = await response.json();

    if (response.ok) {
      // Refresh all event lists to ensure consistency
      await Promise.all([
        fetchAllEvents(),
        fetchUpcomingEvents(),
        fetchLiveEvents(),
        fetchFinishedEvents()
      ]);
      alert("Event status updated to Live successfully!");
    } else {
      console.error("Error updating event:", data.message || data.error);
      alert("Failed to update event status: " + (data.message || data.error));
    }
  } catch (err) {
    console.error("Network error:", err.message);
    alert("Network error occurred while updating event status: " + err.message);
  }
};



 

  const [skillstormRegistrations, setSkillstormRegistrations] = useState([
    {
      id: 1,
      eventName: "Codeyssey",
      eventId: 1,
      teamName: "Code Masters",
      batch: "E21",
      type: "team",
      submittedAt: "2025-01-15T10:30:00Z",
      participants: [
        {
          name: "Alex Johnson",
          registrationNumber: "E/21/045",
          contactNumber: "0771234567",
          email: "alex@example.com",
          isCaptain: true,
        },
        {
          name: "Sarah Wilson",
          registrationNumber: "E/21/046",
          contactNumber: "0771234568",
          email: "sarah@example.com",
          isCaptain: false,
        },
        {
          name: "Mike Chen",
          registrationNumber: "E/21/047",
          contactNumber: "0771234569",
          email: "mike@example.com",
          isCaptain: false,
        },
        {
          name: "Lisa Davis",
          registrationNumber: "E/21/048",
          contactNumber: "0771234570",
          email: "lisa@example.com",
          isCaptain: false,
        },
      ],
    },
    {
      id: 2,
      eventName: "Valorant",
      eventId: 2,
      teamName: "Fire Squad",
      batch: "E22",
      type: "team",
      submittedAt: "2025-01-16T14:20:00Z",
      participants: [
        {
          name: "Tom Brown",
          registrationNumber: "E/22/020",
          contactNumber: "0771234571",
          email: "tom@example.com",
          isCaptain: true,
        },
        {
          name: "Emma Taylor",
          registrationNumber: "E/22/021",
          contactNumber: "0771234572",
          email: "emma@example.com",
          isCaptain: false,
        },
        {
          name: "Ryan Garcia",
          registrationNumber: "E/22/022",
          contactNumber: "0771234573",
          email: "ryan@example.com",
          isCaptain: false,
        },
        {
          name: "Sophie Miller",
          registrationNumber: "E/22/023",
          contactNumber: "0771234574",
          email: "sophie@example.com",
          isCaptain: false,
        },
        {
          name: "David Lee",
          registrationNumber: "E/22/024",
          contactNumber: "0771234575",
          email: "david@example.com",
          isCaptain: false,
        },
      ],
    },
  ]);
 
  const  [upcoming, setUpcoming] = useState([]);
    const [live, setLive] = useState([]);
    const [finished, setFinished] = useState([]);
    const  [AllEvents,setAllEvents]=useState([]);

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
  
    const fetchAllEvents = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/createEvents/getEvents`);
        if (!response.ok) {
          throw new Error("Failed to fetch all events");
        }
        const data = await response.json();
        setAllEvents(data);
      } catch (error) {
        console.error("Error fetching all events:", error);
      }
    };

  useEffect(() => {
    fetchUpcomingEvents();
    fetchLiveEvents();
    fetchFinishedEvents();
    fetchAllEvents();
  
   
  }, []);

  const AddSkillStormEventModal = ({ event, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "Core Competition",
    date: "",
    time: "",
    location: "",
    type: "team",
    playersPerTeam: 4,
    maxTeamsPerBatch: 2,
    maxPlayersPerBatch: 20,
    maxParticipants: 100,
    status: "upcoming",
  });
}

  

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completingEvent, setCompletingEvent] = useState(null);

  // Event Management Functions
  const handleAddEvent = () => {
    setEditingEvent(null);
    setShowAddEventModal(true);
  };

const handleEdit = (id) => {
    navigate("/admin/EditableEventForm", { state: { eventId: id } });
  }; 

 const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/createEvents/deleteEvent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ eventId: id }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to delete event");
    }

    // Refresh all event lists to ensure consistency
    await Promise.all([
      fetchAllEvents(),
      fetchUpcomingEvents(),
      fetchLiveEvents(),
      fetchFinishedEvents()
    ]);

    alert("Event deleted successfully!");
  } catch (error) {
    console.error("Error deleting event:", error);
    alert("Failed to delete event: " + error.message);
  }
};
 

  

 const SkillStormAll = AllEvents.filter((event) => {
  const title = event.category.toLowerCase();
  return (
    title.includes("core competition") ||
    title.includes("pc games") ||
    title.includes("mobile games")
  );
});

console.log("Filtered SkillStorm Events:", SkillStormAll);
  // Filter functions
// Filtered events for display
const filteredEvents = SkillStormAll.filter((event) => {
  const matchesSearch =
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesCategory =
    filterCategory === "all" || event.category === filterCategory;
  const matchesStatus =
    filterStatus === "all" || event.status === filterStatus;
  return matchesSearch && matchesCategory && matchesStatus;
});

const filteredRegistrations = skillstormRegistrations.filter((reg) => {
  const matchesSearch =
    reg.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.participants.some((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  return matchesSearch;
});

// Group registrations by event
const groupedRegistrations = filteredRegistrations.reduce((acc, reg) => {
  if (!acc[reg.eventName]) {
    acc[reg.eventName] = [];
  }
  acc[reg.eventName].push(reg);
  return acc;
}, {});

const categories = [
  "Core Competition",
  "PC Games",
  "Mobile Games",
  "Fun Games",
];

return (

    <div className="admin-leaderboard">
      <Sidebar />
      <main>
    <div className="admin-section">
      <div className="section-header">
        <div className="header-content">
          <h1>SkillStorm Management</h1>
          <p className="section-description">
            Manage SkillStorm competitions, games, and participants
          </p>
        </div>
        <div className="header-actions">
          <button 
  className="action-btn primary px-6 py-3 text-lg" 
  onClick={handleClick}
>   
  
  <Plus className="w-5 h-5 mr-2" />
  Add
</button>

        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === "events" ? "active" : ""}`}
          onClick={() => setActiveTab("events")}
        >
          <Calendar className="w-4 h-4" />
          <span>Events</span>
        </button>
        <button
          className={`tab-button ${activeTab === "participants" ? "active" : ""}`}
          onClick={() => setActiveTab("participants")}
        >
          <Users className="w-4 h-4" />
          <span>Participants</span>
        </button>
      </div>

      {activeTab === "events" && (
        <>
          {/* Events Controls */}
          <div className="section-controls">
            <div className="search-bar">
              <Search className="w-4 h-4" />
              <input
                type="text"
                placeholder="Search competitions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-controls">
              <select
                className="filter-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <select
                className="filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="Live">Live</option>
                <option value="finished">Completed</option>
              </select>
            </div>
          </div>

          {/* Events Statistics */}
          <div className="events-stats">
            <div className="events-stat">
              <span className="stat-number">{filteredEvents.length}</span>
              <span className="stat-label">Total Competitions</span>
            </div>
            <div className="events-stat">
              <span className="stat-number">
                {filteredEvents.filter((e) => e.status === "Live").length}
              </span>
              <span className="stat-label">Active Now</span>
            </div>
            <div className="events-stat">
              <span className="stat-number">
                {filteredEvents.reduce((sum, e) => sum + e.MaxNoOfParticipantsPerTeam*e.maxTeamsPerBatch, 0)}
              </span>
              <span className="stat-label">Total Participants</span>
            </div>
            <div className="events-stat">
              <span className="stat-number">
                {filteredEvents.filter((e)=>e.status==="upcoming").length}
              </span>
              <span className="stat-label">Upcoming</span>
            </div>
          </div>

          {/* Events Table */}
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>Competition</th>
                  <th>Category</th>
                  <th>Date & Time</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Participants</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event._id}>
                    <td>
                      <div className="event-details">
                        <span className="event-name">{event.title}</span>
                        <span className="event-location">{event.location}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`category-badge ${event.category.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {event.category}
                      </span>
                    </td>
                    <td>
                      <div className="event-datetime">
                        <span className="event-date">
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                        <span className="event-time">{event.time}</span>
                      </div>
                    </td>
                    <td>
                      <div className="event-type-info">
                        <span className={`type-badge ${event.eventType.toLowerCase()}`}>
                          {event.eventType.toLowerCase() === "team" ? "Team" : "Individual"}
                        </span>
                        {event.eventType.toLowerCase() === "team" && (
                          <span className="type-details">
                            {event.MaxNoOfParticipantsPerTeam} players/team
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <select
                         className={`status-select ${event.status}`}
                         value={event.status}
                         onChange={(e) => {
                          const newStatus = e.target.value;
             
                         // Call handleChangetoLive if "Live" is selected
                       if (newStatus === "Live") {
                        handleChangetoLive(event._id);
                      }
                      if(newStatus === "finished") {
                        handleEndEdit(event._id);
                      }

                     // You can add other status API calls here if needed
                     }}
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="Live">Active</option>
                        <option value="finished">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <div className="participants-info">
                        <span className="participants-count">
                          {event.maxTeamsPerBatch*event.MaxNoOfParticipantsPerTeam} 
                        </span>
                        <div className="participants-bar">
                          <div
                            className="participants-fill"
                            style={{
                              width: `${(7/event.maxTeamsPerBatch*event.MaxNoOfParticipantsPerTeam) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="actions">
                      <div className="action-group">
                        <button className="action-icon" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="action-icon"
                          title="Edit Competition"
                          onClick={() => handleEdit(event._id)}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {event.status === "active" && (
                          <button
                            className="action-icon success"
                            title="Complete Competition"
                            onClick={() => handleEndEdit(event._id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          className="action-icon danger"
                          title="Delete Competition"
                          onClick={() => handleDelete(event._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === "participants" && (
        <>
          {/* Participants Controls */}
          <div className="section-controls">
            <div className="search-bar">
              <Search className="w-4 h-4" />
              <input
                type="text"
                placeholder="Search teams, participants, or competitions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Participants Statistics */}
          <div className="participants-stats">
            <div className="participants-stat">
              <span className="stat-number">
                {skillstormRegistrations.length}
              </span>
              <span className="stat-label">Total Teams</span>
            </div>
            <div className="participants-stat">
              <span className="stat-number">
                20 
              </span>
              <span className="stat-label">Total Players</span>
            </div>
            <div className="participants-stat">
              <span className="stat-number">
                {Object.keys(groupedRegistrations).length}
              </span>
              <span className="stat-label">Active Competitions</span>
            </div>
            <div className="participants-stat">
              <span className="stat-number">
                {
                  [...new Set(skillstormRegistrations.map((r) => r.batch))]
                    .length
                }
              </span>
              <span className="stat-label">Participating Batches</span>
            </div>
          </div>

          {/* Grouped Registrations */}
          <div className="registrations-container">
            {Object.entries(groupedRegistrations).map(
              ([eventName, eventRegistrations]) => (
                <div key={eventName} className="event-group">
                  <div className="event-group-header">
                    <h3>{eventName}</h3>
                    <span className="registration-count">
                      {eventRegistrations.length} team
                      {eventRegistrations.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="registrations-grid">
                    {eventRegistrations.map((registration) => (
                      <div
                        key={registration.id}
                        className="registration-card skillstorm"
                      >
                        <div className="registration-header">
                          <div className="registration-info">
                            <h4>{registration.teamName}</h4>
                            <div className="registration-meta">
                              <span className="batch-badge">
                                {registration.batch}
                              </span>
                              <span className="type-badge">
                                {registration.type}
                              </span>
                              <span className="date-info">
                                {new Date(
                                  registration.submittedAt,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="registration-actions">
                            <button
                              className="action-icon"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              className="action-icon"
                              title="Edit Registration"
                            >
                              
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="participants-list">
                          {registration.participants.map(
                            (participant, index) => (
                              <div key={index} className="participant-row">
                                <div className="participant-info">
                                  <span className="participant-name">
                                    {participant.isCaptain && (
                                      <Crown className="w-3 h-3 text-yellow-400" />
                                    )}
                                    {participant.name}
                                  </span>
                                  <span className="participant-reg">
                                    {participant.registrationNumber}
                                  </span>
                                </div>
                                <div className="participant-contact">
                                  <span className="participant-phone">
                                    {participant.contactNumber}
                                  </span>
                                  <span className="participant-email">
                                    {participant.email}
                                  </span>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>

          {filteredRegistrations.length === 0 && (
            <div className="empty-state">
              <Gamepad2 className="w-16 h-16" />
              <h3>No registrations found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Event Modal for SkillStorm */}
      {showAddEventModal && (
        <AddSkillStormEventModal
          event={editingEvent}
          isOpen={showAddEventModal}
          onClose={() => {
            setShowAddEventModal(false);
            setEditingEvent(null);
          }}
          onSave={handleEdit}
        />
      )}

      {/* SkillStorm Event Completion Modal */}
      
  
    </div>
        </main>
    </div>
  );
};



export default AdminSkillStorm;

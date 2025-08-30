import Sidebar from "./sidebar";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./management.css";
import { Trash, Pencil, RefreshCw, Square, Calendar, Clock, MapPin, Users, Trophy, Medal, Award, ChevronDown, ChevronRight } from "lucide-react";

const ManageEvents = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [liveEvents, setLiveEvents] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [finishedEvents, setFinishedEvents] = useState([]);
  const [updatingEventId, setUpdatingEventId] = useState(null);
  const [fadingOutIds, setFadingOutIds] = useState([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("date");

  const handleClick = () => {
    navigate("/admin/EventForm");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      console.log("Deleting event with ID:", id);
      console.log("Current events state:", { events: events.length, live: liveEvents.length, finished: finishedEvents.length });
      
      const response = await fetch(`${BASE_URL}/api/createEvents/deleteEvent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId: id }),
      });

      console.log("Delete response status:", response.status);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete event");
      }

      const result = await response.json();
      console.log("Delete response:", result);

      // Start fade out animation
      setFadingOutIds((prev) => [...prev, id]);

      // Remove from all state arrays after animation
      setTimeout(() => {
        setEvents((prev) => {
          const filtered = prev.filter((event) => event._id !== id);
          console.log("Updated events:", filtered.length);
          return filtered;
        });
        setLiveEvents((prev) => {
          const filtered = prev.filter((event) => event._id !== id);
          console.log("Updated live events:", filtered.length);
          return filtered;
        });
        setFinishedEvents((prev) => {
          const filtered = prev.filter((event) => event._id !== id);
          console.log("Updated finished events:", filtered.length);
          return filtered;
        });
        setFadingOutIds((prev) => prev.filter((fadeId) => fadeId !== id));
        
        console.log("Event removed from state arrays");
      }, 700);

    } catch (error) {
      console.error("Delete event error:", error);
      alert("Failed to delete event: " + error.message);
    }
  };

  useEffect(() => {
    console.log("ManageEvents page accessed");
  }, []);

  const handleChangetoLive = async (id) => {
    setUpdatingEventId(id);
    setFadingOutIds((prev) => [...prev, id]);

    try {
      setTimeout(async () => {
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
              fetchLiveEvents(),
              fetchUpcomingEvents(),
              fetchFinishedEvents()
            ]);
            alert("Event moved to Live successfully!");
          } else {
            console.error("Error updating event:", data.message || data.error);
            alert("Failed to update event status: " + (data.message || data.error));
          }
        } catch (err) {
          console.error("Network error:", err.message);
          alert("Network error occurred: " + err.message);
        } finally {
          setUpdatingEventId(null);
          setFadingOutIds((prev) => prev.filter((eid) => eid !== id));
        }
      }, 700);
    } catch (error) {
      console.error("Error in handleChangetoLive:", error);
      setUpdatingEventId(null);
      setFadingOutIds((prev) => prev.filter((eid) => eid !== id));
    }
  };

  const handleEndEdit = async (id) => {
    navigate("/admin/SetResult", { state: { eventId: id } });
  }

  const handleQuickFinish = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/createEvents/terminateEvent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: id, status: 'finished' })
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to finish event');
      }
      await Promise.all([fetchLiveEvents(), fetchFinishedEvents(), fetchPendingEvents()]);
      alert('Event marked as finished');
    } catch (e) {
      console.error(e);
      alert('Failed to finish event');
    }
  }

  const handleSetResults = (id) => {
    navigate("/admin/SetResult", { state: { eventId: id } });
  };

  const handleEdit = (id) => {
    navigate("/admin/EditableEventForm", { state: { eventId: id } });
  };  

  const fetchUpcomingEvents = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/createEvents/UpcomingEvents`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchLiveEvents = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/createEvents/LiveEvents`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setLiveEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchFinishedEvents = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/createEvents/FinishedEvents`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setFinishedEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchPendingEvents = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/createEvents/PendingResults`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setPendingEvents(data);
    } catch (error) {
      console.error("Error fetching pending results:", error);
    }
  };

  useEffect(() => {
    fetchLiveEvents();
    fetchFinishedEvents();
    fetchPendingEvents();
    fetchUpcomingEvents();
  }, []);

  const getStatusBadge = (status) => {
    const statusStyles = {
      upcoming: "bg-blue-500",
      live: "bg-green-500",
      finished: "bg-gray-500",
      pending_results: "bg-gray-500"
    };

    const label = status === 'pending_results' ? 'Pending Results' : (status?.charAt(0).toUpperCase() + status?.slice(1));

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${statusStyles[status] || 'bg-gray-400'}`}>
        {label}
      </span>
    );
  };

  const EventCard = ({ event, type, onEdit, onDelete, onChangeToLive, onEndEvent, onQuickFinish, onSetResults, isUpdating, isFading }) => {
    const [open, setOpen] = useState(false);

    const getEventPriority = () => {
      if (type === 'live') return 'high';
      if (type === 'upcoming') return 'medium';
      return 'low';
    };

    const getDaysUntilEvent = () => {
      if (type === 'upcoming') {
        const today = new Date();
        const eventDate = new Date(event.date);
        const diffTime = eventDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
      }
      return null;
    };

    const daysUntilEvent = getDaysUntilEvent();

    return (
      <div className={`event-row ${isFading ? 'fade-out' : ''}`}>
        <button className="row-header" onClick={() => setOpen(!open)}>
          <div className="row-main">
            <div className="row-title">{event.title}</div>
            <div className="row-meta">
              <span className="row-date"><Calendar size={14} /> {new Date(event.date).toLocaleDateString()}</span>
              <span className="row-time"><Clock size={14} /> {event.time}</span>
              <span className="row-location"><MapPin size={14} /> {event.location}</span>
            </div>
          </div>
          <div className="row-right">
            {getStatusBadge(event.status)}
            {type === 'live' && (
              <div className="live-indicator mini">
                <div className="pulse-dot"></div>
                LIVE
              </div>
            )}
            <div className="chevron">{open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}</div>
          </div>
        </button>

        {open && (
          <div className="row-details">
            <div className="event-details">
              <div className="event-detail-item">
                <div className="detail-icon"><Calendar size={18} /></div>
                <div className="detail-content">
                  <span className="detail-label">Date</span>
                  <span className="detail-value">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
              <div className="event-detail-item">
                <div className="detail-icon"><Clock size={18} /></div>
                <div className="detail-content">
                  <span className="detail-label">Time</span>
                  <span className="detail-value">{event.time}</span>
                </div>
              </div>
              <div className="event-detail-item">
                <div className="detail-icon"><MapPin size={18} /></div>
                <div className="detail-content">
                  <span className="detail-label">Location</span>
                  <span className="detail-value">{event.location}</span>
                </div>
              </div>
              {event.eventType && (
                <div className="event-detail-item">
                  <div className="detail-icon"><Users size={18} /></div>
                  <div className="detail-content">
                    <span className="detail-label">Type</span>
                    <span className="detail-value">{event.eventType}</span>
                  </div>
                </div>
              )}
            </div>

            {event.description && (
              <div className="event-description">
                <div className="description-header">
                  <span className="description-icon">📝</span>
                  <span className="description-title">Description</span>
                </div>
                <p className="description-text">{event.description}</p>
              </div>
            )}

            {type === 'finished' && (
              <div className="event-results">
                <div className="results-header">
                  <Trophy size={20} className="results-icon" />
                  <h4 className="results-title">Event Results</h4>
                </div>
                <div className="results-grid">
                  {event.winners && (
                    <div className="result-item winner">
                      <div className="result-icon-container">
                        <Trophy size={18} className="result-icon" />
                      </div>
                      <div className="result-content">
                        <span className="result-label">Winner</span>
                        <span className="result-value">{event.winners}</span>
                      </div>
                      <div className="result-medal winner-medal">🥇</div>
                    </div>
                  )}
                  {event.firstRunnerUp && (
                    <div className="result-item first-runner">
                      <div className="result-icon-container">
                        <Medal size={18} className="result-icon" />
                      </div>
                      <div className="result-content">
                        <span className="result-label">1st Runner-up</span>
                        <span className="result-value">{event.firstRunnerUp}</span>
                      </div>
                      <div className="result-medal first-medal">🥈</div>
                    </div>
                  )}
                  {event.secondRunnerUp && (
                    <div className="result-item second-runner">
                      <div className="result-icon-container">
                        <Award size={18} className="result-icon" />
                      </div>
                      <div className="result-content">
                        <span className="result-label">2nd Runner-up</span>
                        <span className="result-value">{event.secondRunnerUp}</span>
                      </div>
                      <div className="result-medal second-medal">🥉</div>
                    </div>
                  )}
                  {event.thirdRunnerUp && (
                    <div className="result-item third-runner">
                      <div className="result-icon-container">
                        <Award size={18} className="result-icon" />
                      </div>
                      <div className="result-content">
                        <span className="result-label">3rd Runner-up</span>
                        <span className="result-value">{event.thirdRunnerUp}</span>
                      </div>
                      <div className="result-medal third-medal">🏅</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="event-actions">
              <div className="action-group primary">
                <button className="action-btn edit-btn" title="Edit Event" onClick={() => onEdit(event._id)}>
                  <Pencil size={16} />
                  <span>Edit</span>
                </button>
                {type === 'upcoming' && (
                  <button className="action-btn live-btn" title="Change to Live" onClick={() => onChangeToLive(event._id)} disabled={isUpdating}>
                    {isUpdating ? <span className="spinner"></span> : (<><RefreshCw size={16} /><span>Go Live</span></>)}
                  </button>
                )}
                {type === 'live' && (
                  event.category && event.category.toLowerCase() === 'competition' ? (
                    <button className="action-btn end-btn" title="End Event & Set Results" onClick={() => onEndEvent(event._id)}>
                      <Square size={16} />
                      <span>End & Set Results</span>
                    </button>
                  ) : (
                    <button className="action-btn end-btn" title="End Event" onClick={() => onQuickFinish(event._id)}>
                      <Square size={16} />
                      <span>End Event</span>
                    </button>
                  )
                )}
                {type === 'pending' && (
                  <button className="action-btn end-btn" title="Set Results" onClick={() => onSetResults(event._id)}>
                    <Trophy size={16} />
                    <span>Set Results</span>
                  </button>
                )}
              </div>
              <div className="action-group secondary">
                <button className="action-btn delete-btn" title="Delete Event" onClick={() => onDelete(event._id)}>
                  <Trash size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const filterAndSort = (list) => {
    const q = search.trim().toLowerCase();
    let out = list.filter(ev => {
      const t = (ev.title || '').toLowerCase();
      const loc = (ev.location || '').toLowerCase();
      return !q || t.includes(q) || loc.includes(q);
    });
    if (sortKey === 'name') out.sort((a,b)=> (a.title||'').localeCompare(b.title||''));
    else if (sortKey === 'location') out.sort((a,b)=> (a.location||'').localeCompare(b.location||''));
    else out.sort((a,b)=> new Date(a.date||0) - new Date(b.date||0));
    return out;
  };

  const renderGroupedByDay = (list, type) => {
    const dateKey = (d) => new Date(d).toISOString().split('T')[0];
    const groups = {};
    const orderedDates = [];
    list.forEach(ev => {
      const k = dateKey(ev.date);
      if (!groups[k]) { groups[k] = []; orderedDates.push(k); }
      groups[k].push(ev);
    });
    return orderedDates.map((k, idx) => (
      <div key={k} className="day-group">
        <div className="day-header">Day{String(idx+1).padStart(2,'0')} <span className="day-date">{new Date(k).toLocaleDateString()}</span></div>
        {groups[k].map((event) => (
          <EventCard
            key={event._id}
            event={event}
            type={type || 'upcoming'}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onChangeToLive={handleChangetoLive}
            onEndEvent={handleEndEdit}
            onQuickFinish={handleQuickFinish}
            onSetResults={handleSetResults}
            isUpdating={updatingEventId === event._id}
            isFading={fadingOutIds.includes(event._id)}
          />
        ))}
      </div>
    ));
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0f" }}>
      <Sidebar activeEvents={liveEvents.length} />

      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Event Management</h1>
          <p className="page-subtitle">
            Manage all your E-Week 2025 events - Create, edit, and track event progress
          </p>
          <button onClick={handleClick} className="create-event-btn">
            <span>+</span>
            Create New Event
          </button>
        </div>

        <div className="events-dashboard">
          {/* Search & Sort */}
          <div className="events-controls">
            <input
              className="events-search"
              placeholder="Search events by title or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select className="events-sort" value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="location">Sort by Location</option>
            </select>
          </div>
          {/* Live Events Section */}
          <section className="events-section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="status-indicator live"></span>
                Live Events
                <span className="event-count">{liveEvents.length}</span>
              </h2>
            </div>
            <div className="events-list">
              {liveEvents.length > 0 ? (
                filterAndSort(liveEvents).map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    type="live"
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onEndEvent={handleEndEdit}
                    onQuickFinish={handleQuickFinish}
                    isFading={fadingOutIds.includes(event._id)}
                  />
                ))
              ) : (
                <div className="no-events">
                  <p>No live events at the moment</p>
                </div>
              )}
            </div>
          </section>

          {/* Pending Results Section */}
          <section className="events-section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="status-indicator finished"></span>
                Pending Results
                <span className="event-count">{pendingEvents.length}</span>
              </h2>
            </div>
            <div className="events-list">
              {pendingEvents.length > 0 ? (
                pendingEvents.map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    type="pending"
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onSetResults={handleSetResults}
                    isFading={fadingOutIds.includes(event._id)}
                  />
                ))
              ) : (
                <div className="no-events">
                  <p>No events pending results</p>
                </div>
              )}
            </div>
          </section>

          {/* Upcoming Events Section */}
          <section className="events-section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="status-indicator upcoming"></span>
                Upcoming Events
                <span className="event-count">{events.length}</span>
              </h2>
            </div>
            <div className="events-list">
              {events.length > 0 ? (
                renderGroupedByDay(filterAndSort(events))
              ) : (
                <div className="no-events">
                  <p>No upcoming events scheduled</p>
                </div>
              )}
            </div>
          </section>

          {/* Finished Events Section */}
          <section className="events-section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="status-indicator finished"></span>
                Finished Events
                <span className="event-count">{finishedEvents.length}</span>
              </h2>
            </div>
            <div className="events-list">
              {finishedEvents.length > 0 ? (
                renderGroupedByDay(filterAndSort(finishedEvents), 'finished')
              ) : (
                <div className="no-events">
                  <p>No finished events yet</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ManageEvents;

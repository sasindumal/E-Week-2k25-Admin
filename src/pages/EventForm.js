import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, Trophy, FileText, Tag, Settings, Plus, ChevronDown } from "lucide-react";
import { EWEEK_2025_EVENTS, getEventByName } from "../utils/eweekEvents";
import "./EventForm.css";

const EventForm = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "Premises Ground",
    eventType: "",
    MaxNoOfParticipantsPerTeam: "",
    description: "",
    status: "upcoming",
    category: "",
    pointsConfiguration: "",
    winners: "",
    firstRunnerUp: "",
    secondRunnerUp: "",
    maxTeamsPerBatch: "",
    expectedFinishTime: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showQuickSelect, setShowQuickSelect] = useState(false);
  const [useCustomLocation, setUseCustomLocation] = useState(false);
  const [pointsPreset, setPointsPreset] = useState("");

  // E-Week 2025 Predefined Events from utility
  const eweekEvents = EWEEK_2025_EVENTS;

  useEffect(() => {
    console.log("EventForm page accessed");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'category') {
      // Reset fields depending on category
      const isCompetition = value === 'Competition';
      setFormData((prev) => ({
        ...prev,
        category: value,
        eventType: isCompetition ? (prev.eventType || 'Individual') : '',
        MaxNoOfParticipantsPerTeam: isCompetition ? prev.MaxNoOfParticipantsPerTeam : '',
        maxTeamsPerBatch: isCompetition ? prev.maxTeamsPerBatch : '',
      }));
      return;
    }

    if (name === 'locationSelect') {
      if (value === 'custom') {
        setUseCustomLocation(true);
        setFormData((prev) => ({ ...prev, location: '' }));
      } else {
        setUseCustomLocation(false);
        setFormData((prev) => ({ ...prev, location: value }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuickSelect = (eventData, category) => {
    const eventType = category === "Individual Events" || eventData.maxParticipants === 1 ? "Individual" : "Team";

    setFormData(prev => ({
      ...prev,
      title: eventData.name,
      category: category,
      eventType: eventType,
      MaxNoOfParticipantsPerTeam: eventData.maxParticipants,
      description: eventData.description,
      pointsConfiguration: Array.isArray(eventData.pointsConfig) ? eventData.pointsConfig.join(",") : ""
    }));
    setShowQuickSelect(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const finalData = {
      ...formData,
      MaxNoOfParticipantsPerTeam: Number(formData.MaxNoOfParticipantsPerTeam),
      maxTeamsPerBatch: Number(formData.maxTeamsPerBatch),
      pointsConfiguration: formData.pointsConfiguration
        ? formData.pointsConfiguration
            .split(",")
            .map((n) => Number(n.trim()))
            .filter((n) => !isNaN(n))
        : [],
    };

    try {
      const response = await fetch(
        `${BASE_URL}/api/createEvents/createEvents`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Event created successfully:", result);

        // Show success message
        alert("Event created successfully!");

        // Reset form
        setFormData({
          title: "",
          date: "",
          time: "",
          location: "",
          eventType: "Individual",
          MaxNoOfParticipantsPerTeam: "",
          description: "",
          status: "upcoming",
          category: "",
          pointsConfiguration: "",
          winners: "",
          firstRunnerUp: "",
          secondRunnerUp: "",
          maxTeamsPerBatch: "",
          expectedFinishTime: "",
        });

        // Navigate back to manage events
        navigate("/admin/ManageEvents");
      } else {
        const errorData = await response.json();
        console.error("Event creation failed:", errorData);
        alert("Failed to create event: " + (errorData.error || errorData.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="event-form-container">
      <div className="event-form-card">
        <div className="form-header">
          <h2 className="form-title">Create New Event</h2>
          <p className="form-subtitle">Set up a new event for E-Week 2025</p>
          
          <button 
            type="button"
            className="quick-select-btn"
            onClick={() => setShowQuickSelect(!showQuickSelect)}
          >
            <Plus size={16} />
            Quick Select E-Week Event
            <ChevronDown size={16} className={showQuickSelect ? "rotate-180" : ""} />
          </button>

          {showQuickSelect && (
            <div className="quick-select-dropdown">
              {Object.entries(eweekEvents).map(([category, events]) => (
                <div key={category} className="event-category-group">
                  <h4 className="category-title">{category}</h4>
                  <div className="event-options">
                    {events.map((event) => (
                      <button
                        key={event.name}
                        type="button"
                        className="event-option"
                        onClick={() => handleQuickSelect(event, category)}
                        title={event.description}
                      >
                        {event.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-grid">
            {/* Title */}
            <div className="form-group full-width">
              <label className="form-label">
                <FileText size={16} />
                Event Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="Enter event title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            {/* Date and Time */}
            <div className="form-group">
              <label className="form-label">
                <Calendar size={16} />
                Event Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Clock size={16} />
                Start Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="form-input"
                required
              />
              <div style={{ display:'flex', gap:8, marginTop:8 }}>
                {['09:00','11:00','14:00','16:00'].map(t => (
                  <button key={t} type="button" className="btn-secondary" onClick={()=> setFormData(prev=>({...prev, time:t}))}>{t}</button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Clock size={16} />
                Expected Finish Time
              </label>
              <input
                type="time"
                name="expectedFinishTime"
                value={formData.expectedFinishTime}
                onChange={handleChange}
                className="form-input"
              />
              <div style={{ display:'flex', gap:8, marginTop:8 }}>
                {[1,2,3].map(h => (
                  <button
                    key={h}
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      if(!formData.time) return;
                      const [hh,mm] = formData.time.split(':').map(Number);
                      const d = new Date();
                      d.setHours(hh, mm, 0, 0);
                      d.setHours(d.getHours()+h);
                      const eh = String(d.getHours()).padStart(2,'0');
                      const em = String(d.getMinutes()).padStart(2,'0');
                      setFormData(prev => ({...prev, expectedFinishTime: `${eh}:${em}`}));
                    }}
                  >+{h}h</button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="form-group">
              <label className="form-label">
                <MapPin size={16} />
                Location
              </label>
              <select
                name="locationSelect"
                value={useCustomLocation ? 'custom' : formData.location}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="Premises Ground">Premises Ground</option>
                <option value="Agriculture Car Park">Agriculture Car Park</option>
                <option value="Drawing Hall">Drawing Hall</option>
                <option value="Indoor Stadium">Indoor Stadium</option>
                <option value="Auditorium">Auditorium</option>
                <option value="custom">Custom...</option>
              </select>
              {useCustomLocation && (
                <input
                  type="text"
                  name="location"
                  placeholder="Enter custom location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              )}
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">
                <Tag size={16} />
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Category</option>
                <option value="Ceremony">Ceremony</option>
                <option value="Competition">Competition</option>
                <option value="Workshop">Workshop</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Event Type (Competition only) */}
            {formData.category === 'Competition' && (
              <div className="form-group">
                <label className="form-label">
                  <Users size={16} />
                  Event Type
                </label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="Individual">Individual</option>
                  <option value="Team">Team</option>
                </select>
              </div>
            )}

            {/* Status */}
            <div className="form-group">
              <label className="form-label">
                <Settings size={16} />
                Event Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="upcoming">Upcoming</option>
                <option value="live">Live</option>
                <option value="finished">Finished</option>
              </select>
            </div>

            {/* Max Players Per Team (Competition + Team) */}
            {formData.category === 'Competition' && formData.eventType === 'Team' && (
              <div className="form-group">
                <label className="form-label">
                  <Users size={16} />
                  Max Players Per Team
                </label>
                <input
                  type="number"
                  name="MaxNoOfParticipantsPerTeam"
                  placeholder="e.g. 5"
                  value={formData.MaxNoOfParticipantsPerTeam}
                  onChange={handleChange}
                  className="form-input"
                  min="1"
                  required
                />
              </div>
            )}

            {/* Max Teams/Individuals per Batch (Competition only) */}
            {formData.category === 'Competition' && (
              <div className="form-group">
                <label className="form-label">
                  <Trophy size={16} />
                  {formData.eventType === 'Team' ? 'Max Teams per Batch' : 'Max Individuals per Batch'}
                </label>
                <input
                  type="number"
                  name="maxTeamsPerBatch"
                  placeholder="e.g. 100"
                  value={formData.maxTeamsPerBatch}
                  onChange={handleChange}
                  className="form-input"
                  min="1"
                  required
                />
              </div>
            )}

            {/* Points Configuration */}
            <div className="form-group">
              <label className="form-label">
                <Trophy size={16} />
                Points Configuration
              </label>
              <select
                name="pointsPreset"
                className="form-select"
                value={pointsPreset}
                onChange={(e) => {
                  const v = e.target.value;
                  setPointsPreset(v);
                  const presets = {
                    I: [30,20,10,0],
                    II: [20,14,8,0],
                    III: [15,10,6,0],
                    IV: [10,7,4,0],
                    V: [6,4,2,0]
                  };
                  if (v && v !== 'custom') {
                    setFormData((prev) => ({ ...prev, pointsConfiguration: presets[v].join(',') }));
                  } else if (v === 'custom') {
                    setFormData((prev) => ({ ...prev, pointsConfiguration: '' }));
                  }
                }}
              >
                <option value="">Select Category (I-V) or Custom</option>
                <option value="I">Category I - 30,20,10</option>
                <option value="II">Category II - 20,14,8</option>
                <option value="III">Category III - 15,10,6</option>
                <option value="IV">Category IV - 10,7,4</option>
                <option value="V">Category V - 6,4,2</option>
                <option value="custom">Custom</option>
              </select>
              {(pointsPreset === 'custom' || pointsPreset === '') && (
                <input
                  type="text"
                  name="pointsConfiguration"
                  placeholder="winner,1st,2nd,3rd (e.g. 30,20,10,0)"
                  value={formData.pointsConfiguration}
                  onChange={handleChange}
                  className="form-input"
                />
              )}
            </div>

            {/* Description */}
            <div className="form-group full-width">
              <label className="form-label">
                <FileText size={16} />
                Event Description
              </label>
              <textarea
                name="description"
                placeholder="Enter event description..."
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                rows="4"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/admin/ManageEvents")}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Creating Event...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Create Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;

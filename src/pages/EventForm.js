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

  const [isLoading, setIsLoading] = useState(false);
  const [showQuickSelect, setShowQuickSelect] = useState(false);

  // E-Week 2025 Predefined Events from utility
  const eweekEvents = EWEEK_2025_EVENTS;

  useEffect(() => {
    console.log("EventForm page accessed");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
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
      pointsConfiguration: eventData.pointsConfig.join(",")
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
            </div>

            {/* Location */}
            <div className="form-group">
              <label className="form-label">
                <MapPin size={16} />
                Location
              </label>
              <input
                type="text"
                name="location"
                placeholder="Enter event location"
                value={formData.location}
                onChange={handleChange}
                className="form-input"
                required
              />
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
                <option value="Team Events">Team Events</option>
                <option value="Aesthetic Events">Aesthetic Events</option>
                <option value="Digital Day">Digital Day</option>
                <option value="Individual Events">Individual Events</option>
                <option value="Competition">Competition</option>
                <option value="Workshop">Workshop</option>
                <option value="Conference">Conference</option>
                <option value="Ceremony">Ceremony</option>
                <option value="Social">Social</option>
                <option value="Core Competition">Core Competition</option>
                <option value="PC Games">PC Games</option>
                <option value="Mobile Games">Mobile Games</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Event Type */}
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

            {/* Max Players Per Team */}
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

            {/* Max Teams Per Batch */}
            <div className="form-group">
              <label className="form-label">
                <Trophy size={16} />
                Max Teams/Individuals per Batch
              </label>
              <input
                type="number"
                name="maxTeamsPerBatch"
                placeholder="e.g. 100"
                value={formData.maxTeamsPerBatch}
                onChange={handleChange}
                className="form-input"
                min="1"
              />
            </div>

            {/* Points Configuration */}
            <div className="form-group">
              <label className="form-label">
                <Trophy size={16} />
                Points Configuration
              </label>
              <input
                type="text"
                name="pointsConfiguration"
                placeholder="10,8,6,4 (1st,2nd,3rd,4th place points)"
                value={formData.pointsConfiguration}
                onChange={handleChange}
                className="form-input"
              />
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

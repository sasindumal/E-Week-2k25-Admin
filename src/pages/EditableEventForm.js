import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, Trophy, FileText, Tag, Settings, Save, ArrowLeft } from "lucide-react";
import "./EventForm.css";

const EditableEventForm = () => {
  const location = useLocation();
  const eventId = location.state?.eventId;
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

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
    thirdRunnerUp: "",
    maxTeamsPerBatch: "",
    expectedFinishTime: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    console.log("EditableEventForm page accessed");
  }, []);

  useEffect(() => {
    if (!eventId) {
      navigate("/admin/ManageEvents");
      return;
    }

    const fetchEvent = async () => {
      try {
        setIsLoadingData(true);
        const res = await fetch(
          `${BASE_URL}/api/createEvents/getEventsById`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ eventId }),
          }
        );
        if (!res.ok) throw new Error("Failed to fetch event");

        const data = await res.json();
        console.log("Fetched event data:", data);

        setFormData({
          title: data.title || "",
          date: data.date ? data.date.split("T")[0] : "",
          time: data.time || "",
          location: data.location || "",
          eventType: data.eventType || "Individual",
          MaxNoOfParticipantsPerTeam: data.MaxNoOfParticipantsPerTeam || "",
          description: data.description || "",
          status: data.status || "upcoming",
          category: data.category || "",
          pointsConfiguration: data.pointsConfiguration
            ? data.pointsConfiguration.join(",")
            : "",
          winners: data.winners || "",
          firstRunnerUp: data.firstRunnerUp || "",
          secondRunnerUp: data.secondRunnerUp || "",
          thirdRunnerUp: data.thirdRunnerUp || "",
          maxTeamsPerBatch: data.maxTeamsPerBatch || "",
          expectedFinishTime: data.expectedFinishTime || "",
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load event data");
        navigate("/admin/ManageEvents");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchEvent();
  }, [eventId, navigate, BASE_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const finalData = {
      eventId,
      ...formData,
      MaxNoOfParticipantsPerTeam: Number(formData.MaxNoOfParticipantsPerTeam),
      maxTeamsPerBatch: Number(formData.maxTeamsPerBatch),
      pointsConfiguration: formData.pointsConfiguration
        .split(",")
        .map((n) => Number(n.trim()))
        .filter((n) => !isNaN(n)),
    };

    try {
      const response = await fetch(
        `${BASE_URL}/api/createEvents/UpdateEventsById`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalData),
        }
      );
      console.log("Sending data:", finalData);

      if (response.ok) {
        const result = await response.json();
        console.log("Event updated successfully:", result);
        alert("Event updated successfully!");
        navigate("/admin/ManageEvents");
      } else {
        const errorData = await response.json();
        console.error("Event update failed:", errorData);
        alert("Update failed: " + (errorData.error || errorData.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="event-form-container">
        <div className="event-form-card">
          <div className="loading-state">
            <div className="spinner large"></div>
            <p>Loading event data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="event-form-container">
      <div className="event-form-card">
        <div className="form-header">
          <h2 className="form-title">Edit Event</h2>
          <p className="form-subtitle">Update event details for {formData.title}</p>
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

            {/* Winners and Runners-up */}
            {formData.status === 'finished' && (
              <>
                {["winners", "firstRunnerUp", "secondRunnerUp", "thirdRunnerUp"].map((field, idx) => (
                  <div className="form-group" key={field}>
                    <label className="form-label">
                      <Trophy size={16} />
                      {["Winners", "First Runner-up", "Second Runner-up", "Third Runner-up"][idx]}
                    </label>
                    <select
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">Select</option>
                      <option value="E21">E21</option>
                      <option value="E22">E22</option>
                      <option value="E23">E23</option>
                      <option value="E24">E24</option>
                      <option value="Staff">Staff</option>
                    </select>
                  </div>
                ))}
              </>
            )}

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
              <ArrowLeft size={16} />
              Back to Events
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Updating Event...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Update Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditableEventForm;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditHistory.css"; // ✅ import css file

function EditHistory() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const { id } = useParams();
  const navigate = useNavigate();
 useEffect(() => {
  // Removed authentication check - anyone can access
  console.log("EditHistory page accessed");
}, []);

  const [formData, setFormData] = useState({
    eventName: "",
    eventId: "",
    winners: "",
    firstRunnerUp: "",
    secondRunnerUp: "",
    thirdRunnerUp: "",
    Startdate: "",
    Enddate: "",
    status: "",
    category: [{ gameschampion: [], AthleticChampion: [], skillstormChampion: [] }],
    events: [],
    totalParticipants: 0,
    totalTeams: 0,
    totalEvents: 0,
    totalPoints: 0,
    winnerTotalPoints: 0,
    firstRunnerUpTotalPoints: 0,
    secondRunnerUpTotalPoints: 0,
    thirdRunnerUpTotalPoints: 0,
    description: "",
    Highlights: "",
    memmorableMoments: [],
    feedback: "",
    sponsors: [],
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/EweekHistroy/getEweekHistroyById`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: id }),
        });

        const data = await response.json();
        if (response.ok) {
          setFormData({
            eventName: data.eventName || "",
            eventId: data.eventId || "",
            winners: data.winners || "",
            firstRunnerUp: data.firstRunnerUp || "",
            secondRunnerUp: data.secondRunnerUp || "",
            thirdRunnerUp: data.thirdRunnerUp || "",
            Startdate: data.Startdate ? data.Startdate.substring(0, 10) : "",
            Enddate: data.Enddate ? data.Enddate.substring(0, 10) : "",
            status: data.status || "",
            category: data.category?.length
              ? data.category
              : [{ gameschampion: [], AthleticChampion: [], skillstormChampion: [] }],
            events: data.events || [],
            totalParticipants: data.totalParticipants || 0,
            totalTeams: data.totalTeams || 0,
            totalEvents: data.totalEvents || 0,
            totalPoints: data.totalPoints || 0,
            winnerTotalPoints: data.winnerTotalPoints || 0,
            firstRunnerUpTotalPoints: data.firstRunnerUpTotalPoints || 0,
            secondRunnerUpTotalPoints: data.secondRunnerUpTotalPoints || 0,
            thirdRunnerUpTotalPoints: data.thirdRunnerUpTotalPoints || 0,
            description: data.description || "",
            Highlights: data.Highlights || "",
            memmorableMoments: data.memmorableMoments || [],
            feedback: data.feedback || "",
            sponsors: data.sponsors || [],
          });
        } else {
          alert(data.message || "Error fetching event");
        }
      } catch (err) {
        console.error("Error fetching event:", err);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, [field]: updated }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/api/EweekHistroy/updateEweekHistoryById`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id, ...formData }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Event updated successfully!");
        navigate("/admin/history");
      } else {
        alert(data.message || "Error updating event");
      }
    } catch (err) {
      console.error("Error updating event:", err);
    }
  };

  return (
    <div className="edit-history-container">
      <h2 className="form-title">Edit Event</h2>
       <form onSubmit={handleSubmit} className="form-grid">

  {/* Basic Info with labels */}
  <div>
    <label className="form-label">Event Name</label>
    <input name="eventName" value={formData.eventName} onChange={handleChange} placeholder="Event Name" className="form-input" />
  </div>

  <div>
    <label className="form-label">Event ID</label>
    <input name="eventId" value={formData.eventId} onChange={handleChange} placeholder="Event ID" className="form-input" />
  </div>

  <div>
    <label className="form-label">Winners</label>
    <input name="winners" value={formData.winners} onChange={handleChange} placeholder="Winners" className="form-input" />
  </div>

  <div>
    <label className="form-label">First Runner Up</label>
    <input name="firstRunnerUp" value={formData.firstRunnerUp} onChange={handleChange} placeholder="First Runner Up" className="form-input" />
  </div>

  <div>
    <label className="form-label">Second Runner Up</label>
    <input name="secondRunnerUp" value={formData.secondRunnerUp} onChange={handleChange} placeholder="Second Runner Up" className="form-input" />
  </div>

  <div>
    <label className="form-label">Third Runner Up</label>
    <input name="thirdRunnerUp" value={formData.thirdRunnerUp} onChange={handleChange} placeholder="Third Runner Up" className="form-input" />
  </div>

  <div>
    <label className="form-label">Start Date</label>
    <input type="date" name="Startdate" value={formData.Startdate} onChange={handleChange} className="form-input" />
  </div>

  <div>
    <label className="form-label">End Date</label>
    <input type="date" name="Enddate" value={formData.Enddate} onChange={handleChange} className="form-input" />
  </div>

  <div>
    <label className="form-label">Status</label>
    <input name="status" value={formData.status} onChange={handleChange} placeholder="Status" className="form-input" />
  </div>

  {/* Numeric fields */}
  <div>
    <label className="form-label">Total Participants</label>
    <input type="number" name="totalParticipants" value={formData.totalParticipants} onChange={handleChange} placeholder="Total Participants" className="form-input" />
  </div>

  <div>
    <label className="form-label">Total Teams</label>
    <input type="number" name="totalTeams" value={formData.totalTeams} onChange={handleChange} placeholder="Total Teams" className="form-input" />
  </div>

  <div>
    <label className="form-label">Total Events</label>
    <input type="number" name="totalEvents" value={formData.totalEvents} onChange={handleChange} placeholder="Total Events" className="form-input" />
  </div>

  <div>
    <label className="form-label">Total Points</label>
    <input type="number" name="totalPoints" value={formData.totalPoints} onChange={handleChange} placeholder="Total Points" className="form-input" />
  </div>

  <div>
    <label className="form-label">Winner Total Points</label>
    <input type="number" name="winnerTotalPoints" value={formData.winnerTotalPoints} onChange={handleChange} placeholder="Winner Total Points" className="form-input" />
  </div>

  <div>
    <label className="form-label">First Runner Up Points</label>
    <input type="number" name="firstRunnerUpTotalPoints" value={formData.firstRunnerUpTotalPoints} onChange={handleChange} placeholder="1st Runner Up Points" className="form-input" />
  </div>

  <div>
    <label className="form-label">Second Runner Up Points</label>
    <input type="number" name="secondRunnerUpTotalPoints" value={formData.secondRunnerUpTotalPoints} onChange={handleChange} placeholder="2nd Runner Up Points" className="form-input" />
  </div>

  <div>
    <label className="form-label">Third Runner Up Points</label>
    <input type="number" name="thirdRunnerUpTotalPoints" value={formData.thirdRunnerUpTotalPoints} onChange={handleChange} placeholder="3rd Runner Up Points" className="form-input" />
  </div>

  {/* Textareas */}
  <div className="form-section">
    <label className="form-label">Description (Theme)</label>
    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description (Theme)" className="form-textarea" />
  </div>

  <div className="form-section">
    <label className="form-label">Highlights</label>
    <textarea name="Highlights" value={formData.Highlights} onChange={handleChange} placeholder="Highlights" className="form-textarea" />
  </div>

  <div className="form-section">
    <label className="form-label">Feedback</label>
    <textarea name="feedback" value={formData.feedback} onChange={handleChange} placeholder="Feedback" className="form-textarea" />
  </div>

  {/* Dynamic arrays */}
  <div className="form-section">
    <h3>Sponsors</h3>
    {formData.sponsors.map((s, i) => (
      <div key={i} className="array-item">
        <input value={s} onChange={(e) => handleArrayChange("sponsors", i, e.target.value)} placeholder="Sponsor" className="form-input flex-1" />
        <button type="button" onClick={() => removeArrayItem("sponsors", i)} className="btn btn-danger">X</button>
      </div>
    ))}
    <button type="button" onClick={() => addArrayItem("sponsors")} className="btn btn-success">+ Add Sponsor</button>
  </div>

  <div className="form-section">
    <h3>Memorable Moments</h3>
    {formData.memmorableMoments.map((m, i) => (
      <div key={i} className="array-item">
        <input value={m} onChange={(e) => handleArrayChange("memmorableMoments", i, e.target.value)} placeholder="Moment" className="form-input flex-1" />
        <button type="button" onClick={() => removeArrayItem("memmorableMoments", i)} className="btn btn-danger">X</button>
      </div>
    ))}
    <button type="button" onClick={() => addArrayItem("memmorableMoments")} className="btn btn-success">+ Add Moment</button>
  </div>

  <button type="submit" className="btn btn-primary">Update Event</button>
</form>

    </div>
  );
}

export default EditHistory;

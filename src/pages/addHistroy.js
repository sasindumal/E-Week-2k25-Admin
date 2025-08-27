import React, { useState } from "react";
import axios from "axios";
import "./AddHistroy.css";

function AddHistroy() {
   const BASE_URL = process.env.REACT_APP_BASE_URL;
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
    category: [],
    events: [],
    totalParticipants: "",
    totalTeams: "",
    totalEvents: "",
    totalPoints: "",
    winnerTotalPoints: "",
    firstRunnerUpTotalPoints: "",
    secondRunnerUpTotalPoints: "",
    thirdRunnerUpTotalPoints: "",
    description: "",
    Highlights: "",
    memmorableMoments: [],
    sponsors: [],
    feedback: "",
  });

  const [eventItem, setEventItem] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    winners: "",
    firstRunnerUp: "",
    secondRunnerUp: "",
    thirdRunnerUp: "",
  });

  const [categoryItem, setCategoryItem] = useState({
    gameschampion: "",
    AthleticChampion: "",
    skillstormChampion: "",
  });

  // Generic input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Event input handler
  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setEventItem((prev) => ({ ...prev, [name]: value }));
  };

  const addEvent = () => {
    if (!eventItem.title) return alert("Event title is required");
    setFormData((prev) => ({ ...prev, events: [...prev.events, eventItem] }));
    setEventItem({
      title: "",
      date: "",
      time: "",
      location: "",
      winners: "",
      firstRunnerUp: "",
      secondRunnerUp: "",
      thirdRunnerUp: "",
    });
  };

  // Category handling
  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setCategoryItem((prev) => ({ ...prev, [name]: value }));
  };

  const addCategory = () => {
    if (
      !categoryItem.gameschampion &&
      !categoryItem.AthleticChampion &&
      !categoryItem.skillstormChampion
    ) {
      return alert("Please enter at least one champion.");
    }
    setFormData((prev) => ({
      ...prev,
      category: [
        ...prev.category,
        {
          gameschampion: categoryItem.gameschampion
            ? categoryItem.gameschampion.split(",")
            : [],
          AthleticChampion: categoryItem.AthleticChampion
            ? categoryItem.AthleticChampion.split(",")
            : [],
          skillstormChampion: categoryItem.skillstormChampion
            ? categoryItem.skillstormChampion.split(",")
            : [],
        },
      ],
    }));
    setCategoryItem({
      gameschampion: "",
      AthleticChampion: "",
      skillstormChampion: "",
    });
  };

  // Memorable Moments
  const addMoment = () => {
    setFormData((prev) => ({
      ...prev,
      memmorableMoments: [...prev.memmorableMoments, ""],
    }));
  };
  const handleMomentChange = (index, value) => {
    const moments = [...formData.memmorableMoments];
    moments[index] = value;
    setFormData((prev) => ({ ...prev, memmorableMoments: moments }));
  };

  // Sponsors
  const addSponsor = () => {
    setFormData((prev) => ({ ...prev, sponsors: [...prev.sponsors, ""] }));
  };
  const handleSponsorChange = (index, value) => {
    const sponsors = [...formData.sponsors];
    sponsors[index] = value;
    setFormData((prev) => ({ ...prev, sponsors }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.events.length === 0)
      return alert("Please add at least one event.");
    if (formData.category.length === 0)
      return alert("Please add at least one category.");
    if (formData.sponsors.length === 0 || !formData.sponsors[0])
      return alert("Please add at least one sponsor.");
    if (formData.memmorableMoments.length === 0 || !formData.memmorableMoments[0])
      return alert("Please add at least one memorable moment.");

    try {
      const response = await axios.post(
        `${BASE_URL}/api/EweekHistroy/createEweekHistroy`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      alert("Eweek history created successfully!");
      console.log("Response:", response.data);

      // Reset form
      setFormData({
        eventName: "",
        eventId: "",
        winners: "",
        firstRunnerUp: "",
        secondRunnerUp: "",
        thirdRunnerUp: "",
        Startdate: "",
        Enddate: "",
        status: "",
        category: [],
        events: [],
        totalParticipants: "",
        totalTeams: "",
        totalEvents: "",
        totalPoints: "",
        winnerTotalPoints: "",
        firstRunnerUpTotalPoints: "",
        secondRunnerUpTotalPoints: "",
        thirdRunnerUpTotalPoints: "",
        description: "",
        Highlights: "",
        memmorableMoments: [],
        sponsors: [],
        feedback: "",
      });
    } catch (err) {
      console.error("Error sending JSON:", err);
      alert("Failed to create event.");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Create E-Week History</h2>
      <form onSubmit={handleSubmit} className="form">
        {/* Main Details */}
        <div className="form-section">
          <h3>Main Details</h3>
          <input type="text" name="eventName" value={formData.eventName} onChange={handleChange} placeholder="Event Name" required />
          <input type="text" name="eventId" value={formData.eventId} onChange={handleChange} placeholder="Event ID" required />
          <input type="text" name="winners" value={formData.winners} onChange={handleChange} placeholder="Winner" required />
          <input type="text" name="firstRunnerUp" value={formData.firstRunnerUp} onChange={handleChange} placeholder="First Runner Up" required />
          <input type="text" name="secondRunnerUp" value={formData.secondRunnerUp} onChange={handleChange} placeholder="Second Runner Up" required />
          <input type="text" name="thirdRunnerUp" value={formData.thirdRunnerUp} onChange={handleChange} placeholder="Third Runner Up" required />
          <input type="date" name="Startdate" value={formData.Startdate} onChange={handleChange} required />
          <input type="date" name="Enddate" value={formData.Enddate} onChange={handleChange} required />
          <input type="text" name="status" value={formData.status} onChange={handleChange} placeholder="Status" required />
        </div>

        {/* Numerical Stats */}
        <div className="form-section">
          <h3>Statistics</h3>
          <input type="number" name="totalParticipants" value={formData.totalParticipants} onChange={handleChange} placeholder="Total Participants" required />
          <input type="number" name="totalTeams" value={formData.totalTeams} onChange={handleChange} placeholder="Total Teams" required />
          <input type="number" name="totalEvents" value={formData.totalEvents} onChange={handleChange} placeholder="Total Events" required />
          <input type="number" name="totalPoints" value={formData.totalPoints} onChange={handleChange} placeholder="Total Points" required />
          <input type="number" name="winnerTotalPoints" value={formData.winnerTotalPoints} onChange={handleChange} placeholder="Winner Total Points" required />
          <input type="number" name="firstRunnerUpTotalPoints" value={formData.firstRunnerUpTotalPoints} onChange={handleChange} placeholder="1st Runner Up Points" required />
          <input type="number" name="secondRunnerUpTotalPoints" value={formData.secondRunnerUpTotalPoints} onChange={handleChange} placeholder="2nd Runner Up Points" required />
          <input type="number" name="thirdRunnerUpTotalPoints" value={formData.thirdRunnerUpTotalPoints} onChange={handleChange} placeholder="3rd Runner Up Points" required />
        </div>

        {/* Description & Highlights */}
        <div className="form-section">
          <h3>Additional Info</h3>
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" rows={2} required />
          <textarea name="Highlights" value={formData.Highlights} onChange={handleChange} placeholder="Highlights (comma-separated)" rows={2} required />
        </div>

        {/* Category */}
        <div className="form-section">
          <h3>Category Champions (comma-separated)</h3>
          <input type="text" name="gameschampion" value={categoryItem.gameschampion} onChange={handleCategoryChange} placeholder="Games Champions" />
          <input type="text" name="AthleticChampion" value={categoryItem.AthleticChampion} onChange={handleCategoryChange} placeholder="Athletic Champions" />
          <input type="text" name="skillstormChampion" value={categoryItem.skillstormChampion} onChange={handleCategoryChange} placeholder="SkillStorm Champions" />
          <button type="button" onClick={addCategory} className="btn-add">Add Category</button>
        </div>

        {/* Sponsors */}
        <div className="form-section">
          <h3>Sponsors</h3>
          {formData.sponsors.map((sponsor, index) => (
            <input key={index} type="text" value={sponsor} onChange={(e) => handleSponsorChange(index, e.target.value)} placeholder={`Sponsor ${index + 1}`} required />
          ))}
          <button type="button" onClick={addSponsor} className="btn-add">Add Sponsor</button>
        </div>

        {/* Memorable Moments */}
        <div className="form-section">
          <h3>Memorable Moments</h3>
          {formData.memmorableMoments.map((moment, index) => (
            <input key={index} type="text" value={moment} onChange={(e) => handleMomentChange(index, e.target.value)} placeholder={`Moment ${index + 1}`} required />
          ))}
          <button type="button" onClick={addMoment} className="btn-add">Add Moment</button>
        </div>

        {/* Events */}
        <div className="form-section">
          <h3>Events</h3>
          <input type="text" name="title" value={eventItem.title} onChange={handleEventChange} placeholder="Event Title" />
          <input type="date" name="date" value={eventItem.date} onChange={handleEventChange} />
          <input type="time" name="time" value={eventItem.time} onChange={handleEventChange} />
          <input type="text" name="location" value={eventItem.location} onChange={handleEventChange} placeholder="Location" />
          <input type="text" name="winners" value={eventItem.winners} onChange={handleEventChange} placeholder="Winner" />
          <input type="text" name="firstRunnerUp" value={eventItem.firstRunnerUp} onChange={handleEventChange} placeholder="First Runner Up" />
          <input type="text" name="secondRunnerUp" value={eventItem.secondRunnerUp} onChange={handleEventChange} placeholder="Second Runner Up" />
          <input type="text" name="thirdRunnerUp" value={eventItem.thirdRunnerUp} onChange={handleEventChange} placeholder="Third Runner Up" />
          <button type="button" onClick={addEvent} className="btn-add">Add Event</button>
        </div>

        {/* Feedback */}
        <div className="form-section">
          <h3>Feedback</h3>
          <textarea name="feedback" value={formData.feedback} onChange={handleChange} placeholder="Feedback" rows={2} required />
        </div>

        <button type="submit" className="btn-submit">Submit E-Week History</button>
      </form>
    </div>
  );
}

export default AddHistroy;

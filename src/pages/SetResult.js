import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Trophy, Medal, Award, Save, ArrowLeft, Calendar, Clock, MapPin, Users } from "lucide-react";
import "./SetResult.css";

const SetResult = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const location = useLocation();
  const navigate = useNavigate();
  const eventId = location.state?.eventId || "";

  const [event, setEvent] = useState({});
  const [formData, setFormData] = useState({
    winners: "",
    firstRunnerUp: "",
    secondRunnerUp: "",
    thirdRunnerUp: "",
    status: "finished",
  });

  const [secondFormData, setSecondFormData] = useState({
    eventId: eventId,
    eventName: "",
    E22Rank: "",
    E23Rank: "",
    E24Rank: "",
    E21Rank: "",
    StaffRank: "",
    E22Score: "",
    E23Score: "",
    E24Score: "",
    E21Score: "",
    StaffScore: "",
  });

  const [loading, setLoading] = useState(false);

  const options = ["E21", "E22", "E23", "E24", "Staff"];

  // Handle dropdown changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Check if same participant is selected twice
  const hasDuplicates = () => {
    const selections = [
      formData.winners,
      formData.firstRunnerUp,
      formData.secondRunnerUp,
      formData.thirdRunnerUp,
    ].filter(Boolean);
    return new Set(selections).size !== selections.length;
  };

  // Fetch event data once
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/createEvents/getEventsById`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ eventId }),
          }
        );
        if (!response.ok) throw new Error("Failed to fetch event details");
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };
    fetchEvent();
  }, [eventId]);

  // Update secondFormData whenever event or formData changes
  useEffect(() => {
    if (!event.pointsConfiguration) return;

    const positionOrder = [
      "winners",
      "firstRunnerUp",
      "secondRunnerUp",
      "thirdRunnerUp",
    ];
    const scores = event.pointsConfiguration;

    const updatedFormData = {
      eventId: eventId,
      eventName: event.title || "",
      E22Rank: "",
      E23Rank: "",
      E24Rank: "",
      E21Rank: "",
      StaffRank: "",
      E22Score: "",
      E23Score: "",
      E24Score: "",
      E21Score: "",
      StaffScore: "",
    };

    positionOrder.forEach((position, index) => {
      const team =
        position === "winners"
          ? formData.winners || event.winners
          : position === "firstRunnerUp"
          ? formData.firstRunnerUp || event.firstRunnerUp
          : position === "secondRunnerUp"
          ? formData.secondRunnerUp || event.secondRunnerUp
          : formData.thirdRunnerUp || event.thirdRunnerUp;

      if (team) {
        updatedFormData[`${team}Rank`] = position;
        updatedFormData[`${team}Score`] = scores[index];
      }
    });

    setSecondFormData(updatedFormData);
  }, [event, eventId, formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (hasDuplicates()) {
      alert("Please select different participants for each position.");
      return;
    }

    try {
      setLoading(true);

      // Save results to terminateEvent endpoint
      const res = await fetch(
        `${BASE_URL}/api/createEvents/terminateEvent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId, ...formData }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to set result");
      }

      // Save results to leaderboard
      const lbRes = await fetch(
        `${BASE_URL}/api/LeaderBoard/addEventResult`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(secondFormData),
        }
      );

      if (!lbRes.ok) {
        const lbErrorData = await lbRes.json();
        throw new Error("Failed to update leaderboard: " + (lbErrorData.message || "Unknown error"));
      }

      alert("Result successfully saved!");
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Error saving result: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPositionIcon = (position) => {
    switch (position) {
      case "winners":
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case "firstRunnerUp":
        return <Medal className="w-5 h-5 text-gray-400" />;
      case "secondRunnerUp":
        return <Award className="w-5 h-5 text-amber-600" />;
      case "thirdRunnerUp":
        return <Award className="w-5 h-5 text-orange-600" />;
      default:
        return null;
    }
  };

  const getPositionLabel = (position) => {
    switch (position) {
      case "winners":
        return "Winner";
      case "firstRunnerUp":
        return "1st Runner-up";
      case "secondRunnerUp":
        return "2nd Runner-up";
      case "thirdRunnerUp":
        return "3rd Runner-up";
      default:
        return position;
    }
  };

  return (
    <div className="set-result-container">
      <div className="set-result-content">
        {/* Header */}
        <div className="result-header">
          <button 
            onClick={() => navigate(-1)} 
            className="back-button"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="page-title">Set Event Result</h1>
          <p className="page-subtitle">Finalize competition results and update leaderboard</p>
        </div>

        {/* Event Info Card */}
        {event.title && (
          <div className="event-info-card">
            <div className="event-header">
              <h2 className="event-title">{event.title}</h2>
              <div className="event-status finished">Finished</div>
            </div>
            <div className="event-details-grid">
              <div className="event-detail">
                <Calendar className="w-4 h-4" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="event-detail">
                <Clock className="w-4 h-4" />
                <span>{event.time}</span>
              </div>
              <div className="event-detail">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
              {event.eventType && (
                <div className="event-detail">
                  <Users className="w-4 h-4" />
                  <span>{event.eventType}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Form */}
        <div className="results-form-card">
          <div className="form-header">
            <h3 className="form-title">Set Competition Results</h3>
            <p className="form-description">
              Select the winning teams for each position. Each team can only be selected once.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="result-form">
            <div className="positions-grid">
              {["winners", "firstRunnerUp", "secondRunnerUp", "thirdRunnerUp"].map(
                (position, idx) => (
                  <div key={position} className="position-card">
                    <div className="position-header">
                      {getPositionIcon(position)}
                      <h4 className="position-title">{getPositionLabel(position)}</h4>
                    </div>
                    <select
                      name={position}
                      value={formData[position]}
                      onChange={handleChange}
                      required
                      className="position-select"
                    >
                      <option value="">
                        Select {getPositionLabel(position)}
                      </option>
                      {options.map((opt) => (
                        <option
                          key={opt}
                          value={opt}
                          disabled={
                            Object.values(formData).includes(opt) &&
                            formData[position] !== opt
                          }
                        >
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                )
              )}
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="save-button"
                disabled={loading}
              >
                {loading ? (
                  <div className="loading-spinner" />
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Results
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetResult;

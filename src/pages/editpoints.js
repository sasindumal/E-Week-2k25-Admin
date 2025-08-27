import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditPointsForm = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const { team,points } = useParams(); // Get team from URL
  const navigate = useNavigate();
  const [newpoints, setNewpoints] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newpoints || newpoints < 0) {
      alert("Please enter a valid points value.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/LeaderBoard/updatePoints/${team}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ points: newpoints }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update points");
      }

      const result = await response.json();
      console.log("Points updated successfully:", result);
      alert("Points updated successfully!");
      navigate("/admin/leaderboard");
    } catch (error) {
      console.error("Error updating points:", error);
      alert("Failed to update points: " + error.message);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#1f1f1f",
          padding: "30px",
          borderRadius: "10px",
          color: "white",
          width: "300px",
          boxShadow: "0 0 10px rgba(0,0,0,0.5)"
        }}
      >
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
          Edit Points - {team}
        </h2>
        <label style={{ display: "block", marginBottom: "10px" }}>
          New Points:
        </label>
        <input
          type="number"
          value={newpoints}
          onChange={(e) => setNewpoints(e.target.value)}
          placeholder={`Current Points: ${points}`}
          required
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #555",
            marginBottom: "20px"
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#ef4444",
            color: "white",
            padding: "10px",
            width: "100%",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Save Points
        </button>
      </form>
    </div>
  );
};

export default EditPointsForm;

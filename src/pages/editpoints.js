import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditPointsForm = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const { team,points } = useParams(); // Get team from URL
  const navigate = useNavigate();
  const [mode, setMode] = useState('set'); // 'set' or 'adjust'
  const [value, setValue] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const base = parseInt(points || '0');
    const input = parseInt(value);
    if (isNaN(input)) {
      alert("Enter a valid number.");
      return;
    }

    const finalPoints = mode === 'adjust' ? Math.max(0, base + input) : Math.max(0, input);

    try {
      const response = await fetch(`${BASE_URL}/api/LeaderBoard/updatePoints/${team}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ points: finalPoints }),
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
          width: "320px",
          boxShadow: "0 0 10px rgba(0,0,0,0.5)"
        }}
      >
        <h2 style={{ marginBottom: "16px", textAlign: "center" }}>
          Edit Points - {team}
        </h2>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button type="button" onClick={() => setMode('set')} style={{ flex: 1, padding: 8, borderRadius: 6, border: mode==='set'? '1px solid #ef4444':'1px solid #555', background: mode==='set'? '#3b0b0b':'transparent', color: '#fff' }}>Set</button>
          <button type="button" onClick={() => setMode('adjust')} style={{ flex: 1, padding: 8, borderRadius: 6, border: mode==='adjust'? '1px solid #ef4444':'1px solid #555', background: mode==='adjust'? '#3b0b0b':'transparent', color: '#fff' }}>Adjust ±</button>
        </div>

        <label style={{ display: "block", marginBottom: "10px" }}>
          {mode === 'set' ? 'New Total Points' : `Adjust By (Current: ${points})`}
        </label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={mode === 'set' ? `e.g. ${points}` : '+/- value'}
          required
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #555",
            marginBottom: "20px"
          }}
        />
        <div style={{ display:'flex', gap:8 }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: "#374151",
              color: "white",
              padding: "10px",
              width: "50%",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              backgroundColor: "#ef4444",
              color: "white",
              padding: "10px",
              width: "50%",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPointsForm;

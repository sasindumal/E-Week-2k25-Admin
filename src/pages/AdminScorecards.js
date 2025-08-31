import React, { useEffect, useMemo, useState } from "react";
import { Trophy, Medal, Award, Trash2, Edit, PlusCircle, X, Save, Shield } from "lucide-react";
import Sidebar from "./sidebar";

const BATCHES = ["E21", "E22", "E23", "E24", "Staff"];
const RANK_KEYS = ["winners", "firstRunnerUp", "secondRunnerUp", "thirdRunnerUp"];

const rankLabel = (key) => {
  switch (key) {
    case "winners":
      return "Winner";
    case "firstRunnerUp":
      return "1st Runner-up";
    case "secondRunnerUp":
      return "2nd Runner-up";
    case "thirdRunnerUp":
      return "3rd Runner-up";
    default:
      return key;
  }
};

const positionIcon = (key) => {
  const props = { size: 16 };
  if (key === "winners") return <Trophy {...props} className="text-yellow-400" />;
  if (key === "firstRunnerUp") return <Medal {...props} className="text-gray-300" />;
  if (key === "secondRunnerUp") return <Award {...props} className="text-amber-600" />;
  if (key === "thirdRunnerUp") return <Award {...props} className="text-orange-600" />;
  return null;
};

const AdminScorecards = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [loading, setLoading] = useState(false);
  const [finishedEvents, setFinishedEvents] = useState([]);
  const [leaderboardRaw, setLeaderboardRaw] = useState(null);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // full event object
  const [formRanks, setFormRanks] = useState({ winners: "", firstRunnerUp: "", secondRunnerUp: "", thirdRunnerUp: "" });
  const [formScores, setFormScores] = useState({}); // { E21: number, ... }
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [lbRes, finRes] = await Promise.all([
        fetch(`${BASE_URL}/api/LeaderBoard/getLeaderBoard`).then((r) => r.json()),
        fetch(`${BASE_URL}/api/createEvents/FinishedEvents`).then((r) => r.json()),
      ]);
      setLeaderboardRaw(lbRes || {});
      setFinishedEvents(Array.isArray(finRes) ? finRes : []);
    } catch (e) {
      console.error(e);
      setError("Failed to load scorecards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const eventsById = useMemo(() => {
    const map = {};
    finishedEvents.forEach((ev) => {
      map[ev._id || ev.id] = ev;
    });
    return map;
  }, [finishedEvents]);

  const scorecards = useMemo(() => {
    const lb = leaderboardRaw;
    const list = [];
    if (lb && Array.isArray(lb.EventId)) {
      lb.EventId.forEach((eventId, idx) => {
        const event = eventsById[eventId] || {};
        const scores = BATCHES.map((batch) => ({
          batch,
          score: Array.isArray(lb[batch]) ? Number(lb[batch][idx]) || 0 : 0,
          rank: Array.isArray(lb[`${batch}Rank`]) ? lb[`${batch}Rank`][idx] : "",
        }))
          .filter((s) => typeof s.score === "number")
          .sort((a, b) => (b.score || 0) - (a.score || 0));
        list.push({
          id: eventId,
          name: (Array.isArray(lb.EventName) && lb.EventName[idx]) || event.title || "Event",
          date: event.date,
          winners: event.winners || (scores[0]?.batch ?? ""),
          placements: scores,
        });
      });
    } else {
      // Fallback: finished events without per-batch scores
      finishedEvents.forEach((ev) => {
        list.push({ id: ev._id, name: ev.title, date: ev.date, winners: ev.winners || "", placements: [] });
      });
    }
    return list;
  }, [leaderboardRaw, eventsById, finishedEvents]);

  const openEditModal = (eventId) => {
    const ev = eventsById[eventId];
    if (!ev) return;

    // Prefill ranks from event winners fields if present, else derive from leaderboard for this event index
    const idx = (leaderboardRaw?.EventId || []).findIndex((id) => id === eventId);
    const preScores = {};

    BATCHES.forEach((b) => {
      const s = Array.isArray(leaderboardRaw?.[b]) && idx >= 0 ? Number(leaderboardRaw[b][idx]) || 0 : 0;
      preScores[b] = s;
    });

    setFormScores(preScores);
    setFormRanks({
      winners: ev.winners || "",
      firstRunnerUp: ev.firstRunnerUp || "",
      secondRunnerUp: ev.secondRunnerUp || "",
      thirdRunnerUp: ev.thirdRunnerUp || "",
    });
    setEditingEvent(ev);
    setModalOpen(true);
  };

  const openAddModal = () => {
    // Allow adding for any finished event; pick the most recent without winners if possible
    const target = finishedEvents.find((e) => !e.winners && !e.firstRunnerUp && !e.secondRunnerUp && !e.thirdRunnerUp) || finishedEvents[0];
    if (!target) return;
    const pre = {};
    BATCHES.forEach((b) => (pre[b] = 0));
    setFormScores(pre);
    setFormRanks({ winners: "", firstRunnerUp: "", secondRunnerUp: "", thirdRunnerUp: "" });
    setEditingEvent(target);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingEvent(null);
  };

  const handleRankChange = (pos, value) => {
    setFormRanks((prev) => ({ ...prev, [pos]: value }));
  };

  const handleScoreChange = (batch, value) => {
    const v = Number(value);
    setFormScores((prev) => ({ ...prev, [batch]: isNaN(v) ? 0 : v }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!editingEvent) return;

    const selected = Object.values(formRanks).filter(Boolean);
    const hasDup = new Set(selected).size !== selected.length;
    if (hasDup) {
      alert("Each position must be a different batch");
      return;
    }

    try {
      setSubmitting(true);

      // 1) Update event winners on event document
      const updateRes = await fetch(`${BASE_URL}/api/createEvents/UpdateEventsById`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: editingEvent._id || editingEvent.id,
          winners: formRanks.winners || null,
          firstRunnerUp: formRanks.firstRunnerUp || null,
          secondRunnerUp: formRanks.secondRunnerUp || null,
          thirdRunnerUp: formRanks.thirdRunnerUp || null,
          status: "finished",
          registrationOpen: false,
        }),
      });

      if (!updateRes.ok) {
        const j = await updateRes.json().catch(() => ({}));
        throw new Error(j.message || "Failed to update event");
      }

      // 2) Update leaderboard with addEventResult (idempotent for edits)
      const payload = {
        eventId: editingEvent._id || editingEvent.id,
        eventName: editingEvent.title,
      };
      BATCHES.forEach((b) => {
        const rankKey = Object.entries(formRanks).find(([, batch]) => batch === b)?.[0] || "";
        if (rankKey) {
          payload[`${b}Rank`] = rankKey;
          payload[`${b}Score`] = Number(formScores[b]) || 0;
        }
      });

      const lbRes = await fetch(`${BASE_URL}/api/LeaderBoard/addEventResult`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!lbRes.ok) {
        const j = await lbRes.json().catch(() => ({}));
        throw new Error(j.message || "Failed to update leaderboard");
      }

      alert("Scorecard saved successfully");
      closeModal();
      await loadData();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to save scorecard");
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (eventId) => {
    alert("Delete scorecard is not supported by current API. We can add a server endpoint to remove an event result from leaderboard if you want.");
  };

  return (
    <div className="admin-leaderboard">
      <Sidebar />
      <main className="leaderboard-main" style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 16px" }}>
        <div className="leaderboard-header" style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 className="page-title">Scorecards Management</h1>
          <p className="page-subtitle">View, add, and edit event scorecards. Changes automatically update the leaderboard.</p>
          <div style={{ marginTop: 16 }}>
            <button onClick={openAddModal} className="btn-modern btn-secondary-modern inline-flex items-center gap-2" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <PlusCircle size={18} />
              <span>Add Scorecard</span>
            </button>
          </div>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "24px" }}>Loading scorecards...</div>
        )}
        {error && (
          <div style={{ textAlign: "center", padding: "12px", color: "#f87171" }}>{error}</div>
        )}

        {!loading && (
          <div className="leaderboard-container" style={{ background: "rgba(255,255,255,0.02)", borderRadius: 12, padding: 16 }}>
            <div className="leaderboard-table-wrapper" style={{ overflowX: "auto" }}>
              <table className="leaderboard-table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Event</th>
                    <th style={{ textAlign: "left" }}>Winner</th>
                    <th style={{ textAlign: "left" }}>Placements (Score)</th>
                    <th style={{ width: 160 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {scorecards.map((sc) => (
                    <tr key={sc.id} className="leaderboard-row">
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Shield size={16} />
                          <div>
                            <div style={{ fontWeight: 600 }}>{sc.name}</div>
                            <div style={{ fontSize: 12, opacity: 0.7 }}>{sc.date ? new Date(sc.date).toLocaleDateString() : ""}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{sc.winners || "—"}</td>
                      <td>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {sc.placements.length > 0 ? (
                            sc.placements.map((p) => (
                              <span key={p.batch} className="badge" style={{ background: "rgba(255,255,255,0.06)", padding: "6px 10px", borderRadius: 999 }}>
                                {p.batch}: <strong style={{ marginLeft: 6 }}>{p.score}</strong>
                              </span>
                            ))
                          ) : (
                            <span style={{ opacity: 0.7 }}>No scores yet</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => openEditModal(sc.id)} title="Edit" className="btn-modern inline-flex items-center gap-2" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                            <Edit size={16} /> Edit
                          </button>
                          <button onClick={() => onDelete(sc.id)} title="Delete" className="btn-modern inline-flex items-center gap-2" style={{ display: "inline-flex", alignItems: "center", gap: 6, opacity: 0.7 }}>
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {modalOpen && editingEvent && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 2000 }}>
          <div style={{ width: "100%", maxWidth: 720, background: "#121826", borderRadius: 12, padding: 16, boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Edit Scorecard – {editingEvent.title}</h3>
              <button onClick={closeModal} title="Close" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={onSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {RANK_KEYS.map((rk) => (
                  <div key={rk}>
                    <label style={{ display: "block", marginBottom: 6, fontSize: 12, opacity: 0.8 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>{positionIcon(rk)} {rankLabel(rk)}</span>
                    </label>
                    <select
                      value={formRanks[rk] || ""}
                      onChange={(e) => handleRankChange(rk, e.target.value)}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 8, background: "#0f172a", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }}
                      required={rk === "winners"}
                    >
                      <option value="">Select batch</option>
                      {BATCHES.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "14px 0" }} />

              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
                {BATCHES.map((b) => (
                  <div key={b}>
                    <label style={{ display: "block", marginBottom: 6, fontSize: 12, opacity: 0.8 }}>{b} points</label>
                    <input
                      type="number"
                      min="0"
                      value={formScores[b] ?? 0}
                      onChange={(e) => handleScoreChange(b, e.target.value)}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 8, background: "#0f172a", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
                <button type="button" onClick={closeModal} className="btn-modern" style={{ opacity: 0.8 }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-modern btn-secondary-modern inline-flex items-center gap-2" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Save size={16} /> {submitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminScorecards;

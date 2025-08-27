import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Admin Pages Only
import AdminDashboard from "./pages/AdminDashBoard";
import ManageEvents from "./pages/ManageEvents";
import EventForm from "./pages/EventForm";
import EditableEventForm from "./pages/EditableEventForm";
import SetResult from "./pages/SetResult";
import AdminLeaderBoard from "./pages/AdminLeaderBoard";
import EditPointsForm from "./pages/editpoints";
import AdminSkillStorm from "./pages/AdminSkillStorm";
import AdminHistory from "./pages/AdminHistroy";
import AddHistory from "./pages/addHistroy";
import EditHistory from "./pages/editHistroy";
import NotFound from "./pages/NotFound";

// Context
import { AppProvider } from "./context/AppContext";

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Main admin dashboard as landing page */}
            <Route path="/" element={<AdminDashboard />} />
            
            {/* Admin Routes with /admin prefix */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/ManageEvents" element={<ManageEvents />} />
            <Route path="/admin/EventForm" element={<EventForm />} />
            <Route path="/admin/EditableEventForm" element={<EditableEventForm />} />
            <Route path="/admin/SetResult" element={<SetResult />} />
            <Route path="/admin/skillstorm" element={<AdminSkillStorm />} />
            <Route path="/admin/leaderboard" element={<AdminLeaderBoard/>} />
            <Route path="/admin/history" element={<AdminHistory />} />
            <Route path="/admin/addHistroy" element={<AddHistory/>} />
            <Route path="/admin/editHistroy/:id" element={<EditHistory />} />
            <Route path="/admin/edit-points/:team/:points" element={<EditPointsForm />} />
            
            {/* Catch all other routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;

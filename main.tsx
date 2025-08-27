import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Admin Pages Only
import AdminLogin from "./src/pages/AdminLogin";
import AdminHistory from "./src/pages/AdminHistroy";
import AdminDashboard from "./src/pages/AdminDashBoard";
import ManageEvents from "./src/pages/ManageEvents";
import EventForm from "./src/pages/EventForm";
import EditableEventForm from "./src/pages/EditableEventForm";
import SetResult from "./src/pages/SetResult";
import AdminLeaderBoard from "./src/pages/AdminLeaderBoard";
import EditPointsForm from "./src/pages/editpoints";
import AdminSkillStorm from "./src/pages/AdminSkillStorm";
import AddHistory from "./src/pages/addHistroy";
import EditHistory from "./src/pages/editHistroy";

// Context
import { AppProvider } from "./src/context/AppContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Redirect root to admin login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Admin Login */}
            <Route path="/login" element={<AdminLogin />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/history" element={<AdminHistory />} />
            <Route path="/admin/ManageEvents" element={<ManageEvents />} />
            <Route path="/admin/EventForm" element={<EventForm />} />
            <Route path="/admin/EditableEventForm" element={<EditableEventForm />} />
            <Route path="/admin/SetResult" element={<SetResult />} />
            <Route path="/admin/skillstorm" element={<AdminSkillStorm />} />
            <Route path="/admin/leaderboard" element={<AdminLeaderBoard />} />
            <Route path="/admin/addHistroy" element={<AddHistory />} />
            <Route path="/admin/editHistroy/:id" element={<EditHistory />} />
            <Route path="/admin/edit-points/:team/:points" element={<EditPointsForm />} />
            
            {/* Catch all other routes and redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);

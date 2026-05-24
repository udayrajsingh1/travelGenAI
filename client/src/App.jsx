import { Routes, Route, Navigate } from "react-router-dom";
import Navbar         from "./components/ui/Navbar";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import HomePage       from "./pages/HomePage";
import LoginPage      from "./pages/LoginPage";
import SignupPage     from "./pages/SignupPage";
import DashboardPage  from "./pages/DashboardPage";
import PlannerPage    from "./pages/PlannerPage";
import ItineraryPage  from "./pages/ItineraryPage";
 
function App() {
  return (
    <div className="min-h-screen bg-[#020817]">
      <Navbar />
      <Routes>
        <Route path="/"        element={<HomePage />} />
        <Route path="/login"   element={<LoginPage />} />
        <Route path="/signup"  element={<SignupPage />} />
 
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/planner"   element={<ProtectedRoute><PlannerPage /></ProtectedRoute>} />
        <Route path="/trips/:id" element={<ProtectedRoute><ItineraryPage /></ProtectedRoute>} />
 
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
 
export default App;

import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import CitizensPortal from "./CitizensPortal";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import WorkerLogin from "./WorkerLogin";
import WorkerDashboard from "./WorkerDashboard";

function App() {
  return (
    <Routes>
      {/* ✅ HOME PAGE */}
      <Route path="/" element={<Home />} />

      {/* ✅ CITIZEN PORTAL */}
      <Route path="/citizen" element={<CitizensPortal />} />

      {/* ✅ ADMIN */}
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }
      />

      {/* ✅ WORKER */}
      <Route path="/worker-login" element={<WorkerLogin />} />
      <Route path="/worker-dashboard" element={<WorkerDashboard />} />
    </Routes>
  );
}

export default App;
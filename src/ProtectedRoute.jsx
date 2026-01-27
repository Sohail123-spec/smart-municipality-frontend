import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isAdminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";

  return isAdminLoggedIn ? children : <Navigate to="/admin-login" />;
}

export default ProtectedRoute;
import { Navigate } from "react-router-dom";

function ProtectedAdminRoute({ children }) {
  const isAdminLoggedIn = localStorage.getItem("adminLoggedIn");

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}

export default ProtectedAdminRoute;
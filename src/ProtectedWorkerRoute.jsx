import { Navigate } from "react-router-dom";

function ProtectedWorkerRoute({ children }) {
  const isWorkerLoggedIn = localStorage.getItem("isWorkerLoggedIn");
  return isWorkerLoggedIn ? children : <Navigate to="/worker-login" />;
}

export default ProtectedWorkerRoute;
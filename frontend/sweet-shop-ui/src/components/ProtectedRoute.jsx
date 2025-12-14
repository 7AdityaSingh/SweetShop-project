import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children, adminOnly = false }) {
  const { token, role } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;

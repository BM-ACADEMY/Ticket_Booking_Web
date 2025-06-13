// src/module/auth/LoginRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/module/context/AuthContext";

const LoginRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return null; // or a loader/spinner

  return isLoggedIn ? <Navigate to="/" replace /> : children;
};

export default LoginRoute;

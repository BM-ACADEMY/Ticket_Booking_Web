import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/module/context/AuthContext";

const PrivateRoute = () => {
 const { isLoggedIn, loading } = useAuth();

  if (loading) return null; // or loader/spinner
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

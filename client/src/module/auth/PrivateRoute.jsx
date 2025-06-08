import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/module/context/AuthContext";

const PrivateRoute = () => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

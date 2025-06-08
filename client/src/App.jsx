import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/module/context/AuthContext";
import Page from "@/module/dashboard/Page";
import { routes } from "@/routes";
import LoginPage from "@/module/pages/LoginPage";
import PrivateRoute from "@/module/auth/PrivateRoute";
import LoginRoute from "@/module/auth/LoginRoute"; // ✅ Import LoginRoute
import ForgotPasswordForm from "./module/pages/ForgotPasswordForm";
import ResetPasswordForm from "./module/pages/ResetPasswordForm";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route with LoginRoute wrapper to prevent logged-in users from seeing login again */}
          <Route
            path="/login"
            element={
              <LoginRoute>
                <LoginPage />
              </LoginRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password/:token" element={<ResetPasswordForm />} />

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<Page />}>
              {routes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

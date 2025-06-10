import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/module/context/AuthContext";
import Page from "@/module/dashboard/Page";
import { routes } from "@/routes";
import LoginPage from "@/module/pages/LoginPage";
import PrivateRoute from "@/module/auth/PrivateRoute";
import LoginRoute from "@/module/auth/LoginRoute"; // ✅ Import LoginRoute
import ForgotPasswordForm from "./module/pages/ForgotPasswordForm";
import ResetPasswordForm from "./module/pages/ResetPasswordForm";
import Events from "./module/pages/Events";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
          <Route path="/shows/new" element={<Events />} />
          <Route path="/shows/edit/:id" element={<Events />} />

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
        <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AuthProvider>
  );
}

export default App;

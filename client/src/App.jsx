import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/module/context/AuthContext";
import Page from "@/module/dashboard/Page";
import { routes } from "@/routes";
import LoginPage from "@/module/pages/LoginPage"; // import your login page
import PrivateRoute from "@/module/auth/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route (No Layout) */}
          <Route path="/login" element={<LoginPage />} />

          {/* Private Routes (With Layout) */}
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

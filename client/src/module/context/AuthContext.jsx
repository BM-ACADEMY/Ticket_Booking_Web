// src/module/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
   const [user, setUser] = useState(null)

  // Check login status
  const checkLoginStatus = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin-and-subAdmin/verify-me`,
        { withCredentials: true }
      );
      setIsLoggedIn(true);
       setUser(res.data.admin)
    } catch (err) {
      if (err.response?.status === 401) {
        setIsLoggedIn(false);
        setUser(null)
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial check on mount
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Re-check when tab becomes active
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkLoginStatus();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

   const login = (userData) => {
    setIsLoggedIn(true)
    setUser(userData)
  }

  const logout = async () => {
    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/admin-and-subAdmin/logout`,
      {},
      { withCredentials: true }
    );
    setIsLoggedIn(false);
        setUser(null)
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn,user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

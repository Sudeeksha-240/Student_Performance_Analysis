import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashboard from "./StudentDashboard";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    // Listen for storage changes (logout from another tab)
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Routes>

      {/* default */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* LOGIN */}
      <Route
        path="/login"
        element={
          token ? <Navigate to="/dashboard" /> : <Login setToken={setToken} />
        }
      />

      {/* SIGNUP */}
      <Route
        path="/signup"
        element={
          token ? <Navigate to="/dashboard" /> : <Signup />
        }
      />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          token ? <StudentDashboard setToken={setToken} /> : <Navigate to="/login" />
        }
      />

    </Routes>
  );
}

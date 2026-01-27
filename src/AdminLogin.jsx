import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "./assets/smart-city-bg.jpg";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "admin123") {
      localStorage.setItem("adminLoggedIn", "true"); // ✅ SESSION
      navigate("/admin-dashboard");
    } else {
      setError("Invalid Admin Credentials");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: "360px",
          padding: "26px",
          background: "rgba(255,255,255,0.85)",
          borderRadius: "14px",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#b71c1c" }}>Admin Login</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" style={buttonStyle}>
          Login to Dashboard
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  background: "#b71c1c",
  color: "#fff",
  border: "none",
};

export default AdminLogin;
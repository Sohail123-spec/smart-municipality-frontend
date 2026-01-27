import React, { useState } from "react";
import bgImage from "./assets/smart-city-bg.jpg";

function WorkerLogin() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const allowedWorkers = ["Ravi", "Ram", "Shyam", "Hari", "Raju"];

  const handleLogin = (e) => {
    e.preventDefault();

    if (allowedWorkers.includes(name)) {
      localStorage.setItem("workerName", name);
      localStorage.setItem("isWorkerLoggedIn", "true");
      window.location.href = "/worker-dashboard";
    } else {
      setError("Unauthorized Worker");
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
          background: "rgba(255,255,255,0.85)",
          padding: "24px",
          borderRadius: "12px",
          width: "320px",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#1976d2" }}>
          Worker Login
        </h2>

        <input
          type="text"
          placeholder="Worker Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginTop: "12px" }}
        />

        {error && (
          <p style={{ color: "red", marginTop: "8px", textAlign: "center" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            marginTop: "14px",
            padding: "10px",
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default WorkerLogin;
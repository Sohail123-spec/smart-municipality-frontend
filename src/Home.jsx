import React from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "./assets/smart-city-bg.jpg";

function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* TITLE – TOP CENTER */}
      <h1
        style={{
          marginTop: "40px",
          marginBottom: "40px",
          color: "#ffffff",
          fontSize: "52px",
          fontWeight: "800",
          textAlign: "center",
          textShadow: "2px 2px 10px rgba(0,0,0,0.6)",
        }}
      >
        Smart Municipality Portal
      </h1>

      {/* CENTER CARD */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.92)",
            padding: "40px",
            borderRadius: "18px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            width: "300px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
          }}
        >
          <button style={btnStyle} onClick={() => navigate("/citizen")}>
            Citizen
          </button>

          <button style={btnStyle} onClick={() => navigate("/admin-login")}>
            Admin
          </button>

          <button style={btnStyle} onClick={() => navigate("/worker-login")}>
            Worker
          </button>
        </div>
      </div>
    </div>
  );
}

const btnStyle = {
  padding: "14px",
  fontSize: "17px",
  fontWeight: "600",
  background: "#1976d2",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
};

export default Home;
import React, { useState, useEffect } from "react";
import bgImage from "./assets/smart-city-bg.jpg";
import { API_URL } from "./config";

/* ✅ Animation Library */
import { motion, AnimatePresence } from "framer-motion";

function CitizenPortal() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  /* ✅ Ward input */
  const [ward, setWard] = useState("");

  /* ✅ GPS Coords */
  const [coords, setCoords] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  const [image, setImage] = useState(null);

  /* ✅ Submit Success */
  const [submitted, setSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState("");
  const [timestamp, setTimestamp] = useState("");

  /* ✅ Check Status */
  const [checkId, setCheckId] = useState("");
  const [statusResult, setStatusResult] = useState(null);

  /* ✅ Recover Complaints */
  const [allComplaints, setAllComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);

  /* ✅ Active Tab State */
  const [activeTab, setActiveTab] = useState("complaint");

  /* ================= LOCATION CAPTURE ================= */
  const captureLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by browser!");
      return;
    }

    setGpsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });

        setGpsLoading(false);

        alert(`✅ Location Captured!\nAccuracy: ${pos.coords.accuracy} meters`);
      },
      (err) => {
        console.log("GPS Error:", err);
        setGpsLoading(false);
        alert("❌ Unable to capture location. Please allow GPS permission.");
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );
  };

  /* ================= IMAGE ================= */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  /* ================= SUBMIT COMPLAINT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coords) {
      alert("⚠️ Please capture live location before submitting complaint!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/complaints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          description,
          ward,
          image,
          geoLocation: {
            lat: coords.lat,
            lng: coords.lng,
          },
        }),
      });

      const data = await res.json();

      setComplaintId(data._id);
      setTimestamp(new Date(data.createdAt).toLocaleString());
      setSubmitted(true);

      /* ✅ Refresh complaints list immediately */
      fetchAllComplaints();

      /* ✅ Switch to Status Tab */
      setActiveTab("status");
    } catch {
      alert("Failed to submit complaint");
    }
  };

  /* ================= CHECK STATUS ================= */
  const checkStatus = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/complaints/${checkId.trim()}`
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      setStatusResult(data);
    } catch {
      alert("Invalid Complaint ID or not found");
      setStatusResult(null);
    }
  };

  /* ================= FETCH ALL COMPLAINTS ================= */
  const fetchAllComplaints = async () => {
    try {
      setLoadingComplaints(true);

      const res = await fetch(`${API_URL}/api/complaints`);
      const data = await res.json();

      setAllComplaints(data);
      setLoadingComplaints(false);
    } catch {
      console.log("Failed to fetch complaints");
      setLoadingComplaints(false);
    }
  };

  /* LOAD RECOVER LIST ON PAGE LOAD */
  useEffect(() => {
    fetchAllComplaints();
  }, []);

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
      <div style={card}>
        <h2 style={{ textAlign: "center", color: "#1976d2" }}>
          Smart Municipality Portal
        </h2>

        <p style={{ textAlign: "center", marginBottom: "12px" }}>
          Citizen Complaint Portal
        </p>

        {/* ✅ TAB BAR */}
        <div style={tabBar}>
          <button
            style={activeTab === "complaint" ? tabActive : tabBtn}
            onClick={() => setActiveTab("complaint")}
          >
            File Complaint
          </button>

          <button
            style={activeTab === "status" ? tabActive : tabBtn}
            onClick={() => setActiveTab("status")}
          >
            Track Status
          </button>

          <button
            style={activeTab === "recover" ? tabActive : tabBtn}
            onClick={() => setActiveTab("recover")}
          >
            Recover ID
          </button>
        </div>

        {/* ✅ ANIMATED TAB CONTENT */}
        <AnimatePresence mode="wait">
          {/* ✅ TAB 1: COMPLAINT FORM */}
          {activeTab === "complaint" && (
            <motion.div
              key="complaint"
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.4 }}
            >
              {!submitted ? (
                <form onSubmit={handleSubmit}>
                  <select
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={input}
                  >
                    <option value="">Select Issue</option>
                    <option>Garbage Overflow</option>
                    <option>Water Leakage</option>
                    <option>Road Damage</option>
                    <option>Street Light Issue</option>
                    <option>Drainage Problem</option>
                  </select>

                  <select
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={input}
                  >
                    <option value="">Select Category</option>
                    <option>Garbage</option>
                    <option>Water</option>
                    <option>Roads</option>
                    <option>Lights</option>
                    <option>Drainage</option>
                  </select>

                  <textarea
                    required
                    placeholder="Describe the issue"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={input}
                  />

                  <input
                    required
                    placeholder="Ward / Area"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    style={input}
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />

                  <button
                    type="button"
                    style={btnGreen}
                    onClick={captureLocation}
                    disabled={gpsLoading}
                  >
                    {gpsLoading ? "Capturing..." : "Capture Live Location"}
                  </button>

                  {coords && (
                    <div style={{ fontSize: "13px", marginTop: "8px" }}>
                      ✅ Lat: {coords.lat} <br />
                      ✅ Lng: {coords.lng} <br />
                      🎯 Accuracy: {coords.accuracy} meters <br />
                      <a
                        href={`https://www.google.com/maps?q=${coords.lat},${coords.lng}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        📍 Preview on Google Maps
                      </a>
                    </div>
                  )}

                  <button type="submit" style={btnBlue}>
                    Submit Complaint
                  </button>
                </form>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <h3 style={{ color: "#2e7d32" }}>
                    Complaint Submitted Successfully ✅
                  </h3>

                  <p>
                    <b>Complaint ID:</b> {complaintId}
                  </p>

                  <p>
                    <b>Submitted At:</b> {timestamp}
                  </p>

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setActiveTab("complaint");
                    }}
                    style={btnBlue}
                  >
                    Submit Another Complaint
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ✅ TAB 2: STATUS CHECK */}
          {activeTab === "status" && (
            <motion.div
              key="status"
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.4 }}
            >
              <h3 style={{ color: "#1976d2" }}>Check Complaint Status</h3>

              <input
                placeholder="Enter Complaint ID"
                value={checkId}
                onChange={(e) => setCheckId(e.target.value)}
                style={input}
              />

              <button onClick={checkStatus} style={btnBlue}>
                Check Status
              </button>

              {statusResult && (
                <div style={statusBox}>
                  <p>
                    <b>Status:</b> {statusResult.status}
                  </p>
                  <p>
                    <b>Assigned Worker:</b>{" "}
                    {statusResult.assignedWorker || "Not Assigned"}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* ✅ TAB 3: RECOVER ID */}
          {activeTab === "recover" && (
            <motion.div
              key="recover"
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.4 }}
            >
              <h3 style={{ color: "#1976d2" }}>Recover Your Complaint ID</h3>

              {loadingComplaints ? (
                <p>Loading complaints...</p>
              ) : allComplaints.length === 0 ? (
                <p>No complaints found</p>
              ) : (
                <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {allComplaints.map((c) => (
                    <div key={c._id} style={recoverBox}>
                      <p>
                        <b>ID:</b> {c._id}
                      </p>
                      <p>
                        <b>Status:</b> {c.status}
                      </p>
                      <p style={{ fontSize: "12px" }}>
                        {new Date(c.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ✅ STYLES UNCHANGED */
const card = {
  background: "rgba(255,255,255,0.9)",
  padding: "24px",
  borderRadius: "14px",
  width: "380px",
};

const tabBar = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "15px",
};

const tabBtn = {
  flex: 1,
  padding: "8px",
  margin: "2px",
  borderRadius: "8px",
  border: "1px solid #1976d2",
  background: "white",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "12px",
};

const tabActive = {
  ...tabBtn,
  background: "#1976d2",
  color: "white",
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #999",
};

const btnBlue = {
  width: "100%",
  padding: "10px",
  background: "#1976d2",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  marginTop: "10px",
};

const btnGreen = {
  ...btnBlue,
  background: "#2e7d32",
};

const statusBox = {
  marginTop: "10px",
  padding: "10px",
  background: "#e3f2fd",
  borderRadius: "8px",
};

const recoverBox = {
  background: "#f5f5f5",
  padding: "8px",
  borderRadius: "6px",
  marginBottom: "6px",
};

export default CitizenPortal;
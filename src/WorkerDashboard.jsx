import React, { useEffect, useState } from "react";
import bgImage from "./assets/smart-city-bg.jpg";
import { API_URL } from "./config";

function WorkerDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [zoomImage, setZoomImage] = useState(null);
  const [completionImage, setCompletionImage] = useState({});
  const [activeTab, setActiveTab] = useState("active");

  /* ✅ Worker proof location */
  const [liveLocation, setLiveLocation] = useState({});

  /* ✅ Track proof submitted per complaint */
  const [submittedProof, setSubmittedProof] = useState({});

  const workerName = localStorage.getItem("workerName");

  useEffect(() => {
    if (!workerName) {
      window.location.href = "/worker-login";
      return;
    }
    fetchComplaints();
  }, [workerName]);

  /* ✅ Fetch Assigned Complaints */
  const fetchComplaints = () => {
    fetch(`${API_URL}/api/complaints`)
      .then((res) => res.json())
      .then((data) => {
        const assigned = data.filter(
          (c) =>
            c.assignedWorker &&
            c.assignedWorker.toLowerCase() === workerName.toLowerCase()
        );

        setComplaints(assigned);

        /* ✅ Auto mark already submitted proof */
        const proofMap = {};
        assigned.forEach((c) => {
          if (c.completionImage) {
            proofMap[c._id] = true;
          }
        });
        setSubmittedProof(proofMap);
      })
      .catch(() => {
        alert("Failed to load complaints");
      });
  };

  /* ✅ Logout */
  const logout = () => {
    localStorage.removeItem("workerName");
    localStorage.removeItem("isWorkerLoggedIn");
    window.location.href = "/worker-login";
  };

  /* ✅ Upload Completion Proof */
  const handleImageUpload = (e, id) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCompletionImage((prev) => ({
        ...prev,
        [id]: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  /* ✅ Capture Worker Location Proof */
  const captureLocation = (id) => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLiveLocation((prev) => ({
          ...prev,
          [id]: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
        }));

        alert("✅ Worker Live Location Captured!");
      },
      () => alert("Unable to fetch location")
    );
  };

  /* ✅ Open Complaint Location in Google Maps */
  const openInMaps = (geoLocation) => {
    if (!geoLocation) {
      alert("Complaint GPS location not available!");
      return;
    }

    const lat = geoLocation.lat || geoLocation.latitude;
    const lng = geoLocation.lng || geoLocation.longitude;

    if (!lat || !lng) {
      alert("Complaint GPS location not available!");
      return;
    }

    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, "_blank");
  };

  /* ✅ Submit Work Proof (NO status change) */
  const submitWork = async (complaint) => {
    if (!completionImage[complaint._id]) {
      alert("⚠️ Upload completion proof image!");
      return;
    }

    if (!liveLocation[complaint._id]) {
      alert("⚠️ Capture your live location proof!");
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/api/complaints/${complaint._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            completionImage: completionImage[complaint._id],
            workerGeoLocation: liveLocation[complaint._id],
          }),
        }
      );

      if (!res.ok) throw new Error();

      /* ✅ Disable button after submission */
      setSubmittedProof((prev) => ({
        ...prev,
        [complaint._id]: true,
      }));

      fetchComplaints();
    } catch {
      alert("Failed to submit work proof");
    }
  };

  /* ✅ Revert Proof Submission */
  const revertWork = async (complaint) => {
    try {
      const res = await fetch(
        `${API_URL}/api/complaints/${complaint._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            completionImage: "",
            workerGeoLocation: null,
          }),
        }
      );

      if (!res.ok) throw new Error();

      alert("✅ Reverted Successfully");
      fetchComplaints();
    } catch {
      alert("Failed to revert work");
    }
  };

  /* ✅ Tab Filtering */
  const filteredComplaints = complaints.filter((c) =>
    activeTab === "active"
      ? c.status !== "Resolved"
      : c.status === "Resolved"
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        padding: "20px",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#1976d2", fontSize: "28px" }}>
        Worker Dashboard – {workerName}
      </h2>

      {/* ✅ Tabs */}
      <div style={{ textAlign: "center", marginBottom: "12px" }}>
        <button
          style={tabBtn(activeTab === "active")}
          onClick={() => setActiveTab("active")}
        >
          Active Complaints
        </button>

        <button
          style={tabBtn(activeTab === "completed")}
          onClick={() => setActiveTab("completed")}
        >
          Completed Work
        </button>

        <button onClick={logout} style={logoutBtn}>
          Logout
        </button>
      </div>

      {/* ✅ Complaints Table */}
      <div style={card}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={th}>ID</th>
              <th style={th}>Title</th>
              <th style={th}>Ward</th>
              <th style={th}>Location</th>
              <th style={th}>Evidence</th>
              <th style={th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredComplaints.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No records assigned
                </td>
              </tr>
            ) : (
              filteredComplaints.map((c) => (
                <tr key={c._id}>
                  <td style={td}>{c._id}</td>
                  <td style={td}>{c.title}</td>

                  <td style={td}>{c.ward || "Not Provided"}</td>

                  <td style={td}>
                    <button
                      style={locBtn}
                      onClick={() => openInMaps(c.geoLocation)}
                    >
                      Open Location
                    </button>
                  </td>

                  <td style={td}>
                    {c.image ? (
                      <img
                        src={c.image}
                        alt="citizen"
                        style={thumb}
                        onClick={() => setZoomImage(c.image)}
                      />
                    ) : (
                      "No Evidence"
                    )}
                  </td>

                  {/* ✅ Action Column */}
                  <td style={td}>
                    {activeTab === "active" ? (
                      <>
                        <button
                          style={locBtn}
                          onClick={() => captureLocation(c._id)}
                        >
                          Capture Proof Location
                        </button>

                        {liveLocation[c._id] && (
                          <div style={{ fontSize: "12px", marginTop: "4px" }}>
                            ✅ Lat: {liveLocation[c._id].lat}
                            <br />
                            ✅ Lng: {liveLocation[c._id].lng}
                          </div>
                        )}

                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, c._id)}
                        />

                        {/* ✅ Disable button + show message */}
                        {submittedProof[c._id] ? (
                          <p
                            style={{
                              fontSize: "13px",
                              color: "green",
                              marginTop: "6px",
                            }}
                          >
                            ✅ Proof Submitted <br />
                            Waiting for Admin Approval
                          </p>
                        ) : (
                          <button
                            style={completeBtn}
                            onClick={() => submitWork(c)}
                          >
                            Submit Work Proof
                          </button>
                        )}
                      </>
                    ) : (
                      <button style={revertBtn} onClick={() => revertWork(c)}>
                        Revert
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Zoom Evidence */}
      {zoomImage && (
        <div style={zoomOverlay} onClick={() => setZoomImage(null)}>
          <img src={zoomImage} alt="zoom" style={zoomImageStyle} />
        </div>
      )}
    </div>
  );
}

/* ✅ STYLES UNCHANGED */
const card = {
  background: "rgba(255,255,255,0.9)",
  padding: "20px",
  borderRadius: "12px",
};

const tableStyle = { width: "100%", borderCollapse: "collapse" };
const th = { border: "1px solid #ccc", padding: "10px", background: "#f5f5f5" };
const td = { border: "1px solid #ddd", padding: "10px" };

const thumb = { width: "100px", cursor: "zoom-in", borderRadius: "6px" };

const tabBtn = (active) => ({
  padding: "8px 14px",
  margin: "0 6px",
  background: active ? "#1976d2" : "#ccc",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
});

const logoutBtn = {
  marginLeft: "10px",
  padding: "8px 14px",
  background: "#b71c1c",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
};

const completeBtn = {
  marginTop: "6px",
  padding: "6px 10px",
  background: "#2e7d32",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
};

const revertBtn = {
  padding: "6px 10px",
  background: "#f57c00",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
};

const locBtn = {
  marginBottom: "6px",
  padding: "6px 10px",
  background: "#1565c0",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const zoomOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.8)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const zoomImageStyle = {
  maxWidth: "90%",
  maxHeight: "90%",
};

export default WorkerDashboard;
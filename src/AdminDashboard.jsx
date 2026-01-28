import React, { useEffect, useState } from "react";
import bgImage from "./assets/smart-city-bg.jpg";
import { API_URL } from "./config";

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [zoomImage, setZoomImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [originalComplaint, setOriginalComplaint] = useState(null);

  /* ✅ multi-select state */
  const [selectedIds, setSelectedIds] = useState([]);

  const workersByCategory = {
    Garbage: "Ravi",
    Drainage: "Ram",
    Water: "Shyam",
    Roads: "Hari",
    Lights: "Raju",
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    window.location.href = "/admin-login";
  };

  /* ✅ Safe Fetch Complaints */
  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/complaints`);

      if (!res.ok) throw new Error("Backend returned error");

      const data = await res.json();

      if (!Array.isArray(data)) {
        console.log("Unexpected response:", data);
        setComplaints([]);
        return;
      }

      setComplaints(data);
    } catch (err) {
      console.error("Fetch complaints failed:", err);
      alert("❌ Failed to load complaints. Please refresh.");
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  /* ✅ Save Changes */
  const saveChanges = async () => {
    if (!selectedComplaint) return;

    if (
      selectedComplaint.status === "In Progress" &&
      !selectedComplaint.assignedWorker
    ) {
      alert("⚠️ Assign a worker before marking In Progress");
      return;
    }

    const res = await fetch(
      `${API_URL}/api/complaints/${selectedComplaint._id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: selectedComplaint.status,
          assignedWorker: selectedComplaint.assignedWorker,
        }),
      }
    );

    if (res.ok) {
      alert("Updated successfully");
      setSelectedComplaint(null);
      fetchComplaints();
    } else {
      alert("Failed to update");
    }
  };

  /* ✅ Reject Complaint */
  const rejectComplaint = async () => {
    if (!selectedComplaint) return;

    const res = await fetch(
      `${API_URL}/api/complaints/${selectedComplaint._id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Rejected" }),
      }
    );

    if (res.ok) {
      alert("Complaint rejected");
      setSelectedComplaint(null);
      fetchComplaints();
    } else {
      alert("Failed to reject");
    }
  };

  /* ✅ Move Complaint To Bin */
  const moveToBin = async () => {
    if (!selectedComplaint) return;

    const res = await fetch(
      `${API_URL}/api/complaints/${selectedComplaint._id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Binned" }),
      }
    );

    if (res.ok) {
      alert("Moved to Bin");
      setSelectedComplaint(null);
      fetchComplaints();
    } else {
      alert("Failed to move to bin");
    }
  };

  /* ✅ ✅ REQUIRED UPDATE: Permanent Delete */
  const permanentlyDelete = async (id) => {
    const confirmDelete = window.confirm(
      "⚠️ Are you sure you want to permanently delete this complaint?"
    );

    if (!confirmDelete) return;

    const res = await fetch(`${API_URL}/api/complaints/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("✅ Complaint Permanently Deleted!");
      fetchComplaints();
    } else {
      alert("❌ Failed to delete complaint");
    }
  };

  /* ✅ Bulk Reject */
  const bulkReject = async () => {
    if (selectedIds.length === 0) return;

    await Promise.all(
      selectedIds.map((id) =>
        fetch(`${API_URL}/api/complaints/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Rejected" }),
        })
      )
    );

    setSelectedIds([]);
    fetchComplaints();
  };

  /* ✅ Bulk Move To Bin */
  const bulkMoveToBin = async () => {
    if (selectedIds.length === 0) return;

    await Promise.all(
      selectedIds.map((id) =>
        fetch(`${API_URL}/api/complaints/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Binned" }),
        })
      )
    );

    setSelectedIds([]);
    fetchComplaints();
  };

  /* ✅ Filter Complaints */
  const filteredComplaints = Array.isArray(complaints)
    ? complaints.filter((c) => {
        if (activeTab === "active")
          return (
            c.status !== "Resolved" &&
            c.status !== "Rejected" &&
            c.status !== "Binned"
          );
        if (activeTab === "resolved") return c.status === "Resolved";
        if (activeTab === "rejected") return c.status === "Rejected";
        if (activeTab === "bin") return c.status === "Binned";
        return false;
      })
    : [];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        padding: "20px",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#1976d2" }}>
        Admin Dashboard
      </h1>

      {/* ✅ Tabs */}
      <div style={{ textAlign: "center", marginBottom: "14px" }}>
        <button
          style={tabBtn(activeTab === "active")}
          onClick={() => setActiveTab("active")}
        >
          Active Complaints
        </button>

        <button
          style={tabBtn(activeTab === "resolved")}
          onClick={() => setActiveTab("resolved")}
        >
          Resolved Complaints
        </button>

        <button
          style={tabBtn(activeTab === "rejected")}
          onClick={() => setActiveTab("rejected")}
        >
          Rejected Complaints
        </button>

        <button
          style={tabBtn(activeTab === "bin")}
          onClick={() => setActiveTab("bin")}
        >
          Bin
        </button>

        <button onClick={handleLogout} style={logoutBtn}>
          Logout
        </button>
      </div>

      {/* ✅ Bulk Actions */}
      {selectedIds.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <button style={rejectBtn} onClick={bulkReject}>
            Reject Selected
          </button>
          <button style={binBtn} onClick={bulkMoveToBin}>
            Move Selected to Bin
          </button>
        </div>
      )}

      {/* ✅ Complaints Table */}
      {loading ? (
        <p>Loading complaints...</p>
      ) : (
        <div style={tableWrapper}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={th}></th>
                <th style={th}>ID</th>
                <th style={th}>Title</th>
                <th style={th}>Category</th>
                <th style={th}>Location</th>
                <th style={th}>Submitted At</th>
                <th style={th}>Citizen Proof</th>
                <th style={th}>Worker Proof</th>
                <th style={th}>Worker Time</th>
                <th style={th}>Status</th>

                {/* ✅ NEW COLUMN ONLY FOR BIN */}
                {activeTab === "bin" && (
                  <th style={th}>Delete</th>
                )}
              </tr>
            </thead>

            <tbody>
              {filteredComplaints.map((c) => (
                <tr key={c._id}>
                  <td style={td}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(c._id)}
                      onChange={(e) =>
                        setSelectedIds((prev) =>
                          e.target.checked
                            ? [...prev, c._id]
                            : prev.filter((id) => id !== c._id)
                        )
                      }
                    />
                  </td>

                  <td style={td}>{c._id}</td>
                  <td style={td}>{c.title}</td>
                  <td style={td}>{c.category}</td>

                  <td style={td}>{c.ward || "Not Provided"}</td>

                  <td style={td}>
                    {new Date(c.createdAt).toLocaleString()}
                  </td>

                  <td style={td}>
                    {c.image ? (
                      <img
                        src={c.image}
                        alt=""
                        style={{ ...thumb, cursor: "zoom-in" }}
                        onClick={() => setZoomImage(c.image)}
                      />
                    ) : (
                      "No Evidence"
                    )}
                  </td>

                  <td style={td}>
                    {c.completionImage ? (
                      <img
                        src={c.completionImage}
                        alt=""
                        style={{ ...thumb, cursor: "zoom-in" }}
                        onClick={() => setZoomImage(c.completionImage)}
                      />
                    ) : (
                      "No Evidence"
                    )}
                  </td>

                  <td style={td}>
                    {c.updatedAt
                      ? new Date(c.updatedAt).toLocaleString()
                      : "-"}
                  </td>

                  <td style={td}>{c.status}</td>

                  {/* ✅ Permanent Delete Button ONLY IN BIN */}
                  {activeTab === "bin" && (
                    <td style={td}>
                      <button
                        style={{
                          padding: "6px 10px",
                          background: "darkred",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                        onClick={() => permanentlyDelete(c._id)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Image Zoom */}
      {zoomImage && (
        <div style={zoomOverlay} onClick={() => setZoomImage(null)}>
          <img src={zoomImage} alt="zoom" style={zoomImageStyle} />
        </div>
      )}
    </div>
  );
}

/* ✅ STYLES UNCHANGED */
const tableWrapper = {
  background: "rgba(255,255,255,0.9)",
  padding: "12px",
  borderRadius: "12px",
};
const tableStyle = { width: "100%", borderCollapse: "collapse" };
const th = { border: "1px solid #ccc", padding: "10px", background: "#f5f5f5" };
const td = { border: "1px solid #ddd", padding: "10px" };
const thumb = { width: "60px", borderRadius: "6px" };

const tabBtn = (a) => ({
  padding: "8px 14px",
  margin: "0 6px",
  background: a ? "#1976d2" : "#ccc",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
});

const logoutBtn = {
  marginLeft: "10px",
  padding: "8px 14px",
  background: "#b71c1c",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
};

const rejectBtn = {
  padding: "8px 14px",
  background: "#d32f2f",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
};

const binBtn = {
  padding: "8px 14px",
  background: "#616161",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
};

const zoomOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.8)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const zoomImageStyle = { maxWidth: "90%", maxHeight: "90%" };

export default AdminDashboard;
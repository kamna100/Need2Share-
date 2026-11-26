import { useEffect, useState } from "react";
const PROFILE_KEY = "need2share_profile";
const API_URL = "https://need2share-backend.onrender.com/api/donations";
const REQUEST_API_URL = "https://need2share-backend.onrender.com/api/requests";
function readLocalStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}
function Profile() {
  const [profile, setProfile] = useState(() =>
    readLocalStorage(PROFILE_KEY, {})
  );
  const [donations, setDonations] = useState([]);
  const [donationsLoading, setDonationsLoading] = useState(false);
  const [donationsError, setDonationsError] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState("");
  const [updatingRequestId, setUpdatingRequestId] = useState("");
  const [myRequests, setMyRequests] = useState([]);
  const [myRequestsLoading, setMyRequestsLoading] = useState(false);
  const [myRequestsError, setMyRequestsError] = useState("");
  const [reviewingRequestId, setReviewingRequestId] = useState("");
  const [reviewRatings, setReviewRatings] = useState({});
  const [reviewComments, setReviewComments] = useState({});
  const [reviewSubmittingId, setReviewSubmittingId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [photo, setPhoto] = useState(profile.photo || "");
  const [form, setForm] = useState({
    name: profile.name || "",
    email: profile.email || "",
    phone: profile.phone || "",
    address: profile.address || "",
    city: profile.city || "",
  });
  const [error, setError] = useState("");
  // Modal body handling
  useEffect(() => {
    document.body.classList.toggle("modal-open", showModal);
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [showModal]);
  // Sync profile if changed in another browser tab
  useEffect(() => {
    function syncStorage(event) {
      if (event.key === PROFILE_KEY) {
        const nextProfile = readLocalStorage(PROFILE_KEY, {});
        setProfile(nextProfile);
        setForm({
          name: nextProfile.name || "",
          email: nextProfile.email || "",
          phone: nextProfile.phone || "",
          address: nextProfile.address || "",
          city: nextProfile.city || "",
        });
        setPhoto(nextProfile.photo || "");
      }
    }
    window.addEventListener("storage", syncStorage);
    return () => {
      window.removeEventListener("storage", syncStorage);
    };
  }, []);
  // Fetch donations belonging to this profile
  useEffect(() => {
    const email = profile.email?.trim().toLowerCase();
    if (!email) {
      setDonations([]);
      setDonationsError("");
      setDonationsLoading(false);
      return undefined;
    }
    const controller = new AbortController();
    async function fetchMyDonations() {
      setDonationsLoading(true);
      setDonationsError("");
      try {
        const response = await fetch(API_URL, {
          signal: controller.signal,
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(
            result.message || "Could not load your donations."
          );
        }
        if (!Array.isArray(result)) {
          throw new Error("Invalid donations response from server.");
        }
        const myDonations = result.filter(
          (item) =>
            item.donorEmail?.trim().toLowerCase() === email
        );
        setDonations(myDonations);
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") {
          console.error("Profile donations error:", fetchError);
          setDonationsError(
            fetchError.message ||
              "Unable to load donations. Please try again."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setDonationsLoading(false);
        }
      }
    }
    fetchMyDonations();
    return () => controller.abort();
  }, [profile.email]);
  // Fetch requests received on this donor's donations
  useEffect(() => {
    const email = profile.email?.trim().toLowerCase();
    if (!email) {
      setRequests([]);
      setRequestsError("");
      setRequestsLoading(false);
      return undefined;
    }
    const controller = new AbortController();
    async function fetchReceivedRequests() {
      setRequestsLoading(true);
      setRequestsError("");
      try {
        const response = await fetch(REQUEST_API_URL, {
          signal: controller.signal,
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(
            result.message || "Could not load requests."
          );
        }
        if (!Array.isArray(result)) {
          throw new Error("Invalid requests response from server.");
        }
        const myRequests = result.filter((request) => {
          const donorEmail =
            request.donationId?.donorEmail?.trim().toLowerCase();
          return donorEmail === email;
        });
        setRequests(myRequests);
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") {
          console.error("Requests error:", fetchError);
          setRequestsError(
            fetchError.message || "Unable to load requests."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setRequestsLoading(false);
        }
      }
    }
    fetchReceivedRequests();
    return () => controller.abort();
  }, [profile.email]);
  // Fetch requests made by this receiver
  useEffect(() => {
    const email = profile.email?.trim().toLowerCase();
    if (!email) {
      setMyRequests([]);
      setMyRequestsError("");
      setMyRequestsLoading(false);
      return undefined;
    }
    const controller = new AbortController();
    async function fetchMyRequests() {
      setMyRequestsLoading(true);
      setMyRequestsError("");
      try {
        const response = await fetch(REQUEST_API_URL, { signal: controller.signal });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Could not load your requests.");
        if (!Array.isArray(result)) throw new Error("Invalid requests response from server.");
        setMyRequests(result.filter((request) => request.requesterEmail?.trim().toLowerCase() === email));
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") {
          console.error("My requests error:", fetchError);
          setMyRequestsError(fetchError.message || "Unable to load your requests.");
        }
      } finally {
        if (!controller.signal.aborted) setMyRequestsLoading(false);
      }
    }
    fetchMyRequests();
    return () => controller.abort();
  }, [profile.email]);

  // Close modal using Escape key
  useEffect(() => {
    if (!showModal) return undefined;
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setShowModal(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [showModal]);
  // Open edit profile modal
  function openEditor() {
    setForm({
      name: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      address: profile.address || "",
      city: profile.city || "",
    });
    setPhoto(profile.photo || "");
    setError("");
    setShowModal(true);
  }
  // Handle profile form changes
  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
    setError("");
  }
  // Handle profile photo
  function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose a valid image file.");
      event.target.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Please choose an image smaller than 2 MB.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(String(reader.result || ""));
      setError("");
    };
    reader.onerror = () => {
      setError("The photo could not be read. Please try again.");
    };
    reader.readAsDataURL(file);
  }
  // Save profile
  function saveProfile(event) {
    event.preventDefault();
    setError("");
    const cleaned = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      photo,
      updatedAt: new Date().toISOString(),
    };
    if (!cleaned.name) {
      return setError("Please enter your full name.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned.email)) {
      return setError("Please enter a valid email address.");
    }
    if (!/^[0-9]{10}$/.test(cleaned.phone)) {
      return setError("Please enter a valid 10-digit phone number.");
    }
    if (!cleaned.address) {
      return setError("Please enter your address/locality.");
    }
    if (!cleaned.city) {
      return setError("Please enter your city.");
    }
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(cleaned));
      setProfile(cleaned);
      setShowModal(false);
      setError("");
    } catch {
      setError(
        "Your profile could not be saved. Try using a smaller photo."
      );
    }
  }
  // Delete donation
  async function handleDeleteDonation(id) {
    if (!id) {
      alert("Donation ID is missing.");
      return;
    }
    const confirmed = window.confirm(
      "Are you sure you want to delete this donation?"
    );
    if (!confirmed) return;
    const email = profile.email?.trim().toLowerCase();
    if (!email) {
      alert("Please add your profile email first.");
      return;
    }
    try {
      setDeletingId(id);
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          donorEmail: email,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete donation."
        );
      }
      setDonations((previous) =>
        previous.filter((item) => item._id !== id)
      );
      setRequests((previous) =>
        previous.filter(
          (request) => request.donationId?._id !== id
        )
      );
      alert("Donation deleted successfully!");
    } catch (deleteError) {
      console.error("Delete donation error:", deleteError);
      alert(
        deleteError.message ||
          "Could not delete donation. Please try again."
      );
    } finally {
      setDeletingId("");
    }
  }
  // Accept or reject request
  async function updateRequestStatus(requestId, status) {
    if (!requestId) return;
    const confirmed = window.confirm(
      `Are you sure you want to ${status.toLowerCase()} this request?`
    );
    if (!confirmed) return;
    try {
      setUpdatingRequestId(requestId);
      const response = await fetch(
        `${REQUEST_API_URL}/${requestId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.message || "Could not update request."
        );
      }
      setRequests((previous) =>
        previous.map((request) =>
          request._id === requestId
            ? { ...request, status: result.request.status }
            : request
        )
      );
      alert(`Request ${status.toLowerCase()} successfully!`);
    } catch (updateError) {
      console.error("Request update error:", updateError);
      alert(
        updateError.message ||
          "Could not update request. Please try again."
      );
    } finally {
      setUpdatingRequestId("");
    }
  }
  // Mark an approved request as completed
  async function markRequestCompleted(requestId) {
    if (!requestId) return;
    const confirmed = window.confirm(
      "Have you handed over this donation to the requester?"
    );
    if (!confirmed) return;
    try {
      setUpdatingRequestId(requestId);
      const response = await fetch(
        `${REQUEST_API_URL}/${requestId}/complete`,
        { method: "PATCH" }
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Could not complete donation.");
      }
      setRequests((previous) =>
        previous.map((request) =>
          request._id === requestId
            ? { ...request, status: result.request?.status || "Completed" }
            : request
        )
      );
      setDonations((previous) =>
        previous.map((item) =>
          item._id === result.donation?._id
            ? { ...item, status: result.donation.status || "Completed" }
            : item
        )
      );
      alert(result.message || "Donation completed successfully!");
    } catch (completionError) {
      console.error("Completion error:", completionError);
      alert(completionError.message || "Could not complete donation.");
    } finally {
      setUpdatingRequestId("");
    }
  }
  // Submit an optional receiver review
  async function submitReview(requestId) {
    const rating = Number(reviewRatings[requestId] || 0);
    const comment = reviewComments[requestId] || "";
    const email = profile.email?.trim().toLowerCase();
    if (!rating) {
      alert("Please select a star rating.");
      return;
    }
    try {
      setReviewSubmittingId(requestId);
      const response = await fetch(`${REQUEST_API_URL}/${requestId}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requesterEmail: email, rating, comment }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Could not submit review.");
      setMyRequests((previous) => previous.map((request) => request._id === requestId ? { ...request, reviewSubmitted: true, reviewRating: rating, reviewComment: comment.trim(), reviewedAt: new Date().toISOString() } : request));
      setReviewingRequestId("");
      alert("Thank you! Your review has been submitted.");
    } catch (reviewError) {
      console.error("Review submission error:", reviewError);
      alert(reviewError.message || "Could not submit review.");
    } finally {
      setReviewSubmittingId("");
    }
  }

  const donationItems = Array.isArray(donations) ? donations : [];
  const requestItems = Array.isArray(requests) ? requests : [];
  return (
    <>
      <header className="navbar">
        <div className="nav-container">
          <a href="/" className="logo">
            <span className="logo-icon">
              <i className="fa-solid fa-recycle" />
            </span>
            <span className="logo-text">
              Need<span>2</span>Share
            </span>
          </a>
          <nav className="nav-links">
            <a href="/">Home</a>
            <a href="/explore">Explore</a>
            <a href="/donate">Donate</a>
            <a href="/profile" className="active">
              Profile
            </a>
          </nav>
          <a href="/profile" className="signup-btn">
            My Profile
          </a>
        </div>
      </header>
      <main className="profile-section">
        <div className="profile-container">
          {/* Profile main card */}
          <div
            className="profile-main-card"
            style={{ position: "relative" }}
          >
            <div className="profile-avatar">
              {profile.photo ? (
                <img
                  src={profile.photo}
                  alt="Profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                <i className="fa-solid fa-user" />
              )}
            </div>
            <div className="profile-main-info">
              <span className="profile-label">
                <i className="fa-solid fa-circle" /> COMMUNITY MEMBER
              </span>
              <h1>{profile.name || "Community Member"}</h1>
              <p>
                {profile.email ||
                  "Create your profile to start sharing."}
              </p>
            </div>
            <button
              type="button"
              className="profile-share-btn"
              onClick={openEditor}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                zIndex: 10,
              }}
            >
              <i className="fa-solid fa-pen" /> Edit Profile
            </button>
          </div>
          {/* Personal information */}
          <div className="profile-info-section">
            <div className="profile-section-heading">
              <div>
                <span className="section-label">
                  <i className="fa-solid fa-user" /> ACCOUNT
                </span>
                <h3>Personal information</h3>
              </div>
            </div>
            <div className="profile-info-grid">
              {[
                ["Full Name", profile.name],
                ["Gmail / Email", profile.email],
                ["Phone Number", profile.phone],
                ["Address / Locality", profile.address],
                ["City", profile.city],
              ].map(([label, value]) => (
                <div className="profile-info-box" key={label}>
                  <div className="profile-info-icon">
                    <i className="fa-solid fa-user" />
                  </div>
                  <div>
                    <small>{label}</small>
                    <strong>{value || "Not added"}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Activity section */}
          <div className="profile-activity">
            <div className="profile-section-heading">
              <div>
                <span className="section-label">
                  <i className="fa-solid fa-chart-simple" /> ACTIVITY
                </span>
                <h2>My sharing activity</h2>
              </div>
            </div>
            <div className="activity-stats">
              <div className="activity-box">
                <i className="fa-solid fa-box-open" />
                <strong>{donationItems.length}</strong>
                <span>Donations</span>
              </div>
              <div className="activity-box">
                <i className="fa-solid fa-hand-holding-heart" />
                <strong>{donationItems.length}</strong>
                <span>Items shared</span>
              </div>
              <div className="activity-box">
                <i className="fa-solid fa-location-dot" />
                <strong>Nearby</strong>
                <span>Self pickup</span>
              </div>
            </div>
            {/* Requests Received */}
            <div className="my-donations">
              <div className="donation-list-heading">
                <h3>Requests Received</h3>
              </div>
              {requestsLoading ? (
                <p>Loading received requests...</p>
              ) : requestsError ? (
                <p role="alert">{requestsError}</p>
              ) : !profile.email ? (
                <p>Please add your email in Edit Profile.</p>
              ) : requestItems.length === 0 ? (
                <p>No one has requested your donations yet.</p>
              ) : (
                requestItems.map((request) => (
                  <div
                    className="profile-info-box"
                    key={request._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "15px",
                      flexWrap: "wrap",
                      marginBottom: "12px",
                    }}
                  >
                    <div>
                      <strong>
                        {request.donationId?.itemName ||
                          "Donation"}
                      </strong>
                      <p>
                        Requested by:{" "}
                        {request.requesterName || "Community member"}
                      </p>
                      <p>
                        Email: {request.requesterEmail}
                      </p>
                      {request.message && (
                        <p>Message: {request.message}</p>
                      )}
                      <small>
                        Status: <strong>{request.status}</strong>
                      </small>
                    </div>
                    {request.status === "Pending" ? (
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          type="button"
                          disabled={updatingRequestId === request._id}
                          onClick={() =>
                            updateRequestStatus(request._id, "Approved")
                          }
                          style={{
                            padding: "8px 14px",
                            backgroundColor: "#168c62",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        >
                          {updatingRequestId === request._id ? "Updating..." : "Accept"}
                        </button>
                        <button
                          type="button"
                          disabled={updatingRequestId === request._id}
                          onClick={() =>
                            updateRequestStatus(request._id, "Rejected")
                          }
                          style={{
                            padding: "8px 14px",
                            backgroundColor: "#b42318",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        >
                          {updatingRequestId === request._id ? "Updating..." : "Reject"}
                        </button>
                      </div>
                    ) : request.status === "Approved" ? (
                      <button
                        type="button"
                        disabled={updatingRequestId === request._id}
                        onClick={() => markRequestCompleted(request._id)}
                        style={{
                          padding: "9px 15px",
                          backgroundColor: "#168c62",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          opacity: updatingRequestId === request._id ? 0.6 : 1,
                        }}
                      >
                        {updatingRequestId === request._id
                          ? "Completing..."
                          : "Mark as Completed"}
                      </button>
                    ) : request.status === "Completed" ? (
                      <span style={{ color: "#168c62", fontWeight: "600" }}>
                        <i className="fa-solid fa-circle-check" /> Completed
                      </span>
                    ) : null}
                  </div>
                ))
              )}
            </div>
            {/* My Requests and optional reviews */}
            <div className="my-donations">
              <div className="donation-list-heading"><h3>My Requests</h3></div>
              {myRequestsLoading ? <p>Loading your requests...</p> : myRequestsError ? <p role="alert">{myRequestsError}</p> : !profile.email ? <p>Please add your email in Edit Profile.</p> : myRequests.length === 0 ? <p>You haven't requested any donations yet.</p> : myRequests.map((request) => (
                <div className="profile-info-box" key={request._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "15px", flexWrap: "wrap", marginBottom: "12px" }}>
                  <div style={{ flex: "1 1 220px" }}>
                    <strong>{request.donationId?.itemName || "Requested donation"}</strong>
                    <p>Donor: {request.donationId?.donorName || request.donationId?.donorEmail || "Community member"}</p>
                    <small>Status: <strong>{request.status}</strong></small>
                    {request.status === "Completed" && request.reviewSubmitted && <p style={{ color: "#168c62", marginTop: "8px" }}>Your review: {"★".repeat(request.reviewRating || 0)}{"☆".repeat(5 - (request.reviewRating || 0))}{request.reviewComment ? ` — ${request.reviewComment}` : ""}</p>}
                  </div>
                  {request.status === "Completed" && !request.reviewSubmitted && (
                    <div style={{ flex: "1 1 260px" }}>
                      {reviewingRequestId !== request._id ? (
                        <button type="button" onClick={() => { setReviewingRequestId(request._id); setReviewRatings((previous) => ({ ...previous, [request._id]: 5 })); }} style={{ padding: "9px 15px", backgroundColor: "#168c62", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>Give Review</button>
                      ) : (
                        <div style={{ width: "100%" }}>
                          <p style={{ margin: "5px 0" }}>Rate your experience:</p>
                          <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
                            {[1, 2, 3, 4, 5].map((star) => <button key={star} type="button" aria-label={`${star} stars`} onClick={() => setReviewRatings((previous) => ({ ...previous, [request._id]: star }))} style={{ border: "none", background: "none", cursor: "pointer", fontSize: "25px", color: star <= (reviewRatings[request._id] || 0) ? "#f5a623" : "#aaa" }}>★</button>)}
                          </div>
                          <textarea value={reviewComments[request._id] || ""} onChange={(event) => setReviewComments((previous) => ({ ...previous, [request._id]: event.target.value }))} placeholder="Write your feedback (optional)" rows={3} style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "6px", resize: "vertical", boxSizing: "border-box" }} />
                          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                            <button type="button" disabled={reviewSubmittingId === request._id} onClick={() => submitReview(request._id)} style={{ padding: "8px 14px", backgroundColor: "#168c62", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>{reviewSubmittingId === request._id ? "Submitting..." : "Submit Review"}</button>
                            <button type="button" disabled={reviewSubmittingId === request._id} onClick={() => setReviewingRequestId("")} style={{ padding: "8px 14px", backgroundColor: "#eee", color: "#333", border: "none", borderRadius: "6px", cursor: "pointer" }}>Skip</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {request.status === "Completed" && request.reviewSubmitted && <span style={{ color: "#168c62", fontWeight: "600" }}><i className="fa-solid fa-circle-check" /> Reviewed</span>}
                </div>
              ))}
            </div>

            {/* My donations */}
            <div className="my-donations">
              <div className="donation-list-heading">
                <h3>My Donations</h3>
                <a href="/donate">+ Add new</a>
              </div>
              {donationsLoading ? (
                <p>Loading your donations...</p>
              ) : donationsError ? (
                <p role="alert">{donationsError}</p>
              ) : !profile.email ? (
                <p>
                  Please add your email in Edit Profile to view your
                  donations.
                </p>
              ) : donationItems.length === 0 ? (
                <p>You haven't shared any items yet.</p>
              ) : (
                donationItems.map((item, index) => (
                  <div
                    className="profile-info-box"
                    key={
                      item._id ||
                      item.id ||
                      `${item.itemName || "donation"}-${index}`
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "15px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div className="profile-info-icon">
                        <i className="fa-solid fa-box" />
                      </div>
                      <div>
                        <strong>
                          {item.itemName || item.title || "Shared item"}
                        </strong>
                        <p>
                          {item.category || "Resource"} ·{" "}
                          {item.quantity || "Quantity not specified"}
                        </p>
                        <small>
                          {item.location || "Location not specified"}
                        </small>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteDonation(item._id)}
                      disabled={
                        deletingId === item._id || !item._id
                      }
                      style={{
                        padding: "8px 14px",
                        backgroundColor: "#b42318",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        opacity:
                          deletingId === item._id ? 0.6 : 1,
                      }}
                    >
                      {deletingId === item._id
                        ? "Deleting..."
                        : "Delete Donation"}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Edit profile modal */}
      {showModal && (
        <div
          className="profile-modal show"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <div
            className="profile-modal-box"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-modal-title"
          >
            <button
              type="button"
              className="close-profile-modal"
              onClick={() => setShowModal(false)}
              aria-label="Close profile form"
            >
              <i className="fa-solid fa-xmark" />
            </button>
            <div className="profile-modal-header">
              <h3 id="profile-modal-title">Edit Your Profile</h3>
              <p>
                Add your details so people can identify you when
                sharing or requesting items.
              </p>
            </div>
            <form onSubmit={saveProfile}>
              <div className="form-group">
                <label htmlFor="profilePhoto">
                  Profile Photo (optional, max 2 MB)
                </label>
                <input
                  type="file"
                  id="profilePhoto"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
                {photo && (
                  <img
                    src={photo}
                    alt="Selected profile preview"
                    style={{
                      width: "76px",
                      height: "76px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      marginTop: "10px",
                    }}
                  />
                )}
              </div>
              {[
                ["name", "Full Name", "Enter your full name", "text"],
                [
                  "email",
                  "Email Address",
                  "example@gmail.com",
                  "email",
                ],
                [
                  "phone",
                  "Phone Number",
                  "10 digit mobile number",
                  "tel",
                ],
                [
                  "address",
                  "Address / Locality",
                  "Enter your locality",
                  "text",
                ],
                ["city", "City", "Enter your city", "text"],
              ].map(([name, label, placeholder, type]) => (
                <div className="form-group" key={name}>
                  <label htmlFor={`profile-${name}`}>{label}</label>
                  <input
                    id={`profile-${name}`}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={form[name]}
                    onChange={handleChange}
                    maxLength={name === "phone" ? 10 : undefined}
                    inputMode={
                      name === "phone" ? "numeric" : undefined
                    }
                    pattern={
                      name === "phone" ? "[0-9]{10}" : undefined
                    }
                    required
                  />
                </div>
              ))}
              {error && (
                <p
                  role="alert"
                  style={{ color: "#b42318", margin: "8px 0" }}
                >
                  {error}
                </p>
              )}
              <button type="submit" className="primary-btn">
                Save Profile <i className="fa-solid fa-check" />
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <a href="/" className="logo footer-logo">
              <span className="logo-icon">
                <i className="fa-solid fa-recycle" />
              </span>
              <span className="logo-text">
                Need<span>2</span>Share
              </span>
            </a>
            <p>Your extra can become someone else's need.</p>
          </div>
          <div className="footer-column">
            <h4>Explore</h4>
            <a href="/">Home</a>
            <a href="/explore">Nearby Donations</a>
          </div>
          <div className="footer-column">
            <h4>Share</h4>
            <a href="/donate">Donate an Item</a>
          </div>
          <div className="footer-column">
            <h4>Account</h4>
            <a href="/profile">My Profile</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Need2Share</span>
          <span>Don't waste it. Share it.</span>
        </div>
      </footer>
    </>
  );
}
export default Profile;

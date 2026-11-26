
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const sampleDonations = [
  {
    id: "sample-food",
    category: "food",
    itemName: "Fresh Meal Boxes",
    description: "8 freshly prepared vegetarian meal boxes available for sharing.",
    quantity: "8 portions",
    availability: "Until 8 PM",
    location: "Green Valley Society",
    distance: "0.5 km",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85",
    lat: 31.0557,
    lng: 75.7910,
  },
  {
    id: "sample-clothes",
    category: "clothes",
    itemName: "Clean Winter Clothes",
    description: "Gently used winter clothes in good condition, ready to be reused.",
    quantity: "6 pieces",
    availability: "Available",
    location: "Sunrise Apartments",
    distance: "0.8 km",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=85",
    lat: 31.0582,
    lng: 75.7950,
  },
  {
    id: "sample-books",
    category: "books",
    itemName: "Engineering Books",
    description: "Useful college books and study material looking for a new student.",
    quantity: "12 books",
    availability: "Available",
    location: "Royal Residency",
    distance: "1.1 km",
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=85",
    lat: 31.0528,
    lng: 75.7980,
  },
  {
    id: "sample-animal",
    category: "animal",
    itemName: "Dog Food Packets",
    description: "Food available for a local animal feeder.",
    quantity: "5 packets",
    availability: "Today",
    location: "Local Community",
    distance: "1.5 km",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=900&q=85",
    lat: 31.0505,
    lng: 75.7890,
  },
];

const categories = [
  { id: "all", label: "Everything", icon: "fa-border-all" },
  { id: "food", label: "Food", icon: "fa-utensils" },
  { id: "animal", label: "Animal Feed", icon: "fa-paw" },
  { id: "clothes", label: "Clothes", icon: "fa-shirt" },
  { id: "books", label: "Books", icon: "fa-book" },
  { id: "household", label: "Household", icon: "fa-chair" },
];

const DONATION_API = "http://https://need2share-backend.onrender.com/api/donations";
const REQUEST_API = "http://https://need2share-backend.onrender.com/api/requests";

function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [category, setCategory] = useState(
    searchParams.get("category") || "all"
  );

  const [donations, setDonations] = useState([]);
  const [completedDonations, setCompletedDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const savedEmail =
    localStorage.getItem("need2share_requesterEmail") || "";

  const [requestEmail, setRequestEmail] = useState(savedEmail);
  const [emailInput, setEmailInput] = useState(savedEmail);
  const [myRequests, setMyRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [reviewsByDonation, setReviewsByDonation] = useState({});

  // Fetch donations from MongoDB
  useEffect(() => {
    async function fetchDonations() {
      try {
        const response = await fetch(DONATION_API);

        if (!response.ok) {
          throw new Error("Unable to fetch donations");
        }

        const data = await response.json();

        const formattedDonations = data.map((item) => ({
          ...item,
          id: item._id,
          image: item.imageUrl || "",
        }));

        setDonations(formattedDonations);
      } catch (error) {
        console.error("Donation Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDonations();
  }, []);
useEffect(() => {
  async function fetchCompletedDonations() {
    try {
      const response = await fetch(DONATION_API);
      if (!response.ok) throw new Error("Unable to fetch completed donations");
      const data = await response.json();
      const completed = data.filter(item => item.status === "Completed");
      setCompletedDonations(completed);
    } catch (error) {
      console.error("Completed Donations Error:", error);
    }
  }
  fetchCompletedDonations();
}, []);
  // Fetch requests belonging to entered email
  async function loadMyRequests(email) {
    if (!email || !email.trim()) {
      setMyRequests([]);
      return;
    }

    setRequestsLoading(true);
    setRequestError("");

    try {
      const response = await fetch(REQUEST_API);

      if (!response.ok) {
        throw new Error("Unable to fetch your requests");
      }

      const data = await response.json();

      const filteredRequests = data.filter(
        (request) =>
          request.requesterEmail?.toLowerCase() ===
          email.trim().toLowerCase()
      );

      setMyRequests(filteredRequests);
    } catch (error) {
      console.error("My Requests Error:", error);
      setRequestError(
        error.message || "Unable to load requests"
      );
    } finally {
      setRequestsLoading(false);
    }
  }

  // Fetch submitted community reviews
  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch(REQUEST_API);
        if (!response.ok) throw new Error("Unable to fetch reviews");
        const data = await response.json();
        const groupedReviews = {};
        data.forEach((request) => {
          const donationId =
            typeof request.donationId === "object"
              ? request.donationId?._id
              : request.donationId;
          if (
            request.reviewSubmitted &&
            donationId &&
            Number(request.reviewRating) >= 1 &&
            Number(request.reviewRating) <= 5
          ) {
            if (!groupedReviews[donationId]) groupedReviews[donationId] = [];
            groupedReviews[donationId].push({
              rating: Number(request.reviewRating),
              comment: request.reviewComment || "",
              requesterName: request.requesterName || "Community member",
              donationName: request.donationId?.itemName || "Donation",
            });
          }
        });
        setReviewsByDonation(groupedReviews);
      } catch (error) {
        console.error("Review Fetch Error:", error);
      }
    }
    fetchReviews();
  }, []);

  // Load saved user's requests
  useEffect(() => {
    if (requestEmail) {
      loadMyRequests(requestEmail);
    }
  }, [requestEmail]);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setCategory(searchParams.get("category") || "all");
  }, [searchParams]);

  // Combine actual and sample donations
  const allDonations = useMemo(() => {
    const samples = sampleDonations.map((item) => ({ ...item }));

    const custom = donations.filter(
      (item) =>
        item.status === "Active" &&
        !samples.some(
          (sample) => sample.itemName === item.itemName
        )
    );

    return [...custom, ...samples];
  }, [donations]);

  // Search and category filters
  const filteredDonations = allDonations.filter((item) => {
    const text = [
      item.itemName,
      item.description,
      item.category,
      item.location,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = text.includes(
      search.trim().toLowerCase()
    );

    const matchesCategory =
      category === "all" || item.category === category;

    return matchesSearch && matchesCategory;
  });

  // Leaflet map
  useEffect(() => {
    const mapElement = document.getElementById("need2shareMap");

    if (!mapElement) return;

    const map = L.map(mapElement).setView(
      [31.0550, 75.7930],
      14
    );

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors",
      }
    ).addTo(map);

    const markerBounds = [];

    allDonations.forEach((item) => {
      const rawLatitude = item.latitude ?? item.lat;
      const rawLongitude = item.longitude ?? item.lng;

      if (
        rawLatitude === null ||
        rawLatitude === undefined ||
        rawLongitude === null ||
        rawLongitude === undefined ||
        rawLatitude === "" ||
        rawLongitude === ""
      ) {
        return;
      }

      const latitude = Number(rawLatitude);
      const longitude = Number(rawLongitude);

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude) ||
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
      ) {
        return;
      }

      const marker = L.marker([
        latitude,
        longitude,
      ]).addTo(map);

      const popupContent = document.createElement("div");
      const title = document.createElement("strong");
      const locationText = document.createElement("p");
      const quantityText = document.createElement("p");

      title.textContent = item.itemName || "Donation";
      locationText.textContent =
        item.location || "Pickup location";
      quantityText.textContent =
        `Quantity: ${item.quantity || "Not specified"}`;

      popupContent.appendChild(title);
      popupContent.appendChild(locationText);
      popupContent.appendChild(quantityText);

      marker.bindPopup(popupContent);

      markerBounds.push([latitude, longitude]);
    });

    if (markerBounds.length > 0) {
      map.fitBounds(markerBounds, {
        padding: [30, 30],
        maxZoom: 15,
      });
    }

    const resizeTimer = window.setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      window.clearTimeout(resizeTimer);
      map.remove();
    };
  }, [allDonations]);

  // Submit donation request
  async function requestDonation(item) {
    if (!item._id) {
      alert(
        "This is a sample donation. Please request an actual donation."
      );
      return;
    }

    const requesterName = prompt("Enter your name:");

    if (!requesterName || !requesterName.trim()) return;

    const requesterEmail = prompt("Enter your email:");

    if (!requesterEmail || !requesterEmail.trim()) return;

    try {
      const response = await fetch(REQUEST_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          donationId: item._id,
          requesterName: requesterName.trim(),
          requesterEmail: requesterEmail.trim().toLowerCase(),
          message: "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Request failed"
        );
      }

      const email = requesterEmail.trim().toLowerCase();

      localStorage.setItem(
        "need2share_requesterEmail",
        email
      );

      setEmailInput(email);
      setRequestEmail(email);

      await loadMyRequests(email);

      alert("Request submitted successfully!");
    } catch (error) {
      console.error("Request Error:", error);
      alert(
        error.message ||
          "Something went wrong. Please try again."
      );
    }
  }

  function handleRequestSearch(event) {
    event.preventDefault();

    const email = emailInput.trim().toLowerCase();

    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    localStorage.setItem(
      "need2share_requesterEmail",
      email
    );

    setRequestEmail(email);
    loadMyRequests(email);
  }

  function runSearch(event) {
    event.preventDefault();

    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (category !== "all") {
      params.set("category", category);
    }

    setSearchParams(params);
  }

  return (
    <>
      <header className="navbar">
        <div className="nav-container">
          <a href="/" className="logo">
            <span className="logo-icon">
              <i className="fa-solid fa-recycle"></i>
            </span>

            <span className="logo-text">
              Need<span>2</span>Share
            </span>
          </a>

          <nav className="nav-links">
            <a href="/">Home</a>
            <a href="/explore" className="active">
              Explore
            </a>
            <a href="/donate">Donate</a>
            <a href="/profile">Profile</a>
          </nav>

          <a href="/profile" className="signup-btn">
            My Profile
          </a>
        </div>
      </header>

      <section className="quick-search">
        <div className="search-container">
          <div className="search-heading">
            <span className="section-label">
              <i className="fa-solid fa-location-dot"></i>
              Near your community
            </span>

            <h2>Find something useful nearby.</h2>
          </div>

          <form className="search-box" onSubmit={runSearch}>
            <i className="fa-solid fa-magnifying-glass"></i>

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search food, clothes, books..."
              aria-label="Search donations"
            />

            <button type="submit">Search</button>
          </form>

          <div className="category-pills">
            {categories.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`filter-btn ${
                  category === item.id ? "active" : ""
                }`}
                onClick={() => {
                  setCategory(item.id);

                  const params = new URLSearchParams();

                  if (search.trim()) {
                    params.set("search", search.trim());
                  }

                  if (item.id !== "all") {
                    params.set("category", item.id);
                  }

                  setSearchParams(params);
                }}
              >
                <i className={`fa-solid ${item.icon}`}></i>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="nearby-section">
        <div className="section-container">
          <div className="section-top-row">
            <div>
              <span className="section-label">
                <i className="fa-solid fa-map-location-dot"></i>
                Live nearby listings
              </span>

              <h2>Donations around you</h2>

              <p>
                Find useful items nearby and arrange convenient
                self-pickup.
              </p>
            </div>
          </div>

          <div className="real-map-wrapper">
            <div
              id="need2shareMap"
              style={{ height: "380px", width: "100%" }}
            ></div>
          </div>

          <div className="map-features">
            <div>
              <i className="fa-solid fa-location-dot"></i>
              <span>Nearby listings</span>
            </div>

            <div>
              <i className="fa-solid fa-route"></i>
              <span>Easy directions</span>
            </div>

            <div>
              <i className="fa-solid fa-person-walking"></i>
              <span>Self pickup</span>
            </div>
          </div>

          {/* My Requests Section */}
          <section
            className="my-requests-section"
            style={{
              margin: "35px 0",
              padding: "25px",
              background: "#ffffff",
              borderRadius: "12px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ marginBottom: "20px" }}>
              <span className="section-label">
                <i className="fa-solid fa-clipboard-list"></i>
                Track your requests
              </span>

              <h3>My Requests</h3>

              <p>
                Enter the same email address you used while
                requesting a donation.
              </p>
            </div>

            <form
              onSubmit={handleRequestSearch}
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginBottom: "20px",
              }}
            >
              <input
                type="email"
                value={emailInput}
                onChange={(event) =>
                  setEmailInput(event.target.value)
                }
                placeholder="Enter your email address"
                required
                style={{
                  flex: "1",
                  minWidth: "220px",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
              />

              <button
                type="submit"
                style={{
                  padding: "12px 22px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#168c62",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Check Requests
              </button>
            </form>

            {requestsLoading && (
              <p>Loading your requests...</p>
            )}

            {requestError && (
              <p style={{ color: "red" }}>{requestError}</p>
            )}

            {!requestsLoading &&
              !requestError &&
              requestEmail &&
              myRequests.length === 0 && (
                <p>No requests found for this email address.</p>
              )}

            {!requestsLoading &&
              myRequests.map((request) => {
                const status = request.status || "Pending";
                const donation = request.donationId;

                const statusColor =
                  status === "Approved"
                    ? "#168c62"
                    : status === "Rejected"
                    ? "#dc3545"
                    : "#d18b00";

                const latitude =
                  donation?.latitude != null
                    ? Number(donation.latitude)
                    : null;

                const longitude =
                  donation?.longitude != null
                    ? Number(donation.longitude)
                    : null;

                const hasGPS =
                  latitude !== null &&
                  longitude !== null &&
                  Number.isFinite(latitude) &&
                  Number.isFinite(longitude) &&
                  latitude >= -90 &&
                  latitude <= 90 &&
                  longitude >= -180 &&
                  longitude <= 180;

                const canShowDirections =
                  status === "Approved" && hasGPS;

                const directionsUrl = canShowDirections
                  ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`
                  : "";

                return (
                  <div
                    key={request._id}
                    style={{
                      padding: "16px",
                      marginBottom: "12px",
                      border: "1px solid #e5e5e5",
                      borderRadius: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "15px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <h3 style={{ margin: "0 0 6px" }}>
                        {donation?.itemName || "Donation"}
                      </h3>

                      <p
                        style={{
                          margin: "0 0 5px",
                          color: "#666",
                        }}
                      >
                        Requested by: {request.requesterName}
                      </p>

                      <p
                        style={{
                          margin: 0,
                          color: "#777",
                          fontSize: "13px",
                        }}
                      >
                        {donation?.location ||
                          "Location not available"}
                      </p>

                      {status === "Approved" && !hasGPS && (
                        <p
                          style={{
                            color: "#b7791f",
                            fontSize: "13px",
                            marginTop: "8px",
                          }}
                        >
                          GPS directions are not available for
                          this donation yet.
                        </p>
                      )}

                      {status === "Rejected" && (
                        <p
                          style={{
                            color: "#dc3545",
                            fontSize: "13px",
                            marginTop: "8px",
                          }}
                        >
                          This request was not approved.
                        </p>
                      )}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          padding: "7px 14px",
                          borderRadius: "20px",
                          background: `${statusColor}18`,
                          color: statusColor,
                          fontWeight: "600",
                        }}
                      >
                        {status}
                      </span>

                      {canShowDirections && (
                        <a
                          href={directionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: "10px 16px",
                            background: "#168c62",
                            color: "#fff",
                            borderRadius: "8px",
                            textDecoration: "none",
                            fontWeight: "600",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <i className="fa-solid fa-route"></i>
                          Get Directions
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}

            {!requestEmail && (
              <p style={{ color: "#666" }}>
                Your submitted requests will appear here after
                you enter your email.
              </p>
            )}
          </section>

          {Object.values(reviewsByDonation).some((reviews) => reviews.length > 0) && (
            <section
              className="community-reviews-section"
              style={{
                margin: "30px 0",
                padding: "24px",
                background: "#ffffff",
                borderRadius: "12px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <span className="section-label">
                <i className="fa-solid fa-star"></i>
                Feedback from receivers
              </span>
              <h3>Community Reviews</h3>
              {Object.entries(reviewsByDonation).flatMap(([donationId, reviews]) =>
                reviews.map((review, index) => (
                  <div
                    key={`${donationId}-community-review-${index}`}
                    style={{
                      padding: "14px 0",
                      borderBottom: "1px solid #e8eee9",
                    }}
                  >
                    <strong>{review.donationName}</strong>
                    <div style={{ color: "#d18b00", margin: "5px 0" }}>
                      {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                    </div>
                    <small style={{ color: "#666" }}>
                      Reviewed by {review.requesterName}
                    </small>
                    {review.comment && (
                      <p style={{ margin: "6px 0 0", color: "#555" }}>
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))
              )}
            </section>
          )}
{/* Our Impact - Completed Donations */}
<section style={{ margin: "40px 0" }}>
  <div style={{ marginBottom: "20px" }}>
    <span className="section-label">
      <i className="fa-solid fa-heart"></i> Our Community Impact
    </span>
    <h2>Real Donations, Real Smiles</h2>
    <p>See the donations successfully shared in our community.</p>
  </div>
  {completedDonations.length === 0 ? (
    <p style={{ color: "#777" }}>No completed donations yet. Be the first to make an impact!</p>
  ) : (
    <div className="donation-grid">
      {completedDonations.map((item) => (
        <article className="donation-card-large explore-card" key={item._id}>
          <div className="donation-image">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.itemName}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div style={{ minHeight: "200px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f3" }}>
                <i className="fa-solid fa-image" style={{ fontSize: "38px", color: "#168c62" }}></i>
              </div>
            )}
            <span className="category-tag">Successfully Shared</span>
          </div>
          <div className="donation-info">
            <h3>{item.itemName}</h3>
            <p>{item.description}</p>
            <div className="donation-meta">
              <span><i className="fa-solid fa-box"></i> {item.quantity}</span>
              <span><i className="fa-solid fa-circle-check"></i> Completed</span>
            </div>
            <div className="donation-footer">
              <span className="location-name">{item.location}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  )}
</section>
          {/* Donation Cards */}
          <div className="donation-grid">
            {filteredDonations.map((item) => (
              <article
                className="donation-card-large explore-card"
                key={item.id}
              >
                <div className="donation-image">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.itemName || "Donation"}
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        height: "100%",
                        minHeight: "200px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        background: "#f1f5f3",
                        color: "#168c62",
                        gap: "10px",
                      }}
                    >
                      <i
                        className="fa-solid fa-image"
                        style={{ fontSize: "38px" }}
                      ></i>
                      <span>No image uploaded</span>
                    </div>
                  )}

                  <span
                    className={`category-tag ${
                      item.category === "animal"
                        ? "animal-tag"
                        : ""
                    }`}
                  >
                    {categories.find(
                      (cat) => cat.id === item.category
                    )?.label || item.category}
                  </span>
                </div>

                <div className="donation-info">
                  <div className="distance">
                    <i className="fa-solid fa-location-dot"></i>
                    {item.distance || "Nearby"}
                  </div>

                  <h3>{item.itemName}</h3>
                  <p>{item.description}</p>

                  <div className="donation-meta">
                    <span>
                      <i className="fa-solid fa-box"></i>
                      {item.quantity}
                    </span>

                    <span>
                      <i className="fa-regular fa-clock"></i>
                      {item.availability}
                    </span>
                  </div>

                  <div className="donation-footer">
                    <span className="location-name">
                      {item.location}
                    </span>

                    <button
                      className="arrow-btn request-btn"
                      type="button"
                      aria-label={`Request ${item.itemName}`}
                      onClick={() => requestDonation(item)}
                    >
                      <i className="fa-solid fa-hand-pointer"></i>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {loading && (
            <p
              style={{
                textAlign: "center",
                padding: "20px",
              }}
            >
              Loading donations...
            </p>
          )}

          {!loading && filteredDonations.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
              }}
            >
              <i
                className="fa-solid fa-box-open"
                style={{ fontSize: 40 }}
              ></i>

              <h3>No donations found</h3>
              <p>Try another category or search.</p>
            </div>
          )}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <a href="/" className="logo footer-logo">
              <span className="logo-icon">
                <i className="fa-solid fa-recycle"></i>
              </span>

              <span className="logo-text">
                Need<span>2</span>Share
              </span>
            </a>

            <p>
              Turning what you don't need into what someone
              else does.
            </p>
          </div>

          <div className="footer-column">
            <h4>Explore</h4>
            <a href="/explore">Nearby Donations</a>
            <a href="/">Home</a>
            <a href="/donate">Share Something</a>
            <a href="/profile">My Profile</a>
          </div>

          <div className="footer-column">
            <h4>Share</h4>
            <a href="/donate">Food</a>
            <a href="/donate">Animal Feed</a>
            <a href="/donate">Clothes</a>
            <a href="/donate">Household</a>
          </div>

          <div className="footer-column">
            <h4>Need Help?</h4>
            <a href="/explore">Find Nearby</a>
            <a href="/donate">Share Something</a>
            <a href="/profile">My Profile</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © 2026 Need2Share. Made for communities that care.
          </p>

          <p>
            <i className="fa-solid fa-heart"></i>
            Share locally. Impact globally.
          </p>
        </div>
      </footer>
    </>
  );
}

export default Explore;

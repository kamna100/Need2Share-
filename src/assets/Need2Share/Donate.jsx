
import { useState } from "react";

function Donate() {
  const [formData, setFormData] = useState({
    category: "",
    itemName: "",
    description: "",
    quantity: "",
    availability: "",
    location: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
  });

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleImageChange(event) {
    const selectedImage = event.target.files?.[0] || null;

    if (!selectedImage) {
      setImage(null);
      return;
    }

    if (!selectedImage.type.startsWith("image/")) {
      alert("Please select a valid image.");
      event.target.value = "";
      setImage(null);
      return;
    }

    if (selectedImage.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5 MB.");
      event.target.value = "";
      setImage(null);
      return;
    }

    setImage(selectedImage);
  }

  // Get current GPS location
  function getCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationMessage(
        "Your browser does not support location services."
      );
      return;
    }

    setLocationLoading(true);
    setLocationMessage("Getting accurate GPS location...");

    setCoordinates({
      latitude: null,
      longitude: null,
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        setCoordinates({
          latitude,
          longitude,
        });

        setLocationMessage(
          `Location captured successfully! Accuracy: approximately ${Math.round(
            accuracy
          )} metres.`
        );

        setLocationLoading(false);
      },

      (error) => {
        let message = "Unable to get your location.";

        if (error.code === 1) {
          message =
            "Location permission denied. Please allow location access.";
        } else if (error.code === 2) {
          message =
            "Location unavailable. Please check your device location settings.";
        } else if (error.code === 3) {
          message =
            "Location request timed out. Please try again.";
        }

        setLocationMessage(message);
        setLocationLoading(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0,
      }
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    let savedProfile = {};

    try {
      savedProfile = JSON.parse(
        localStorage.getItem("need2share_profile") || "{}"
      );
    } catch {
      alert("Your profile data is invalid. Please update your profile.");
      return;
    }

    if (!savedProfile.name?.trim() || !savedProfile.email?.trim()) {
      alert(
        "Please complete your Profile (name and email) before donating."
      );
      return;
    }

    setLoading(true);

    try {
      const donationData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        donationData.append(key, value);
      });

      donationData.append("donorName", savedProfile.name.trim());

      donationData.append(
        "donorEmail",
        savedProfile.email.trim().toLowerCase()
      );

      donationData.append("status", "Active");

      if (
        coordinates.latitude !== null &&
        coordinates.longitude !== null
      ) {
        donationData.append(
          "latitude",
          String(coordinates.latitude)
        );

        donationData.append(
          "longitude",
          String(coordinates.longitude)
        );
      }

      if (image) {
        donationData.append("image", image);
      }

      const response = await fetch(
        "http://https://need2share-backend.onrender.com/api/donations",
        {
          method: "POST",
          body: donationData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || result.message || "Donation failed"
        );
      }

      alert("Donation shared successfully!");

      setFormData({
        category: "",
        itemName: "",
        description: "",
        quantity: "",
        availability: "",
        location: "",
      });

      setImage(null);

      setCoordinates({
        latitude: null,
        longitude: null,
      });

      setLocationMessage("");

      event.target.reset();
    } catch (error) {
      console.error("Donation Error:", error);
      alert(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
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
            <a href="/explore">Explore</a>
            <a href="/donate" className="active">
              Donate
            </a>
            <a href="/profile">Profile</a>
          </nav>

          <a href="/profile" className="signup-btn">
            My Profile
          </a>
        </div>
      </header>

      <main>
        <section className="donate-section">
          <div className="section-container">
            <div className="section-header center">
              <span className="section-label">Share Something</span>

              <h2>Give what you don't need.</h2>

              <p>
                Share useful food or items with someone nearby.
              </p>
            </div>

            <form
              className="donation-form"
              onSubmit={handleSubmit}
            >
              <div className="form-group">
                <label htmlFor="category">Category</label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  <option value="food">Food</option>
                  <option value="animal">Animal Feed</option>
                  <option value="clothes">Clothes</option>
                  <option value="books">Books &amp; Study</option>
                  <option value="household">Household</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="itemName">Item Name</label>

                <input
                  id="itemName"
                  name="itemName"
                  type="text"
                  placeholder="Example: Fresh meal boxes"
                  value={formData.itemName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>

                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  placeholder="Tell people about the item..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="quantity">Quantity</label>

                  <input
                    id="quantity"
                    name="quantity"
                    type="text"
                    placeholder="Example: 5 packets"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="availability">
                    Available Until
                  </label>

                  <input
                    id="availability"
                    name="availability"
                    type="text"
                    placeholder="Example: Today, 8 PM"
                    value={formData.availability}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="location">
                  Pickup Locality
                </label>

                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="Example: Green Valley Society"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>GPS Location</label>

                <button
                  type="button"
                  className="primary-btn"
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                >
                  <i className="fa-solid fa-location-crosshairs"></i>

                  {locationLoading
                    ? "Getting Location..."
                    : "Use My Current Location"}
                </button>

                {locationMessage && (
                  <p
                    role="status"
                    style={{
                      marginTop: "10px",
                      fontSize: "14px",
                    }}
                  >
                    {locationMessage}
                  </p>
                )}

                {coordinates.latitude !== null && (
                  <div
                    style={{
                      marginTop: "10px",
                      padding: "12px",
                      borderRadius: "8px",
                      background: "#eaf7f0",
                      color: "#176b45",
                      fontSize: "13px",
                    }}
                  >
                    <strong>Location captured</strong>

                    <p>
                      Latitude: {coordinates.latitude}
                    </p>

                    <p>
                      Longitude: {coordinates.longitude}
                    </p>

                    <p>
                      <strong>GPS Accuracy:</strong> Check the message above.
                    </p>

                    <a
                      href={`https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View location on Google Maps
                    </a>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="image">
                  Add Photo (Maximum 5 MB)
                </label>

                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                {image && (
                  <p style={{ marginTop: "8px" }}>
                    Selected: {image.name}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="primary-btn"
                disabled={loading}
              >
                {loading ? "Sharing..." : "Share Donation"}

                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}

export default Donate;

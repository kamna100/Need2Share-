
import React, { useState } from "react";

const donations = [
  {
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85",
    alt: "Fresh meal boxes",
    category: "Food",
    icon: "fa-solid fa-utensils",
    distance: "0.5 km away",
    title: "Fresh Meal Boxes",
    description:
      "8 freshly prepared vegetarian meal boxes available for sharing.",
    quantity: "8 portions",
    availability: "Until 8 PM",
    location: "Green Valley Society",
  },
  {
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=85",
    alt: "Clean clothes available for donation",
    category: "Clothes",
    icon: "fa-solid fa-shirt",
    distance: "0.8 km away",
    title: "Clean Winter Clothes",
    description:
      "Gently used winter clothes in good condition, ready to be reused.",
    quantity: "6 pieces",
    availability: "Available",
    location: "Sunrise Apartments",
  },
  {
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=85",
    alt: "Books available for sharing",
    category: "Books",
    icon: "fa-solid fa-book",
    distance: "1.1 km away",
    title: "Engineering Books",
    description:
      "Useful college books and study material looking for a new student.",
    quantity: "12 books",
    availability: "Available",
    location: "Royal Residency",
  },
  {
    image:
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=900&q=85",
    alt: "Animal food",
    category: "Animal Feed",
    icon: "fa-solid fa-paw",
    distance: "1.5 km away",
    title: "Dog Food Packets",
    description: "Safe, suitable food available for a local animal feeder.",
    quantity: "5 packets",
    availability: "Today",
    location: "Local Community",
    animal: true,
  },
];

const steps = [
  {
    icon: "fa-solid fa-camera",
    title: "Post it",
    description:
      "Add a photo, description and availability of the food or item you want to share.",
  },
  {
    icon: "fa-solid fa-map-location-dot",
    title: "Nearby people discover it",
    description:
      "Your donation becomes visible to eligible people and organizations nearby.",
  },
  {
    icon: "fa-solid fa-hand-pointer",
    title: "Someone requests it",
    description:
      "A nearby person, NGO or animal feeder can request the donation.",
  },
  {
    icon: "fa-solid fa-person-walking",
    title: "Self pickup",
    description:
      "Once approved, the receiver collects it directly from the donor.",
  },
];

const categories = [
  {
    image:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=700&q=85",
    alt: "Food donation",
    icon: "fa-solid fa-utensils",
    title: "Food",
    description: "Share surplus meals and suitable food.",
    link: "/explore?category=food",
  },
  {
    image:
      "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=700&q=85",
    alt: "Animal feeding",
    icon: "fa-solid fa-paw",
    title: "Animal Feed",
    description: "Help local animals with suitable food.",
    link: "/explore?category=animal",
  },
  {
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=700&q=85",
    alt: "Clothes donation",
    icon: "fa-solid fa-shirt",
    title: "Clothes",
    description: "Give good clothes a second life.",
    link: "/explore?category=clothes",
  },
  {
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=700&q=85",
    alt: "Books donation",
    icon: "fa-solid fa-book",
    title: "Books & Study",
    description:
      "Pass learning materials to someone who needs them.",
    link: "/explore?category=books",
  },
];

function Label({ icon, children }) {
  return (
    <span className="section-label">
      {icon && <i className={icon} />}
      {children}
    </span>
  );
}

function PrimaryButton({ href, children }) {
  return (
    <a href={href} className="primary-btn">
      {children}
      <i className="fa-solid fa-arrow-right" />
    </a>
  );
}

function DonationCard({ donation }) {
  return (
    <article className="donation-card-large">
      <div className="donation-image">
        <img src={donation.image} alt={donation.alt} />

        <span
          className={`category-tag ${donation.animal ? "animal-tag" : ""}`}
        >
          <i className={donation.icon} />
          {donation.category}
        </span>

      </div>

      <div className="donation-info">
        <div className="distance">
          <i className="fa-solid fa-location-dot" />
          {donation.distance}
        </div>

        <h3>{donation.title}</h3>
        <p>{donation.description}</p>

        <div className="donation-meta">
          <span>
            <i className="fa-solid fa-box" />
            {donation.quantity}
          </span>
          <span>
            <i className="fa-regular fa-clock" />
            {donation.availability}
          </span>
        </div>

        <div className="donation-footer">
          <span className="location-name">{donation.location}</span>
          <a
            href="/explore"
            className="arrow-btn"
            aria-label={`Explore ${donation.title}`}
          >
            <i className="fa-solid fa-arrow-up-right-from-square" />
          </a>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  function handleSearch(event) {
    event.preventDefault();
    const query = search.trim();
    window.location.href = query
      ? `/explore?search=${encodeURIComponent(query)}`
      : "/explore";
  }

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

          <nav className={`nav-links ${menuOpen ? "menu-open" : ""}`}>
            <a href="/" className="active" onClick={() => setMenuOpen(false)}>
              Home
            </a>
            <a href="/explore" onClick={() => setMenuOpen(false)}>
              Explore
            </a>
            <a href="/donate" onClick={() => setMenuOpen(false)}>
              Donate
            </a>
            <a href="/profile" onClick={() => setMenuOpen(false)}>
              Profile
            </a>
          </nav>

          <div className="nav-actions">
            <a href="/profile" className="signup-btn">
              My Profile
            </a>
          </div>

          <button
            type="button"
            className="menu-btn"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((previous) => !previous)}
          >
            <i
              className={
                menuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"
              }
            />
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-overlay" />

          <div className="hero-container">
            <div className="hero-content">
              <div className="hero-badge">
                <i className="fa-solid fa-location-dot" />
                Making sharing local
              </div>

              <h1>
                Your extra can become
                <span> someone else's need.</span>
              </h1>

              <p>
                Share surplus food, unused essentials and safe animal feed
                with people, communities and animals around you.
              </p>

              <div className="hero-buttons">
                <PrimaryButton href="/donate">
                  Share Something
                </PrimaryButton>

                <a href="/explore" className="secondary-btn">
                  Find Nearby
                  <i className="fa-solid fa-location-dot" />
                </a>
              </div>

              <div className="hero-trust">
                <div className="trust-item">
                  <i className="fa-solid fa-location-crosshairs" />
                  <span>Hyper-local</span>
                </div>
                <div className="trust-item">
                  <i className="fa-solid fa-handshake" />
                  <span>Self pickup</span>
                </div>
                <div className="trust-item">
                  <i className="fa-solid fa-shield-heart" />
                  <span>Community driven</span>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-image-main">
                <img
                  src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1000&q=85"
                  alt="Fresh food ready to be shared"
                />
                <div className="image-badge">
                  <i className="fa-solid fa-heart" />
                  Good food deserves a second chance
                </div>
              </div>

              <div className="floating-card donation-card">
                <div className="floating-icon food-icon">
                  <i className="fa-solid fa-bowl-food" />
                </div>
                <div>
                  <strong>12 meals shared</strong>
                  <small>0.6 km away</small>
                </div>
                <span className="online-dot" />
              </div>

              <div className="floating-card impact-card">
                <div className="impact-mini-icon">
                  <i className="fa-solid fa-seedling" />
                </div>
                <div>
                  <strong>Small share.</strong>
                  <small>Real impact.</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="quick-search">
          <div className="search-container">
            <div className="search-heading">
              <Label icon="fa-solid fa-location-dot">Around you</Label>
              <h2>What are you looking for?</h2>
            </div>

            <form className="search-box" onSubmit={handleSearch}>
              <i className="fa-solid fa-magnifying-glass" />
              <input
                type="text"
                placeholder="Search food, clothes, books, furniture..."
                aria-label="Search donations"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <button type="submit">Search</button>
            </form>

            <div className="category-pills">
              <a href="/explore?category=food">
                <i className="fa-solid fa-utensils" /> Food
              </a>
              <a href="/explore?category=animal">
                <i className="fa-solid fa-paw" /> Animal Feed
              </a>
              <a href="/explore?category=clothes">
                <i className="fa-solid fa-shirt" /> Clothes
              </a>
              <a href="/explore?category=books">
                <i className="fa-solid fa-book" /> Books
              </a>
              <a href="/explore?category=household">
                <i className="fa-solid fa-chair" /> Household
              </a>
              <a href="/explore">
                <i className="fa-solid fa-box-open" /> Everything
              </a>
            </div>
          </div>
        </section>

        <section className="how-section">
          <div className="section-container">
            <div className="section-header center">
              <Label>Simple by design</Label>
              <h2>Share in four simple steps.</h2>
              <p>
                Need2Share makes local giving simple, transparent and
                convenient.
              </p>
            </div>

            <div className="steps-grid">
              {steps.map((step, index) => (
                <div className="step-card" key={step.title}>
                  <div className="step-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="step-icon">
                    <i className={step.icon} />
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="nearby-section">
          <div className="section-container">
            <div className="section-top-row">
              <div>
                <Label icon="fa-solid fa-location-dot">
                  Near your community
                </Label>
                <h2>Donations waiting nearby</h2>
                <p>
                  Discover useful things people around you are ready to share.
                </p>
              </div>
              <a href="/explore" className="view-all-btn">
                View all <i className="fa-solid fa-arrow-right" />
              </a>
            </div>

            <div className="donation-grid">
              {donations.map((donation) => (
                <DonationCard key={donation.title} donation={donation} />
              ))}
            </div>
          </div>
        </section>

        <section className="map-section">
          <div className="map-container">
            <div className="map-content">
              <Label icon="fa-solid fa-map">Hyper-local sharing</Label>
              <h2>
                See what's being shared
                <span> around you.</span>
              </h2>
              <p>
                Find nearby donations instead of letting useful food and
                essentials go to waste.
              </p>

              <div className="map-features">
                <div>
                  <i className="fa-solid fa-location-dot" />
                  <span>Nearby listings</span>
                </div>
                <div>
                  <i className="fa-solid fa-route" />
                  <span>Easy directions</span>
                </div>
                <div>
                  <i className="fa-solid fa-person-walking" />
                  <span>Self pickup</span>
                </div>
              </div>

              <PrimaryButton href="/explore">Explore the map</PrimaryButton>
            </div>

            <div className="map-visual">
              <img
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=85"
                alt="Map showing nearby locations"
              />
              <div className="map-pin pin-one">
                <i className="fa-solid fa-utensils" />
              </div>
              <div className="map-pin pin-two">
                <i className="fa-solid fa-shirt" />
              </div>
              <div className="map-pin pin-three">
                <i className="fa-solid fa-paw" />
              </div>
              <div className="map-user-location">
                <span />
                You are here
              </div>
            </div>
          </div>
        </section>

        <section className="categories-section">
          <div className="section-container">
            <div className="section-header center">
              <Label>Give what you can</Label>
              <h2>One platform. Many ways to share.</h2>
              <p>
                Something you no longer need might be exactly what someone
                nearby is looking for.
              </p>
            </div>

            <div className="category-grid">
              {categories.map((category) => (
                <a
                  className="category-card"
                  href={category.link}
                  key={category.title}
                >
                  <div className="category-card-image">
                    <img src={category.image} alt={category.alt} />
                  </div>
                  <div className="category-card-content">
                    <i className={category.icon} />
                    <h3>{category.title}</h3>
                    <p>{category.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="impact" className="impact-section">
          <div className="impact-container">
            <div className="impact-text">
              <Label>Our collective impact</Label>
              <h2>
                Every share leaves
                <span> a positive mark.</span>
              </h2>
              <p>
                When useful things stay in circulation, less goes to waste
                and more reaches people, communities and animals who can use
                them.
              </p>
              <a href="#impact" className="secondary-btn dark-btn">
                See our impact
                <i className="fa-solid fa-arrow-right" />
              </a>
            </div>

            <div className="impact-stats">
              <div className="impact-stat">
                <strong>1,250+</strong>
                <span>Meals shared</span>
              </div>
              <div className="impact-stat">
                <strong>850+</strong>
                <span>Items reused</span>
              </div>
              <div className="impact-stat">
                <strong>430+</strong>
                <span>People helped</span>
              </div>
              <div className="impact-stat">
                <strong>210+</strong>
                <span>Animals fed</span>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-container">
            <div className="cta-icon">
              <i className="fa-solid fa-hands-holding-circle" />
            </div>
            <h2>
              Don't waste it.
              <span> Share it.</span>
            </h2>
            <p>
              Your small act can make a meaningful difference right in your
              own community.
            </p>
            <div className="cta-buttons">
              <PrimaryButton href="/donate">Start sharing</PrimaryButton>
              <a href="/explore" className="outline-btn">
                Find something nearby
              </a>
            </div>
          </div>
        </section>
      </main>

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
            <p>Turning what you don't need into what someone else does.</p>
            <div className="social-links">
              <a href="#instagram" aria-label="Instagram">
                <i className="fa-brands fa-instagram" />
              </a>
              <a href="#facebook" aria-label="Facebook">
                <i className="fa-brands fa-facebook-f" />
              </a>
              <a href="#linkedin" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in" />
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h4>Explore</h4>
            <a href="/explore">Nearby Donations</a>
            <a href="#impact">Our Impact</a>
            <a href="/profile">My Profile</a>
            <a href="/donate">Share Something</a>
          </div>

          <div className="footer-column">
            <h4>Share</h4>
            <a href="/donate?category=food">Food</a>
            <a href="/donate?category=animal">Animal Feed</a>
            <a href="/donate?category=clothes">Clothes</a>
            <a href="/donate?category=books">Books &amp; Study</a>
          </div>

          <div className="footer-column">
            <h4>Need Help?</h4>
            <a href="/explore">Find Nearby</a>
            <a href="/donate">Share Something</a>
            <a href="#impact">Our Impact</a>
            <a href="/profile">My Profile</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Need2Share. Made for communities that care.</p>
          <p>
            <i className="fa-solid fa-heart" /> Share locally. Impact globally.
          </p>
        </div>
      </footer>

      <div className="animated-bg" aria-hidden="true">
        <span className="glass-orb orb-1" />
        <span className="glass-orb orb-2" />
        <span className="glass-orb orb-3" />
        <span className="glass-shape shape-1" />
        <span className="glass-shape shape-2" />
        <span className="glow-ball ball-1" />
        <span className="glow-ball ball-2" />
      </div>
    </>
  );
}

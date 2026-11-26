# Need2Share
### Share More. Waste Less.

**Need2Share** is a MERN Stack-based hyperlocal resource-sharing platform designed to reduce waste by connecting people who have surplus resources with those who need them.

The platform encourages individuals, households, restaurants, and communities to share surplus food, clothes, books, household items, and other useful resources instead of throwing them away.

## 🌍 About the Project

Every day, a significant amount of usable food and household material goes to waste, while many people and communities lack access to essential resources.

Need2Share aims to bridge this gap through a simple digital platform where users can donate available resources, discover nearby donations, and request items according to their needs.

**Our Mission:** To build a community-driven sharing ecosystem that promotes sustainability, social responsibility, and waste reduction.

## ✨ Key Features

- **User-Friendly Interface:** Clean, responsive, and easy-to-use design.
- **Donate Resources:** Users can list surplus food, clothes, books, household items, and other resources.
- **Explore Donations:** Browse available resources shared by other users.
- **Location-Based Discovery:** Discover nearby donations through an interactive map.
- **Request Management:** Users can submit requests for available donations.
- **Donor Approval System:** Donors can accept or reject incoming requests.
- **Donation Reservation:** Approved requests reserve the selected donation.
- **Pickup Directions:** Access map directions for approved donations.
- **Donation Completion:** Donors can mark successfully collected donations as completed.
- **Impact Section:** Display completed donations to highlight community contributions.
- **Profile Dashboard:** View personal donations, received requests, and their statuses.
- **Image Uploads:** Add images to donation listings.
- **Responsive Design:** Designed to work across desktop, tablet, and mobile screens.

## 🛠️ Technology Stack

| Area | Technologies |
|---|---|
| Frontend | React.js, JavaScript |
| Styling | CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Maps | Leaflet, OpenStreetMap |
| Image Uploads | Multer |
| Development Tools | Visual Studio Code, npm, Git, GitHub |

## 🔄 How It Works

1. A donor lists a surplus resource.
2. Other users explore available donations.
3. An interested user submits a request.
4. The donor reviews and accepts or rejects the request.
5. Once approved, the donation is reserved.
6. The receiver collects the resource through self-pickup.
7. The donor marks the donation as completed.

## 📁 Project Structure

```text
Need2Share/
│
├── backend/
│   ├── models/
│   │   ├── donation.js
│   │   └── request.js
│   ├── routers/
│   │   ├── donationRoutes.js
│   │   └── requestRoutes.js
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── public/
│
├── src/
│   ├── assets/
│   │   └── Need2Share/
│   │       ├── Home.jsx
│   │       ├── Explore.jsx
│   │       ├── Donate.jsx
│   │       └── Profile.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── main.jsx
│   └── style.css
│
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

## ⚙️ Installation and Setup

### Prerequisites
- Node.js and npm
- MongoDB database
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/kamna100/Need2Share-.git
```

### 2. Open the Project

```bash
cd Need2Share-
```

### 3. Install Frontend Dependencies

```bash
npm install
```

### 4. Configure the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder and configure your MongoDB connection string and other required environment variables as referenced in `server.js`.

### 5. Start the Backend

```bash
node server.js
```

### 6. Start the Frontend

Open another terminal in the main project folder:

```bash
npm run dev
```

Open the local URL displayed in the terminal to access the application.

## 🎯 Project Objectives

- Reduce food and material wastage.
- Encourage reuse and responsible resource sharing.
- Connect donors and receivers within local communities.
- Make surplus resources accessible to people who need them.
- Promote environmental sustainability through technology.

## 🚀 Future Scope

- Secure user authentication and role-based access.
- Email and notification integration.
- Volunteer and NGO partnerships.
- Advanced location-based recommendations.
- Donation analytics and community impact reports.
- Mobile application development.

## 🌱 Expected Impact

Need2Share aims to encourage a culture where useful resources are shared rather than wasted.

**Your extra can become someone else's need.**

## 👩‍💻 Developer

**Kamna Manhas**

B.Tech – Computer Science and Engineering

GitHub: [@kamna100](https://github.com/kamna100)

---

*Need2Share – Share More. Waste Less.*

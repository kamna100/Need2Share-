
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./assets/Need2Share/Home.jsx";
import Explore from "./assets/Need2Share/Explore.jsx";
import Donate from "./assets/Need2Share/Donate.jsx";
import Profile from "./assets/Need2Share/Profile.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

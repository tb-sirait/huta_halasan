import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home/Home";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          {/* Tambahkan route lain di sini jika diperlukan */}
          {/* <Route path="/education" element={<Education />} /> */}
          {/* <Route path="/knowledge" element={<Knowledge />} /> */}
          {/* <Route path="/news" element={<News />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

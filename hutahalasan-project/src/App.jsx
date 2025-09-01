import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import Education from "./Edu/Edu";
import News from "./News/News";
import Knowledge from "./Knowledge/Knowledge";
import KnowledgeDetail from "./Knowledge/KnowledgeDetail";
import EducationDetail from "./Edu/EducationDetail";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/edu" element={<Education />} />
          <Route path="/education/:id" element={<EducationDetail />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/knowledge/:id" element={<KnowledgeDetail />} />
          <Route path="/news" element={<News />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

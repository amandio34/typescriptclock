import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CityPage from "./pages/CityPage";
import './index.css';

// Main App component sets up routing for the application
const App: React.FC = () => {
  return (
    // Router provides navigation context for the app
    <Router>
      {/* Routes define the available pages */}
      <Routes>
        {/* Home page route */}
        <Route path="/" element={<Home />} />
        {/* City detail page route */}
        <Route path="/city/:id" element={<CityPage />} />
      </Routes>
    </Router>
  );
};

export default App;
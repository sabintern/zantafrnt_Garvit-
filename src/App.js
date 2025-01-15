import React from "react";
import Login from "./Component/Auth/Login";
import Dashboard from "./Component/Dashboard";
import SecureRoute from "./SecureRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Pricing from "./Component/Pricing";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <SecureRoute>
              <Dashboard />
            </SecureRoute>
          }
        />
        <Route path="/" element={<Login />} />
        <Route path="/pricing" element={<Pricing />} />
      </Routes>
    </Router>
  );
};

export default App;

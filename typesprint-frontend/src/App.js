// src/App.js

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TypingTest from "./pages/TypingTest";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Protect the home route */}
        <Route path="/" element={<ProtectedRoute component={Home} />} />
        {/* You can protect other routes similarly */}
        <Route
          path="/typing-test"
          element={<ProtectedRoute component={TypingTest} />}
        />
      </Routes>
    </Router>
  );
}

export default App;

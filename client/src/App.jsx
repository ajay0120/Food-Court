import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./LandingPage"
import Login from "./Login";
import Signup from "./SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./components/Profile";


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/profile"
          element={
            <ProtectedRoute>
              <Profile/>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
    
  )
}

export default App
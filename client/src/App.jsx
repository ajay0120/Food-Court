import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./LandingPage";
import Login from "./Login";
import Signup from "./SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./components/Profile";
import Menu from "./components/Menu";
import { CartProvider } from "./context/cartContext"; // ⬅️ import CartProvider
import Cart from "./components/Cart";

function App() {
  return (
    <CartProvider> {/* ⬅️ Wrap everything inside */}
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/menu" element={<Menu />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart/>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;

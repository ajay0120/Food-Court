import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "./LandingPage";
import Login from "./Login";
import Signup from "./SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./components/Profile";
import Menu from "./components/Menu";
import { CartProvider } from "./context/cartContext"; // ⬅️ import CartProvider
import Cart from "./components/Cart";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminMenu from "./components/AdminMenu";

function App() {
  return (
    <CartProvider> {/* ⬅️ Wrap everything inside */}
      <Router>
        <Toaster position="top-right" reverseOrder={false} />
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
          <Route path="/adminMenu" element={<AdminMenu/>}/>
        </Routes>
        <Footer/>
      </Router>
    </CartProvider>
  );
}

export default App;

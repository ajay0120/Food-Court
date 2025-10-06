import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./NotFound";
import { Toaster } from "react-hot-toast";
import LandingPage from "./LandingPage";
import Login from "./Login";
import Signup from "./SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./components/Profile";
import Menu from "./components/Menu";
import { CartProvider } from "./context/cartContext"; 
import Cart from "./components/Cart";
import Footer from "./components/Footer";
import AdminMenu from "./components/AdminMenu";
import ForgotPass from "./ForgotPassword/ForgotPass";
import Payment from "./Payment/Payment";
import AdminRoute from "./components/AdminRoute";
import AdminProfile from "./components/AdminProfile";
import VerifyEmail from "./components/VerifyEmail";
import TodayOffers from "./components/TodayOffers";
import ContactUs from "./components/ContactUs";
import AboutUs from "./components/AboutUs";
import GoogleAuthWrapper from "./components/GoogleAuthWrapper";


function App() {
  return (
    <GoogleAuthWrapper>
      <CartProvider> {/* ⬅️ Wrap everything inside */}
        <Router>
          <Toaster position="top-right" reverseOrder={false} />
          <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/offers" element={<TodayOffers />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/about" element={<AboutUs />} />
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
          <Route
            path="/adminMenu"
            element={
              <AdminRoute>
                <AdminMenu/>
              </AdminRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminProfile />
              </AdminRoute>
            }
          />
          {/* <Route path="/admin" element={<AdminProfile />}/>
          <Route path="/adminMenu" element={<AdminMenu/>}/> */}
          <Route path="/forgotPass" element={<ForgotPass/>}/>
          <Route path="/payment" element={<Payment/>}></Route>
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer/>
      </Router>
    </CartProvider>
  </GoogleAuthWrapper>
  );
}

export default App;

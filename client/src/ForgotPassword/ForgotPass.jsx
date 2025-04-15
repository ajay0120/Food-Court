import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function ForgotPass() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const sendOtp = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/send-otp", { email });
      toast.success("OTP sent to email");
      setOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp,
      });
      toast.success("OTP verified! Logging in...");
  
      // ✅ Save the real token
      localStorage.setItem("token", res.data.token);
  
      // ✅ Optionally store user info
      localStorage.setItem("username", res.data.user.username);
      localStorage.setItem("email", res.data.user.email);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("name",res.data.user.name);
  
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar at the top */}
      <Navbar />

      {/* Form content centered below the navbar */}
      <div className="flex flex-col justify-center items-center mt-20 px-5">
        <h2 className="text-3xl font-bold mb-6">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your registered email"
          className="p-2 rounded mb-4 bg-gray-800 border border-orange-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {!otpSent ? (
          <button
            onClick={sendOtp}
            className="bg-orange-500 px-4 py-2 rounded hover:bg-orange-600"
          >
            Send OTP
          </button>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="p-2 rounded my-4 bg-gray-800 border border-orange-400"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={verifyOtp}
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
            >
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
}
  

export default ForgotPass

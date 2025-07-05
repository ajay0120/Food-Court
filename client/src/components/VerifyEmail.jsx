import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(60); // 60 seconds cooldown
  const [otpExpiryTime, setOtpExpiryTime] = useState(Date.now() + 5 * 60 * 1000); // 5 minutes

  // Redirect if email missing
  useEffect(() => {
    if (!email) {
      toast.error("Email missing. Please sign up again.");
      navigate("/signup");
    }
  }, [email, navigate]);

  // Cooldown countdown
  useEffect(() => {
    let cooldownTimer;
    if (resendCooldown > 0) {
      cooldownTimer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(cooldownTimer);
  }, [resendCooldown]);

  // Expiry countdown
  useEffect(() => {
    const timer = setInterval(() => {
      if (Date.now() > otpExpiryTime) {
        clearInterval(timer);
        toast.error("OTP expired. Please resend.");
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [otpExpiryTime]);

  const handleVerify = async () => {
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    try {
      const res = await axios.post("/auth/verify-otp", { email, otp });

      toast.success("OTP verified! Logged in successfully");

      // ✅ Save token and user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.user.username);
      localStorage.setItem("email", res.data.user.email);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("name", res.data.user.name);

      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await axios.post("/auth/send-otp", { email });
      toast.success("OTP resent to email");

      setResendCooldown(60);
      setOtpExpiryTime(Date.now() + 5 * 60 * 1000); // Reset expiry
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-5">
      <h2 className="text-3xl font-bold mb-6 text-orange-500">Verify Your Email</h2>
      <p className="mb-2 text-sm">
        An OTP has been sent to <span className="text-orange-400 font-semibold">{email}</span>
      </p>

      {/* OTP Expiry Timer */}
      <p className="mb-4 text-red-400 text-sm">
        OTP will expire in:{" "}
        <span className="font-mono">
          {Math.max(0, Math.floor((otpExpiryTime - Date.now()) / 1000))}s
        </span>
      </p>

      <input
        type="text"
        placeholder="Enter OTP"
        className="w-64 p-3 mb-4 rounded bg-gray-800 border border-orange-500 text-white text-center"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button
        onClick={handleVerify}
        className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded text-white font-bold mb-4"
      >
        Verify OTP
      </button>

      <button
        onClick={handleResendOtp}
        className={`${
          resendCooldown > 0
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        } px-5 py-2 rounded text-white font-semibold transition`}
        disabled={resendCooldown > 0}
      >
        {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}
      </button>

      <p className="mt-4 text-sm text-gray-400">
        Didn't receive the code? Check your spam folder or click "Resend OTP".
      </p>
    </div>
  );
};

export default VerifyEmail;

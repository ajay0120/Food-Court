import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import useOtpHandler from "../hooks/useOtpHandler";
import OtpInputForm from "../components/OtpInputForm";

const ForgotPass = () => {
  const [email, setEmail] = React.useState("");
  const [otpSent, setOtpSent] = React.useState(false);
  const navigate = useNavigate();

  const {
    otp,
    setOtp,
    resendCooldown,
    otpExpiryTime,
    handleSendOtp,
    handleVerifyOtp,
  } = useOtpHandler(email);

  const handleEmailSubmit = async () => {
    if (!email) {
      toast.error("Please enter a valid email.");
      return;
    }

    await handleSendOtp();
    setOtpSent(true);
  };

  const handleOtpVerify = async () => {
    const data = await handleVerifyOtp();
    if (data) {
      // Store token and user details
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("name", data.user.name);

      toast.success("OTP verified! Logged in successfully");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="flex flex-col justify-center items-center mt-20 px-5">
        <h2 className="text-3xl font-bold mb-6 text-orange-500">Forgot Password</h2>

        {!otpSent ? (
          <>
            <input
              type="email"
              placeholder="Enter your registered email"
              className="p-2 w-64 rounded mb-4 bg-gray-800 border border-orange-400 text-center"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleEmailSubmit}
              className="bg-orange-500 px-4 py-2 rounded hover:bg-orange-600 cursor-pointer"
            >
              Send OTP
            </button>
          </>
        ) : (
          <OtpInputForm
            otp={otp}
            setOtp={setOtp}
            resendCooldown={resendCooldown}
            otpExpiryTime={otpExpiryTime}
            onVerify={handleOtpVerify}
            onResend={handleSendOtp}
            email={email}
          />
        )}
      </div>
    </div>
  );
};

export default ForgotPass;

import { useState, useEffect } from "react";
import axios from "../api/axios";
import toast from "react-hot-toast";

const useOtpHandler = (email, endpoint = "/auth") => {
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpExpiryTime, setOtpExpiryTime] = useState(null);

  // Cooldown logic
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Expiry checker
  useEffect(() => {
    if (!otpExpiryTime) return;
    const interval = setInterval(() => {
      if (Date.now() > otpExpiryTime) {
        clearInterval(interval);
        toast.error("OTP expired. Please resend.");
        setOtp("");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [otpExpiryTime]);

  const handleSendOtp = async () => {
    try {
      await axios.post(`${endpoint}/send-otp`, { email });
      toast.success("OTP sent to email");
      setResendCooldown(60);
      setOtpExpiryTime(Date.now() + 5 * 60 * 1000); // 5 min
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post(`${endpoint}/verify-otp`, { email, otp });
      toast.success("OTP verified!");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
      return null;
    }
  };

  return {
    otp,
    setOtp,
    resendCooldown,
    otpExpiryTime,
    handleSendOtp,
    handleVerifyOtp,
  };
};

export default useOtpHandler;

import React, { useState, useEffect, useRef } from "react"; 
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import useOtpHandler from "../hooks/useOtpHandler";
import OtpInputForm from "../components/OtpInputForm";

const VerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;
    const hasSentRef = useRef(false);

    const {
        otp,
        setOtp,
        resendCooldown,
        otpExpiryTime,
        handleSendOtp,
        handleVerifyOtp,
    } = useOtpHandler(email);

    const handleSubmit = async () => {
        const data = await handleVerifyOtp();
        if (data) {
            // Save token and user
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.user.username);
            localStorage.setItem("email", data.user.email);
            localStorage.setItem("role", data.user.role);
            localStorage.setItem("name", data.user.name);
            navigate("/");
        }
    };

    React.useEffect(() => {
        if (!email) {
            toast.error("Email missing. Please sign up again.");
            navigate("/signup");
        } else if (!hasSentRef.current) {
    handleSendOtp(); // ✅ Only runs once
    hasSentRef.current = true;
  }
    }, [email, navigate]);

    return (
        <>
            <Navbar />
            <div className="min-h-[calc(100vh-4rem)] bg-black text-white flex flex-col items-center justify-center px-5">
                <h2 className="text-3xl font-bold mb-6 text-orange-500">
                    Verify Your Email
                </h2>

                <OtpInputForm
                    otp={otp}
                    setOtp={setOtp}
                    resendCooldown={resendCooldown}
                    otpExpiryTime={otpExpiryTime}
                    onVerify={handleSubmit}
                    onResend={handleSendOtp}
                    email={email}
                />
            </div>
        </>
    );
};

export default VerifyEmail;

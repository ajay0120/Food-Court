import React from "react";

const OtpInputForm = ({
  otp,
  setOtp,
  resendCooldown,
  otpExpiryTime,
  onVerify,
  onResend,
  email,
}) => {
  return (
    <div className="flex flex-col items-center">
      <p className="text-sm text-gray-300 mb-1">
        OTP sent to: <span className="text-orange-400">{email}</span>
      </p>

      {otpExpiryTime && (
        <p className="mb-4 text-sm text-red-400">
          OTP will expire in:{" "}
          <span className="font-mono">
            {Math.max(0, Math.floor((otpExpiryTime - Date.now()) / 1000))}s
          </span>
        </p>
      )}

      <input
        type="text"
        placeholder="Enter OTP"
        className="p-2 w-64 rounded mb-4 bg-gray-800 border border-orange-400 text-center"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button
        onClick={onVerify}
        className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 cursor-pointer mb-3"
      >
        Verify OTP
      </button>

      <button
        onClick={onResend}
        disabled={resendCooldown > 0}
        className={`${
          resendCooldown > 0
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        } px-4 py-2 rounded text-white font-semibold`}
      >
        {resendCooldown > 0
          ? `Resend OTP in ${resendCooldown}s`
          : "Resend OTP"}
      </button>
    </div>
  );
};

export default OtpInputForm;

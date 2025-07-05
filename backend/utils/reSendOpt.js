const OTP = require("../models/otp");
const sendMail = require("./sendMail");

async function resendOtp(email) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.deleteMany({ email });
    await OTP.create({ email, otp, expiresAt });

    await sendMail(email, "Your OTP - Food Court BVRIT", `Your OTP is ${otp}. It expires in 5 minutes.`);
    console.log(`OTP resent to ${email}`);
}

module.exports = resendOtp;

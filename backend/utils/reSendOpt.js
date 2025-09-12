const OTP = require("../models/otp");
const sendMail = require("./sendMail");
const logger = require('../logger.js');
const { validateEmail, sanitizeEmail } = require('./validation');

async function resendOtp(rawEmail) {
    try {
        if (!validateEmail(rawEmail)) {
            logger.warn(`resendOtp called with invalid email: ${rawEmail}`);
            return false;
        }
        const email = sanitizeEmail(rawEmail);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await OTP.deleteMany({ email });
        await OTP.create({ email, otp, expiresAt });

        await sendMail(email, "Your OTP - Food Court BVRIT", `Your OTP is ${otp}. It expires in 5 minutes.`);
        logger.info(`OTP resent to ${email}`);
        return true;
    } catch (err) {
        logger.error(`Failed to resend OTP to ${rawEmail}: ${err.message}`);
        return false;
    }
}

module.exports = resendOtp;

// utils/otp.js

/**
 * Generate a 6-digit numeric OTP as a string, e.g. "483927"
 * Always returns exactly 6 digits (leading zeros preserved).
 */
exports.generateOTP = () => {
    // Generate a number from 0 to 999999
    const num = Math.floor(Math.random() * 1_000_000);
    // Pad with leading zeros if needed to ensure length = 6
    return num.toString().padStart(6, '0');
};
  
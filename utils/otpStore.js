// utils/otpStore.js
const otpStore = new Map();
const TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Save OTP for an email, automatically expires after TTL_MS
 */
exports.saveOtp = (email, otp) => {
  const expiresAt = Date.now() + TTL_MS;
  // overwrite any existing OTP
  otpStore.set(email, { otp, expiresAt });

  // schedule removal
  setTimeout(() => {
    otpStore.delete(email);
  }, TTL_MS);
};

/**
 * Retrieve OTP record; returns { otp, expiresAt } or null if missing/expired
 */
exports.getOtpRecord = (email) => {
  const rec = otpStore.get(email);
  if (!rec) return null;
  if (rec.expiresAt < Date.now()) {
    otpStore.delete(email);
    return null;
  }
  return rec;
};

/**
 * Delete OTP immediately (e.g. after successful verify)
 */
exports.deleteOtp = (email) => {
  otpStore.delete(email);
};

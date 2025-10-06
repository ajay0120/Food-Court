import { rateLimit,ipKeyGenerator } from "express-rate-limit";
// Hybrid key generator: prefer user ID if available, else fallback to IP
const hybridKeyGenerator = (req, res) => {
  if (req.user && req.user._id) {
    return req.user._id.toString(); // per-user limit
  }
  // Use the library's built-in IP key generator for proper IPv6 handling
  return ipKeyGenerator(req, res);
};

// Factory function so you can configure different windows & max
function createHybridRateLimiter({ windowMs, max, message }) {
  return rateLimit({
    windowMs,
    max,
    keyGenerator: hybridKeyGenerator,
    message: message || { message: "Too many requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
  });
}

export { createHybridRateLimiter };

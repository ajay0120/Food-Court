import { rateLimit,ipKeyGenerator } from "express-rate-limit";

// Hybrid key generator: prefer user ID if available, else fallback to IP
const createKeyGenerator = (keyType) => {
  return (req, res) => {
    if (keyType === "user") {
      if (!req.user?._id) {
        throw new Error("RateLimiter: req.user missing. Check middleware order.");
      }
      return `user:${req.user._id.toString()}`;
    }

    if (keyType === "ip") {
      return `ip:${ipKeyGenerator(req)}`;
    }

    // hybrid
    if (req.user?._id) {
      return `user:${req.user._id.toString()}`;
    }
    return `ip:${ipKeyGenerator(req)}`;
  };
};
// Factory function so you can configure different windows & max
function createHybridRateLimiter({ windowMs, max, message, keyType="hybrid", skip, onLimitReached }) {
  return rateLimit({
    windowMs,
    max,
    keyGenerator: createKeyGenerator(keyType),
    message: message || ((req, res) => ({
      error: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests, please try again later.",
      retryAfter: res.getHeader("Retry-After"),
    })),
    standardHeaders: true,
    legacyHeaders: false,
    skip: skip || (() => false),

    handler: (req, res, next, options) => {
      if (onLimitReached) onLimitReached(req, res);
      res.status(options.statusCode).json(
        typeof options.message === "function"
          ? options.message(req, res)
          : options.message
      );
    },
  });
}

export { createHybridRateLimiter };

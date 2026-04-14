import express from "express";
import { placeOrder, getUserOrders, cancelOrder, getAllOrders, getCurrentOrders, getPastOrders, getCancelledOrders, markAsDelivered } from "../controllers/orderController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import { createHybridRateLimiter } from "../middleware/rateLimitingMiddleware.js";
import logger from '../logger.js';

const router = express.Router();

const ipRateLimiter = createHybridRateLimiter({
  windowMs: 60 * 1000,
  max: 100, // limit each IP to 100 requests/min before auth
  message: { message: "Too many order requests, please try again later." },
  keyType: "ip", // only use IP for unauthenticated routes
  onLimitReached: (req) => {
    logger.warn("Rate limit exceeded", {
      ip: req.ip,
      route: req.originalUrl,
      method: req.method,
    });
  },
});


const orderWriteLimiter = createHybridRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10, // max orders a user can place is up to 10 per 15min
  keyType: "user",
  message: { message: "Too many order requests, please try again later." },
  skip: (req) => req.user?.role === "admin",
  onLimitReached: (req) => {
    logger.warn("Order WRITE rate limit exceeded", {
      userId: req.user?._id?.toString(),
      role:   req.user?.role,
      ip:     req.ip,
      route:  req.originalUrl,
      method: req.method,
    });
  },
});


const orderReadLimiter = createHybridRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30, //read can be more frequent than writes, so limit is 30 req/15min
  keyType: "user",
  skip: (req) => req.user?.role === "admin",
  onLimitReached: (req) => {
    logger.warn("Order READ rate limit exceeded", {
      userId: req.user?._id?.toString(),
      ip:     req.ip,
      route:  req.originalUrl,
    });
  },
});


const adminOrderLimiter = createHybridRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100, // admins legitimately load dashboards frequently
  keyType: "user",
  onLimitReached: (req) => {
    // This firing is suspicious — admin hitting 100 req/15min
    logger.error("ADMIN order rate limit exceeded — investigate", {
      userId: req.user?._id?.toString(),
      ip:     req.ip,
      route:  req.originalUrl,
    });
  },
});

router.post("/", ipRateLimiter, protect, orderWriteLimiter, placeOrder);
router.get("/myorders", ipRateLimiter, protect, orderReadLimiter, getUserOrders);
router.put("/cancel/:id", ipRateLimiter, protect, orderWriteLimiter, cancelOrder);
router.get("/all", ipRateLimiter, protect,isAdmin , adminOrderLimiter, getAllOrders);
router.get("/currentOrders", ipRateLimiter, protect,isAdmin,adminOrderLimiter,getCurrentOrders)
router.get("/pastOrders", ipRateLimiter, protect,isAdmin,adminOrderLimiter,getPastOrders)
router.get("/cancelledOrders", ipRateLimiter, protect,isAdmin,adminOrderLimiter,getCancelledOrders)
router.post("/markAsDelivered", ipRateLimiter, protect,isAdmin,adminOrderLimiter,markAsDelivered)
router.put("/:id/deliver", ipRateLimiter, protect,isAdmin,adminOrderLimiter,getAllOrders);

export default router;

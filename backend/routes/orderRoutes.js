import express from "express";
import { placeOrder, getUserOrders, cancelOrder, getAllOrders, getCurrentOrders, getPastOrders, getCancelledOrders, markAsDelivered } from "../controllers/orderController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import { createHybridRateLimiter } from "../middleware/rateLimitingMiddleware.js";

const router = express.Router();

const ipRateLimiter = createHybridRateLimiter({
  windowMs: 60 * 1000,
  max: 100, // limit each IP to 100 requests/min before auth
  message: { message: "Too many order requests, please try again later." },
});

const orderRateLimiter = createHybridRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each user to 100 requests per windowMs
  message: { message: "Too many order requests, please try again later." },
});

router.post("/", ipRateLimiter, protect, orderRateLimiter, placeOrder);
router.get("/myorders", ipRateLimiter, protect, orderRateLimiter, getUserOrders);
router.put("/cancel/:id", ipRateLimiter, protect, orderRateLimiter, cancelOrder);
// router.get('/myorders', getUserOrders);
router.get("/all", ipRateLimiter, protect,isAdmin , orderRateLimiter, getAllOrders);
router.get("/currentOrders", ipRateLimiter, protect,isAdmin,orderRateLimiter,getCurrentOrders)
router.get("/pastOrders", ipRateLimiter, protect,isAdmin,orderRateLimiter,getPastOrders)
router.get("/cancelledOrders", ipRateLimiter, protect,isAdmin,orderRateLimiter,getCancelledOrders)
router.post("/markAsDelivered", ipRateLimiter, protect,isAdmin,orderRateLimiter,markAsDelivered)
router.put("/:id/deliver", ipRateLimiter, protect,isAdmin,orderRateLimiter,getAllOrders);

export default router;

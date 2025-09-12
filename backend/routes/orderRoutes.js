const express = require("express");
const { placeOrder,getUserOrders, cancelOrder, getAllOrders, getCurrentOrders, getPastOrders,getCancelledOrders, markAsDelivered} = require("../controllers/orderController");
const { protect, isAdmin  } = require("../middleware/authMiddleware");
const {createHybridRateLimiter} = require("../middleware/rateLimitingMiddleware");

const router = express.Router();

const orderRateLimiter = createHybridRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each user to 100 requests per windowMs
  message: { message: "Too many order requests, please try again later." },
});

router.post("/", protect, orderRateLimiter, placeOrder);
router.get("/myorders", protect, orderRateLimiter, getUserOrders);
router.put("/cancel/:id",protect,orderRateLimiter,cancelOrder);
// router.get('/myorders', getUserOrders);
router.get("/all", protect,isAdmin , orderRateLimiter, getAllOrders);
router.get("/currentOrders",protect,isAdmin,orderRateLimiter,getCurrentOrders)
router.get("/pastOrders",protect,isAdmin,orderRateLimiter,getPastOrders)
router.get("/cancelledOrders",protect,isAdmin,orderRateLimiter,getCancelledOrders)
router.post("/markAsDelivered",protect,isAdmin,orderRateLimiter,markAsDelivered)
router.put("/:id/deliver", protect,isAdmin,orderRateLimiter,getAllOrders);

module.exports = router;

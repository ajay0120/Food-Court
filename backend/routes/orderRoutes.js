const express = require("express");
const { placeOrder,getUserOrders, cancelOrder, getAllOrders, getCurrentOrders, getPastOrders,getCancelledOrders, markAsDelivered} = require("../controllers/orderController");
const { protect, isAdmin  } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/myorders", protect, getUserOrders);
router.put("/cancel/:id",protect,cancelOrder);
// router.get('/myorders', getUserOrders);
router.get("/all", protect,isAdmin , getAllOrders);
router.get("/currentOrders",protect,isAdmin,getCurrentOrders)
router.get("/pastOrders",protect,isAdmin,getPastOrders)
router.get("/cancelledOrders",protect,isAdmin,getCancelledOrders)
router.post("/markAsDelivered",protect,isAdmin,markAsDelivered)
router.put("/:id/deliver", protect,isAdmin, getAllOrders);

module.exports = router;

const express = require("express");
const { placeOrder,getUserOrders,getAllOrders  } = require("../controllers/orderController");
const { protect, isAdmin  } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/myorders", protect, getUserOrders);
// router.get('/myorders', getUserOrders);
router.get("/all", protect,isAdmin , getAllOrders);
router.put("/:id/deliver", protect,isAdmin, getAllOrders);

module.exports = router;

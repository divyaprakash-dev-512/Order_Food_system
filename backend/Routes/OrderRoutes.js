const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus,
} = require("../controller/orderController");

router.post("/orders", createOrder);
router.get("/orders", getAllOrders);
router.get("/orders/user/:userId", getOrdersByUser);
router.patch("/orders/:id/status", updateOrderStatus);

module.exports = router;

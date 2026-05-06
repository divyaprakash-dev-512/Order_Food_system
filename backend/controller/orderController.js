const Order = require("../model/order");

const generateOrderNumber = async () => {
  let orderNumber = "";
  let exists = true;

  while (exists) {
    orderNumber = Math.floor(1000000 + Math.random() * 9000000).toString();
    const existingOrder = await Order.findOne({ orderNumber });
    exists = Boolean(existingOrder);
  }

  return orderNumber;
};

exports.createOrder = async (req, res) => {
  try {
    const {
      userId,
      items,
      address,
      totalAmount,
      paymentMethod = "COD",
      paymentStatus = "Pending",
      razorpayId = "",
    } = req.body;

    if (!userId || !Array.isArray(items) || items.length === 0 || !address) {
      return res.status(400).json({
        success: false,
        message: "Missing order details",
      });
    }

    const orderNumber = await generateOrderNumber();
    const normalizedItems = items.map((item) => ({
      foodId: item.foodId || item._id,
      itemName: item.itemName,
      price: item.price,
      quantity: item.quantity,
      image: item.image || "",
    }));

    const order = await Order.create({
      userId,
      items: normalizedItems,
      address,
      totalAmount,
      orderNumber,
      paymentMethod,
      paymentStatus,
      razorpayId,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["confirmed", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

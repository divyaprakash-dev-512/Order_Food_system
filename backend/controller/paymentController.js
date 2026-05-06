const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET;
const hasDummyRazorpayKeys =
  !razorpayKeyId ||
  !razorpayKeySecret ||
  razorpayKeyId.includes("xxxxxxxx") ||
  razorpayKeySecret.includes("xxxxxxxx") ||
  razorpayKeyId.includes("YOUR_KEY") ||
  razorpayKeySecret.includes("YOUR_SECRET");

const instance = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});

exports.createOrder = async (req, res) => {
  try {
    const amount = Number(req.body.amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Amount missing" });
    }

    if (hasDummyRazorpayKeys) {
      return res.status(500).json({
        success: false,
        message: "Real Razorpay Key ID and Secret are required in backend .env",
      });
    }

    const order = await instance.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `food_${Date.now()}`,
    });

    res.status(200).json({ success: true, order, key: razorpayKeyId });
  } catch (error) {
    console.log("Razorpay order error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment details missing" });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", razorpayKeySecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid Signature" });
    }

    res.status(200).json({ success: true, message: "Payment Verified" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const express = require("express");
const { createPayment, executePayment } = require("../controllers/paymentController");
const { isAuthenticated } = require("../Middleware/isAuthenticated");  
const router = express.Router();


router.post("/create-payment", isAuthenticated, createPayment);
router.post("/execute-payment", isAuthenticated, executePayment);


router.get("/payment/success", (req, res) => {
  const { paymentId, PayerID } = req.query;

  if (!paymentId || !PayerID) {
    return res.status(400).send("Missing payment or payer information.");
  }

  
  res.send("Payment successful!");
});


router.get("/payment/cancel", (req, res) => {
  res.send("Payment cancelled.");
});

module.exports = router;

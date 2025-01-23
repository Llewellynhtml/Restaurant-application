const express = require("express");
const { createOrder, captureOrder } = require("../controllers/paymentController");

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/capture-order", captureOrder);

module.exports = router;  // Make sure you are exporting the router here

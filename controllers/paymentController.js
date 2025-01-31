const paypal = require("paypal-rest-sdk");
const Reservation = require("../models/Reservation");

paypal.configure({
  mode: 'sandbox', // Ensure you're using the correct mode
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

const createPayment = async (req, res) => {
  const { reservationId } = req.body;

  try {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    const paymentAmount = reservation.amount;

    const paymentJson = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `${process.env.CLIENT_URL}/api/payments/payment/success`,  // Updated to include /api/payments
        cancel_url: `${process.env.CLIENT_URL}/api/payments/payment/cancel`,    // Updated to include /api/payments
      },
      transactions: [
        {
          amount: {
            total: paymentAmount.toFixed(2),
            currency: "USD",
          },
          description: `Payment for reservation ${reservationId}`,
        },
      ],
    };

    const payment = await new Promise((resolve, reject) => {
      paypal.payment.create(paymentJson, (error, payment) => {
        if (error) {
          console.error("Error creating PayPal payment:", error);
          reject(error);
        } else {
          resolve(payment);
        }
      });
    });

    const approvalUrl = payment.links.find(
      (link) => link.rel === "approval_url"
    ).href;

    res.status(200).json({ approvalUrl });
  } catch (error) {
    console.error("Error creating PayPal payment:", error);
    res.status(500).json({ message: "Error creating PayPal payment", error: error.message });
  }
};

const executePayment = async (req, res) => {
  const { paymentId, payerId, reservationId } = req.body;

  try {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.paymentStatus === "paid") {
      return res.status(400).json({
        message: "Payment has already been processed for this reservation.",
      });
    }

    const executePaymentJson = {
      payer_id: payerId,
    };

    const payment = await new Promise((resolve, reject) => {
      paypal.payment.execute(paymentId, executePaymentJson, (error, payment) => {
        if (error) {
          console.error("Error executing PayPal payment:", error);
          reject(error);
        } else {
          resolve(payment);
        }
      });
    });

    reservation.paymentStatus = "paid";
    await reservation.save();

    res.status(200).json({ message: "Payment successful", payment });
  } catch (error) {
    console.error("Error executing PayPal payment:", error);
    res.status(500).json({ message: "Error executing payment", error: error.message });
  }
};

module.exports = { createPayment, executePayment };

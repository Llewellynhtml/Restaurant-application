const paypal = require('@paypal/checkout-server-sdk');
const Reservation = require('../models/Reservation');

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error("PayPal credentials are missing. Please check your .env file.");
}

let environment;
if (process.env.NODE_ENV === 'production') {
  environment = new paypal.core.LiveEnvironment(clientId, clientSecret);
} else {
  environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

const client = new paypal.core.PayPalHttpClient(environment);


const createOrder = async (req, res) => {
  try {
    const { reservationId } = req.body;
    console.log('Received reservationId:', reservationId);

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    console.log('Fetched Reservation:', reservation);

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: reservation.amount.toFixed(2),
          },
        },
      ],
    });

    const order = await client.execute(request);

    console.log('PayPal Order Created:', order.result);
    return res.status(201).json({
      message: 'Order created successfully',
      orderId: order.result.id,
    });
  } catch (error) {
    console.error("PayPal Order Creation Error:", error.stack || error);

    res.status(500).json({
      message: 'Error creating order',
      error: error.response ? error.response : error.message,
    });
  }
};


const captureOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    console.log('Received orderId for capture:', orderId);

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const capture = await client.execute(request);

    console.log('PayPal Capture Response:', capture.result);
    res.status(200).json({
      message: 'Payment captured successfully',
      capture,
    });
  } catch (error) {
    console.error("PayPal Capture Order Error:", error.stack || error);
    res.status(500).json({ message: 'Error capturing order', error });
  }
};

module.exports = { createOrder, captureOrder };
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    reservationDate: { type: Date, required: true, min: new Date() },
    timeSlot: { type: String, required: true },
    amount: { type: Number, required: true }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reservation', reservationSchema);

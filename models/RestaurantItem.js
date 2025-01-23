const mongoose = require('mongoose');

const restaurantItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    cuisine: { type: String, required: true },
    availableSlots: [
      {
        date: { type: Date, required: true },
        time: { type: String, required: true },
        available: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true } 
);

module.exports = mongoose.model('RestaurantItem', restaurantItemSchema);

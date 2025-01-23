const Reservation = require('../models/Reservation');
const RestaurantItem = require('../models/RestaurantItem');

const createReservation = async (req, res) => {
  try {
    const { userId, restaurantId, reservationDate, timeSlot, amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const restaurant = await RestaurantItem.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const slotAvailable = restaurant.availableSlots.find(
      (slot) => slot.date.toISOString() === new Date(reservationDate).toISOString() && slot.time === timeSlot && slot.available
    );

    if (!slotAvailable) {
      return res.status(400).json({ message: 'Time slot not available' });
    }

    
    const reservation = await Reservation.create({
      userId,
      restaurantId,
      reservationDate,
      timeSlot,
      amount,  
    });

    res.status(201).json({
      message: 'Reservation created successfully. Proceed to payment.',
      reservation,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating reservation', error });
  }
};

const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('userId').populate('restaurantId');
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reservations', error });
  }
};

const getReservationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const reservations = await Reservation.find({ userId }).populate('restaurantId');
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user reservations', error });
  }
};

const cancelReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;

    const reservation = await Reservation.findByIdAndDelete(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.status(200).json({ message: 'Reservation canceled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error canceling reservation', error });
  }
};

module.exports = {
  createReservation,
  getAllReservations,
  getReservationsByUser,
  cancelReservation,
};

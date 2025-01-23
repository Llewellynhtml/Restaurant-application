const express = require('express');
const { body } = require('express-validator');
const {
  createReservation,
  getAllReservations,
  getReservationsByUser,
  cancelReservation,
} = require('../controllers/reservationController');
const { isAdmin } = require('../Middleware/isAdmin');
const { isAuthenticated } = require('../Middleware/isAuthenticated');

const router = express.Router();

router.post(
  '/',
  isAuthenticated,
  body('userId').notEmpty(),
  body('restaurantId').notEmpty(),
  body('reservationDate').isISO8601(),
  body('timeSlot').notEmpty(),
  body('amount').isNumeric().withMessage('Amount must be a valid number'), 
  createReservation
);



router.get('/reservations', isAdmin, getAllReservations);
router.get('/reservations/user/:userId', isAuthenticated, getReservationsByUser);
router.delete('/reservations/:reservationId', isAuthenticated, cancelReservation);

module.exports = router;

const express = require('express');
const { createRestaurantItem } = require('../controllers/restaurantItemController');
const RestaurantItem = require('../models/RestaurantItem');

const router = express.Router();


router.post('/', createRestaurantItem);


router.get('/', async (req, res) => {
  try {
    const restaurants = await RestaurantItem.find();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurant items', error });
  }
});

module.exports = router;

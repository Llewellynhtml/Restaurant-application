const Review = require('../models/Review');

const addReview = async (req, res) => {
  const { userId, restaurantId, rating, comment } = req.body;

  try {
    const newReview = new Review({ userId, restaurantId, rating, comment });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: 'Error adding review' });
  }
};

module.exports = { addReview };

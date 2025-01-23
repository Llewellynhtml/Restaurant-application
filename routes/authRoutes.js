const express = require('express');
const { registerUser, loginUser, forgetPassword, resetPassword } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);  
router.post('/forgot-password', forgetPassword);
router.post('/reset-password', resetPassword);


router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

module.exports = router;

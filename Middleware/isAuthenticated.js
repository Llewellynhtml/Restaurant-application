const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    console.log("Authenticated user:", req.session.user); 
    return next();
  } else {
    console.log("User not authenticated, session data:", req.session); 
    return res.status(401).json({ message: 'Not authenticated' });
  }
};

module.exports = { isAuthenticated };

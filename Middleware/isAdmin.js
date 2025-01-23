const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
      next(); 
    } else {
      return res.status(403).json({ message: 'Access forbidden: Admins only' });
    }
  };
  
  module.exports = { isAdmin };
  
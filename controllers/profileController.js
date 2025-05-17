const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const JWT_SECRET = process.env.JWT_SECRET;

const showProfile = async (req, res) => {
  const token = req.cookies.token || '';

  if (!token) {
    return res.redirect('/login?error=Please login first');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await userModel.getUserById(decoded.id);

    if (!user) {
      return res.redirect('/login?error=User not found');
    }

    res.render('profile', { user });
  } catch (err) {
    return res.redirect('/login?error=Session expired. Please login again.');
  }
};

module.exports = { showProfile };

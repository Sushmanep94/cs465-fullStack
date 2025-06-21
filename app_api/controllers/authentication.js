const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../models/user');

// REGISTER FUNCTION
const register = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: '' // will be set securely
    });

    // Hash password before saving
    user.setPassword(req.body.password);

    const savedUser = await user.save();
    const token = savedUser.generateJWT();

    return res.status(200).json({ token });

  } catch (err) {
    return res.status(400).json({ message: "Error saving user", error: err.message });
  }
};

// LOGIN FUNCTION
const login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: "All fields required" });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(404).json(err);
    }
    if (user) {
      const token = user.generateJWT();
      return res.status(200).json({ token });
    } else {
      return res.status(401).json(info);
    }
  })(req, res);
};

// EXPORTS
module.exports = {
  register,
  login
};

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}

// Registration Route
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists. Please sign in." });
    }

    // Log the plain password for debugging (remove this in production)
    console.log(`Plain password: ${password}`);

    // Correct hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Log the hashed password for debugging (remove this in production)
    console.log(`Hashed password: ${hashedPassword}`);

    // Create a new user
    user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();

    // Log the user object for debugging (remove this in production)
    console.log(`User saved: ${JSON.stringify(user)}`);

    // Create and send a token
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          console.error("Error generating JWT:", err);
          return res
            .status(500)
            .json({ message: "Server error: Failed to generate token" });
        }
        res.json({ token });
      }
    );
  } catch (err) {
    console.error("Registration Error:", err.message);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Login attempt with:", { email, password });
    let user = await User.findOne({ email });
    if (!user) {
      console.error(`User not found with email: ${email}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Password match status for ${email}:`, isMatch);

    if (!isMatch) {
      console.error(`Password mismatch for email: ${email}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          console.error("Error generating JWT:", err);
          return res.status(500).json({ message: "Server error" });
        }
        console.log(`Login successful for email: ${email}`);
        res.json({ token });
      }
    );
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

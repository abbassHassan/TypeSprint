// routes/user.js

const express = require("express");
const router = express.Router();
const { getMe } = require("../controllers/userController");
const auth = require("../middleware/auth");

// Get logged-in user's details
router.get("/me", auth, getMe);

module.exports = router;

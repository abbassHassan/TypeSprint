// routes/typingTest.js

const express = require("express");
const router = express.Router();
const {
  recordTypingTest,
  getTypingTests,
} = require("../controllers/typingTestController");
const auth = require("../middleware/auth");

// Record a new typing test
router.post("/", auth, recordTypingTest);

// Get all typing tests for the logged-in user
router.get("/", auth, getTypingTests);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  recordTypingTest,
  getTypingTests,
} = require("../controllers/typingTestController");
const auth = require("../middleware/auth");

router.post("/", auth, recordTypingTest);

router.get("/", auth, getTypingTests);

module.exports = router;

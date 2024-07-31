// controllers/typingTestController.js

const TypingTest = require("../models/TypingTest");

// @desc    Record a new typing test result
// @route   POST /api/typing-tests
// @access  Private
exports.recordTypingTest = async (req, res) => {
  const { wpm, accuracy } = req.body;

  try {
    const newTest = new TypingTest({
      user: req.user.id,
      wpm,
      accuracy,
    });

    const savedTest = await newTest.save();
    res.json(savedTest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @desc    Get all typing test results for a user
// @route   GET /api/typing-tests
// @access  Private
exports.getTypingTests = async (req, res) => {
  try {
    const tests = await TypingTest.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(tests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const TypingTest = require("../models/TypingTest");
const TextSample = require("../models/TextSample");

// @desc    Record a new typing test
// @route   POST /api/typing-tests
// @access  Private
exports.recordTypingTest = async (req, res) => {
  const { textSampleId, startTime, typedContent } = req.body;

  try {
    // Fetch the original text sample
    const textSample = await TextSample.findById(textSampleId);
    if (!textSample) {
      return res.status(404).json({ message: "Text sample not found" });
    }

    // Calculate time taken in minutes
    const timeTakenMinutes = (new Date() - new Date(startTime)) / 60000;

    // Calculate WPM (Words Per Minute)
    const wordsTyped = typedContent.split(" ").length;
    const wpm = wordsTyped / timeTakenMinutes;

    // Calculate accuracy
    const originalContent = textSample.content.slice(0, typedContent.length);
    let correctChars = 0;
    for (let i = 0; i < originalContent.length; i++) {
      if (originalContent[i] === typedContent[i]) {
        correctChars++;
      }
    }
    const accuracy = (correctChars / typedContent.length) * 100;

    // Create new typing test record
    const typingTest = new TypingTest({
      user: req.user.id,
      textSample: textSampleId,
      startTime: new Date(startTime),
      endTime: new Date(), // Current time as endTime
      wpm,
      accuracy,
    });

    const savedTest = await typingTest.save();
    res.json(savedTest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @desc    Get all typing tests for a user
// @route   GET /api/typing-tests
// @access  Private
exports.getTypingTests = async (req, res) => {
  try {
    const tests = await TypingTest.find({ user: req.user.id })
      .sort({ date: -1 })
      .populate("textSample", "content");
    res.json(tests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const TypingTest = require("../models/TypingTest");

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

const TypingTest = require("../models/TypingTest");
const TextSample = require("../models/TextSample");

exports.recordTypingTest = async (req, res) => {
  const { textSampleId, startTime, endTime, typedContent } = req.body;

  try {
    // Fetch the original text sample
    const textSample = await TextSample.findById(textSampleId);
    if (!textSample) {
      return res.status(404).json({ message: "Text sample not found" });
    }

    // Log startTime and endTime for debugging
    console.log(`Start time: ${new Date(startTime)}`);
    console.log(`End time: ${new Date(endTime)}`);

    // Calculate time taken in minutes
    const start = new Date(startTime);
    const end = new Date(endTime);
    const timeTakenMinutes = (end - start) / 60000;

    // Ensure timeTakenMinutes is positive
    if (timeTakenMinutes <= 0) {
      return res.status(400).json({ message: "Invalid time data" });
    }

    // Calculate WPM (Words Per Minute)
    const charactersTyped = typedContent.length;
    const wpm = charactersTyped / 5 / timeTakenMinutes;

    // Calculate accuracy
    const originalContent = textSample.content;
    let correctChars = 0;
    for (
      let i = 0;
      i < Math.min(originalContent.length, typedContent.length);
      i++
    ) {
      if (originalContent[i] === typedContent[i]) {
        correctChars++;
      }
    }
    const accuracy = (correctChars / originalContent.length) * 100;

    // Create new typing test record
    const typingTest = new TypingTest({
      user: req.user.id,
      textSample: textSampleId,
      startTime: start,
      endTime: end,
      wpm,
      accuracy,
    });

    const savedTest = await typingTest.save();
    res.json(savedTest);
  } catch (err) {
    console.error("Error recording typing test:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/textSampleController.js

const TextSample = require("../models/TextSample");

// @desc    Get a random text sample
// @route   GET /api/text-samples/random
// @access  Public
exports.getRandomTextSample = async (req, res) => {
  try {
    const count = await TextSample.countDocuments();
    if (count === 0) {
      return res.status(404).json({ message: "No text samples found" });
    }
    const random = Math.floor(Math.random() * count);
    const textSample = await TextSample.findOne().skip(random);

    if (!textSample) {
      return res.status(404).json({ message: "No text sample found" });
    }

    res.json(textSample);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @desc    Get all text samples
// @route   GET /api/text-samples
// @access  Public
exports.getAllTextSamples = async (req, res) => {
  try {
    const textSamples = await TextSample.find();
    res.json(textSamples);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @desc    Add a new text sample
// @route   POST /api/text-samples
// @access  Private (only for admins or authorized users)
exports.addTextSample = async (req, res) => {
  const { content, difficulty_level, author, source, language } = req.body;

  try {
    const newTextSample = new TextSample({
      content,
      difficulty_level,
      author,
      source,
      language,
    });

    const textSample = await newTextSample.save();
    res.json(textSample);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @desc    Delete a text sample
// @route   DELETE /api/text-samples/:id
// @access  Private (only for admins or authorized users)
exports.deleteTextSample = async (req, res) => {
  try {
    const textSample = await TextSample.findById(req.params.id);

    if (!textSample) {
      return res.status(404).json({ message: "Text sample not found" });
    }

    await textSample.remove();
    res.json({ message: "Text sample removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Text sample not found" });
    }
    res.status(500).send("Server error");
  }
};

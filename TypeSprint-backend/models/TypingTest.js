// models/TypingTest.js

const mongoose = require("mongoose");

const TypingTestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  wpm: {
    type: Number,
    required: true,
  },
  accuracy: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const TypingTest = mongoose.model("TypingTest", TypingTestSchema);

module.exports = TypingTest;

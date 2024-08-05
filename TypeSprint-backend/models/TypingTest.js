// models/TypingTest.js

const mongoose = require("mongoose");

const TypingTestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  textSample: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TextSample",
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
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

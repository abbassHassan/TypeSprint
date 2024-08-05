// models/TextSample.js

const mongoose = require("mongoose");

const TextSampleSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  difficulty_level: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium",
  },
  author: {
    type: String,
  },
  source: {
    type: String,
  },
  language: {
    type: String,
    default: "English",
  },
});

const TextSample = mongoose.model("TextSample", TextSampleSchema);

module.exports = TextSample;

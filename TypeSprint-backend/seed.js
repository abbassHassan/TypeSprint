// seed.js

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const TextSample = require("./models/TextSample");

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected...");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Define text samples
const textSamples = [
  {
    content: "The quick brown fox jumps over the lazy dog.",
    difficulty_level: "easy",
    author: "Anonymous",
    source: "Proverb",
    language: "English",
  },
  {
    content: "To be or not to be, that is the question.",
    difficulty_level: "medium",
    author: "William Shakespeare",
    source: "Hamlet",
    language: "English",
  },
  {
    content: "In a galaxy far, far away, a great adventure is about to begin.",
    difficulty_level: "hard",
    author: "George Lucas",
    source: "Star Wars",
    language: "English",
  },
  {
    content: "She sells seashells by the seashore.",
    difficulty_level: "easy",
    author: "Unknown",
    source: "Tongue Twister",
    language: "English",
  },
  {
    content: "It was the best of times, it was the worst of times.",
    difficulty_level: "medium",
    author: "Charles Dickens",
    source: "A Tale of Two Cities",
    language: "English",
  },
];

// Insert text samples into database
const seedDatabase = async () => {
  try {
    await TextSample.deleteMany(); // Clears the collection
    console.log("Existing text samples removed.");

    await TextSample.insertMany(textSamples); // Inserts new documents
    console.log("Text samples added.");

    mongoose.connection.close(); // Close the connection
  } catch (err) {
    console.error("Seeding error:", err);
    mongoose.connection.close();
  }
};

seedDatabase();

const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const typingTestRoutes = require("./routes/typingTest");
const textSampleRoutes = require("./routes/textSample");

connectDB();

const app = express();

console.log("Environment Variables Loaded:", process.env.JWT_SECRET); // Log all environment variables

app.use(cors()); // You can specify specific origins by passing an options object, e.g., { origin: 'http://localhost:3000' }

app.use(express.json());

// Define routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/typing-tests", typingTestRoutes);
app.use("/api/text-samples", textSampleRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

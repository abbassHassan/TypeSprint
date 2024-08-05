const express = require("express");
const router = express.Router();
const { getRandomTextSample } = require("../controllers/textSampleController");

router.get("/random", getRandomTextSample);

module.exports = router;

// userRoutes.js
const express = require("express");
const router = express.Router();
const allseason = require("../../controllers/seasonStats/seasonStats");


router.get("/:id", allseason.getSeasonStats);


module.exports = router;

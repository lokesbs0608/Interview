// userRoutes.js
const express = require("express");
const router = express.Router();
const allseason = require("../../controllers/matchStats/getMatchStats");


router.get("/:id", allseason.getMatchStats);


module.exports = router;

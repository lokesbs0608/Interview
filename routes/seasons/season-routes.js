// userRoutes.js
const express = require("express");
const router = express.Router();
const allseason = require("../../controllers/seasons/getAllSeason");
const matchbyseason = require("../../controllers/seasons/getallmatchbyseason");
const matchDetails = require("../../controllers/seasons/getMatchDetails")

router.get("/allseasons", allseason.getAllSeasons);
router.get("/matches/:id", matchbyseason.getMatchesForSeason);
router.get("/match/:id", matchDetails.getMatchDetails);

module.exports = router;

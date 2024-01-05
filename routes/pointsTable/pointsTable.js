const express = require("express");
const router = express.Router();
const pointsTable = require("../../controllers/pointsTable/pointsTable");

router.get("/:season", pointsTable.getMatchesForSeason);

module.exports = router;

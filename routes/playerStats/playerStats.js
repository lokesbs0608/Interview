const express = require("express");
const router = express.Router();
const playerStats = require("../../controllers/playerStats/playerStats");
const seasonPlayerStats = require("../../controllers/playerStats/seasonPlayersStats");
const battingStats = require("../../controllers/playerStats/battingStats")

router.get("/details/playerList/:season?/:playerName?", seasonPlayerStats.getSeasonPlayerStats);

router.get("/details/:playerName/:season?", playerStats.getPlayerStats);

router.get("/details/battingStats/:playerName/:season?", battingStats.getBatsManStatByBowler);

module.exports = router;

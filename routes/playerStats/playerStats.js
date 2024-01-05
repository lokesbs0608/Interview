const express = require("express");
const router = express.Router();
const playerStats = require("../../controllers/playerStats/playerStats");
const seasonPlayerStats = require("../../controllers/playerStats/seasonPlayersStats");

router.get("/details/playerList/:season?/:playerName?", seasonPlayerStats.getSeasonPlayerStats);

router.get("/details/:playerName/:season?", playerStats.getPlayerStats);

module.exports = router;

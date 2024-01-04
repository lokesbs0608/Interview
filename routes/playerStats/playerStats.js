const express = require("express");
const router = express.Router();
const playerStats = require("../../controllers/playerStats/playerStats");

router.get("/details/:playerName/:season?", playerStats.getPlayerStats);

module.exports = router;

// userRoutes.js
const express = require("express");
const router = express.Router();
const allseason = require("../../controllers/matchStats/getMatchStats");


router.get("/allseasons", allseason.getMatchDetails);


module.exports = router;

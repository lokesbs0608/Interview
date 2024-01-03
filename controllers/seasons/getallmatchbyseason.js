const { Sequelize, DataTypes } = require("sequelize");
const encryptData = require("../../enc")

const sequelize = require("../../db");

const DeliveriesUpdateTable = sequelize.define(
  "matches_updated_mens_ipl",
  {
    season: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "matches_updated_mens_ipl",
    timestamps: false,
  }
);

const getMatchesForSeason = async (req, res) => {
  const requestedSeason = req.params.id;
  try {
    const distinctMatches = await DeliveriesUpdateTable.findAll({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("matchId")), "matchId"],
        "venue",
        "winner",
        "toss_winner",
        "toss_decision",
        "team1",
        "team2",
        "date",
        "match_referee",
        "outcome",
        "umpire2",
        "umpire1",
        "winner_runs",
        "eliminator",
        "player_of_match",
        "tv_umpire",
        "winner_wickets",
        "match_referee",
        "match_number",
      ],
      where: { season: requestedSeason },
      raw: true,
    });

    console.log(distinctMatches.length);
    let obj = {
      res: distinctMatches,
    };
    const encryptedData = encryptData(obj);
    res.send(encryptedData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getMatchesForSeason,
};

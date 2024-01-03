const { Sequelize, DataTypes } = require("sequelize");
const encryptData = require("../../enc");

const sequelize = require("../../db");

const DeliveriesUpdateTable = sequelize.define(
  "deliveries_update_table",
  {
    matchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "deliveries_update_table",
    timestamps: false,
  }
);
const MatchdetailsTable = sequelize.define(
  "matches_updated_mens_ipl",
  {
    matchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "matches_updated_mens_ipl",
    timestamps: false,
  }
);

const getSeasonStats = async (req, res) => {
  const requestedSeason = req.params.id;

  try {
    // Retrieve match details
    const matchDetails = await DeliveriesUpdateTable.findAll({
      attributes: [
        "batting_team",
        [Sequelize.fn("SUM", Sequelize.col("batsman_runs")), "total_season_runs"],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal("CASE WHEN batsman_runs = 4 THEN 1 ELSE 0 END")
          ),
          "total_fours",
        ],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal("CASE WHEN batsman_runs = 6 THEN 1 ELSE 0 END")
          ),
          "total_six",
        ],
        [
          Sequelize.fn("SUM", Sequelize.col("extras")),
          "extras",
        ],
        [
          Sequelize.fn("SUM", Sequelize.col("isWide")),
          "wides",
        ],
        [
          Sequelize.fn("SUM", Sequelize.col("LegByes")),
          "leg_byes",
        ],
        [
          Sequelize.fn("SUM", Sequelize.col("Byes")),
          "byes",
        ], [
          Sequelize.fn("SUM", Sequelize.col("isNoBall")),
          "no_balls",
        ],
      ],
      where: { season: requestedSeason },
      group: ["batting_team"],
      raw: true,
    });



    const getTotal = () => {
      let obj = {
        total_runs: 0,
        total_fours: 0,
        total_six: 0,
        total_wides:0,
        total_byes:0,
        total_leg_byes:0,
        total_no_balls:0,
      }
      matchDetails.forEach((val) => {
        obj.total_runs += parseInt(val.total_season_runs, 10);
        obj.total_fours += parseInt(val.total_fours, 10);
        obj.total_six += parseInt(val.total_six, 10);
        obj.total_wides += parseInt(val.wides, 10);
        obj.total_byes+= parseInt(val.byes, 10);
        obj.total_leg_byes+= parseInt(val.leg_byes, 10);
        obj.total_no_balls+= parseInt(val.no_balls, 10);
      });
      return obj
    }

    // Construct the response object
    const statistics = {
      total_fours: getTotal().total_fours,
      total_six:getTotal().total_six,
      total_runs: getTotal().total_runs,
      total_wides:getTotal().total_wides,
      total_byes:getTotal().total_byes,
      total_leg_byes:getTotal().total_leg_byes,
      total_no_balls:getTotal().total_leg_byes
    };

    let obj = {
      res: {statistics,team_contribution:matchDetails},
    };
    const encryptedData = encryptData(obj);
    res.send(obj);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getSeasonStats,
};

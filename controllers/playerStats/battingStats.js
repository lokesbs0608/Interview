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
    batsman: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    season: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bowlers: {
      type: DataTypes.ARRAY(DataTypes.JSON), // Make sure it's an array of JSON objects
      allowNull: true,
    },
    dismissal_kind: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "deliveries_update_table",
    timestamps: false,
  }
);

const getBatsManStatByBowler = async (req, res) => {
  const requestedPlayer = req.params.playerName;
  const requestedSeason = req.params.season;

  whereCondition = {};
  if (requestedPlayer !== null && requestedPlayer !== undefined) {
    whereCondition.batsman = {
      [Sequelize.Op.like]: `%${requestedPlayer}%`,
    };
  }

  if (requestedSeason !== null && requestedSeason !== undefined) {
    whereCondition.season = requestedSeason;
  }
  try {
    const playerStats = await DeliveriesUpdateTable.findAll({
      attributes: [
        "batsman",
        "matchId",
        "bowler",
        "batsman_runs",
        "dismissal_kind",
        "inning",
        "over_ball",
        "bowling_team",
        "player_dismissed",
      ],
      where: whereCondition,
      raw: true,
    });

    function getCricketStats(data) {
      // Initialize stats objects
      const batsmanStats = {};
      const bowlerStats = {};

      // Iterate over each cricket record in the data
      let i = 0;
      data.forEach((record) => {
        // Batsman stats
        if (
          true
        ) {
          if (!batsmanStats[record.batsman]) {
            batsmanStats[record.batsman] = {
              total_outs: 0,
              total_balls_faced: 0,
              total_runs_scored: 0,
            };
          }
   
          batsmanStats[record.batsman].total_runs_scored += record.batsman_runs;
          if(record.dismissal_kind != ''){
            batsmanStats[record.batsman].total_outs +=1;
          }
          batsmanStats[record.batsman].total_balls_faced +=1;
          console.log(record)
        }

        // Bowler stats
        if (!bowlerStats[record.bowler]) {
          bowlerStats[record.bowler] = {
            total_outs: 0,
            total_runs: 0,
            total_sixes: 0,
            total_fours: 0,
            total_zeros: 0,
            total_balls_bowled_to_batsman: 0,
          };
        }

        if (
          record.player_dismissed === record.batsman &&
          record.dismissal_kind !== null
        ) {
          bowlerStats[record.bowler].total_outs += 1;
        }

        bowlerStats[record.bowler].total_runs += record.batsman_runs;

        // Increment the total balls bowled to the batsman
        if (record.batsman === record.batsman) {
          bowlerStats[record.bowler].total_balls_bowled_to_batsman += 1;
        }
        if (record.batsman_runs === 6) {
          bowlerStats[record.bowler].total_sixes += 1;
        } else if (record.batsman_runs === 4) {
          bowlerStats[record.bowler].total_fours += 1;
        } else if (record.batsman_runs === 0) {
          bowlerStats[record.bowler].total_zeros += 1;
        }
      });

      return {
        batsmanStats,
        bowlerStats,
      };
    }
    res.status(200).send(getCricketStats(playerStats));
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getBatsManStatByBowler,
};

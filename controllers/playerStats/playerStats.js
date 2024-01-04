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

const getPlayerStats = async (req, res) => {
    try {
        const requestedPlayer = req.params.playerName;
        const requestedSeason = req.params.season;

        const whereCondition = {
            batsman: {
                [Sequelize.Op.like]: `%${requestedPlayer}%`,
            },
        };

        if (requestedSeason !== null && requestedSeason !== undefined) {
            whereCondition.season = requestedSeason;
        }
        const playerStats = await DeliveriesUpdateTable.findAll({
            attributes: [
                "matchId",
                "batsman",
                "season",
                [Sequelize.fn("SUM", Sequelize.col("batsman_runs")), "total_runs"],
                [Sequelize.fn("COUNT", Sequelize.col("matchId")), "total_matches"],
                [
                    Sequelize.fn(
                        "SUM",
                        Sequelize.literal("CASE WHEN batsman_runs = 4 THEN 1 ELSE 0 END")
                    ),
                    "total_fours",
                ],
                [Sequelize.fn("COUNT", Sequelize.col("ball")), "total_balls"],
                [
                    Sequelize.fn(
                        "SUM",
                        Sequelize.literal("CASE WHEN batsman_runs = 6 THEN 1 ELSE 0 END")
                    ),
                    "total_six",
                ],
                [Sequelize.fn("SUM", Sequelize.col("batsman_runs")), "highest_score"],
                [
                    Sequelize.fn(
                      "MAX",
                      Sequelize.literal(
                        "CASE WHEN dismissal_kind IS NOT NULL THEN dismissal_kind ELSE NULL END"
                      )
                    ),
                    "dismissal_kind",
                  ],
            ],
            where: whereCondition,
            group: ["matchId", "batsman", "season"],
            raw: true,
        });

        const totalMatchesPlayed = playerStats.length;
        const totalRunsScored = playerStats.reduce(
            (total, match) => total + +match.total_runs,
            0
        );
        const totalFours = playerStats.reduce(
            (total, match) => total + +match.total_fours,
            0
        );
        const totalSixes = playerStats.reduce(
            (total, match) => total + +match.total_six,
            0
        );
        const highestScore = playerStats.reduce(
            (max, match) => Math.max(max, +match.highest_score),
            0
        );
        const total_Ball = playerStats.reduce(
            (total, match) => total + +match.total_balls,
            0
        );
        const total_dismissal = playerStats.reduce(
            (total, match) => total + (match.dismissal_kind !== null && match.dismissal_kind !== '' ? 1 : 0),
            0
        );
        const total_hundreds = playerStats.reduce(
            (total, match) => total + (match.total_runs >= 100 ? 1 : 0),
            0
        );
        const total_two_hundreds = playerStats.reduce(
            (total, match) => total + (match.total_runs >= 200 ? 1 : 0),
            0
        );
        
        const total_fifties = playerStats.reduce(
            (total, match) => total + (match.total_runs >= 50 && match.total_runs < 100 ? 1 : 0),
            0
        );
        const strike_rate = (totalRunsScored / total_Ball) * 100;
        const not_outs = totalMatchesPlayed - total_dismissal

        const playerDetails = {
            playerName: playerStats[0].batsman,
            totalMatchesPlayed,
            totalRunsScored,
            totalFours,
            totalSixes,
            highestScore,
            total_Ball,
            strike_rate,
            total_hundreds,
            total_fifties,
            total_two_hundreds,
            total_dismissal,
            not_outs
        };

        res.send(playerDetails);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    getPlayerStats,
};

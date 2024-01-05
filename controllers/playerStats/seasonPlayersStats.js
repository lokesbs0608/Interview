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
        },
    },
    {
        tableName: "deliveries_update_table",
        timestamps: false,
    }
);

const getSeasonPlayerStats = async (req, res) => {
    console.log(req.body)
    const requestedSeason = req.params.season;
    const whereCondition = {};

    if (requestedSeason !== null && requestedSeason !== undefined) {
        whereCondition.season = requestedSeason;
    }
    try {
        const playerStats = await DeliveriesUpdateTable.findAll({
            attributes: [
                "batsman",
                [Sequelize.fn("COUNT", Sequelize.literal("DISTINCT matchId")), "total_matches_played"],
                [Sequelize.fn("SUM", Sequelize.col("batsman_runs")), "total_runs"],
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
            ],
            group: ["batsman"],
            where: whereCondition,
            raw: true,
        });

        const formattedPlayerStats = playerStats.map((player) => ({
            playerName: player.batsman,
            innings_played: player.total_matches_played,
            total_runs: player.total_runs,
            total_fours: player.total_fours,
            total_sixes: player.total_six,
            highest_score: player.highest_score
        }));

        res.json(formattedPlayerStats);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    getSeasonPlayerStats,
};

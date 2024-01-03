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

const getMatchStats = async (req, res) => {
    const requestedMatch = req.params.id;
    console.log(requestedMatch);
    try {
        // Retrieve match details
        const matchDetails = await MatchdetailsTable.findAll({
            attributes: ["matchId", "venue", "team1", "team2", "date"],
            where: { matchId: requestedMatch },
            raw: true,
        });
        // Retrieve scorecard details
        const batsmanStats = await DeliveriesUpdateTable.findAll({
            attributes: [
                "batsman",
                "batting_team",
                [Sequelize.fn("SUM", Sequelize.col("batsman_runs")), "total_runs"],
                [Sequelize.fn("COUNT", Sequelize.col("ball")), "total_balls"],
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
                ]
            ],
            where: { matchId: requestedMatch },
            group: ["batsman", "batting_team"],
            raw: true,
        });
        // Retrieve bowler details
        const bowlerStats = await DeliveriesUpdateTable.findAll({
            attributes: [
                [Sequelize.fn("DISTINCT", Sequelize.col("bowler")), "bowler"],
                "bowling_team",
                [
                    Sequelize.fn("SUM", Sequelize.col("batsman_runs")),
                    "total_runs_given",
                ],
                [
                    Sequelize.fn("COUNT", Sequelize.col("batsman_runs")),
                    "total_balls_bowled",
                ],
                [
                    Sequelize.fn(
                        "COUNT",
                        Sequelize.literal(
                            "DISTINCT CASE WHEN dismissal_kind IS NOT NULL AND dismissal_kind != '' THEN CONCAT(matchId, player_dismissed, non_striker, bowler) ELSE NULL END"
                        )
                    ),
                    "total_wickets",
                ],
            ],

            where: { matchId: requestedMatch },
            group: ["bowler", "bowling_team"], // Corrected the group attribute
            raw: true,
        });
         // Retrieve match extra
        const matchExtras = await DeliveriesUpdateTable.findAll({
            attributes: [
                "inning",
                "bowling_team",
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
                ],

                [Sequelize.fn("COUNT", Sequelize.literal("DISTINCT CASE WHEN isNoBall IS NOT NULL AND isNoBall != '' THEN CONCAT(matchId, batsman_runs, batsman, bowler) ELSE NULL END")), "no_balls"]
            ],
            where: { matchId: requestedMatch },
            group: ["inning", "bowling_team"], // Corrected the group attribute
            raw: true,
        });

        // add economy
        batsmanStats.forEach((batsman) => {
            const economy = (batsman.total_runs / batsman.total_balls) * 100;
            batsman.economy = economy;
        });

        // Find the batsman with the highest runs
        const highestRunScorer = batsmanStats.reduce((prev, current) =>
            prev.total_runs > current.total_runs ? prev : current
        );
        
        const highestSixes = batsmanStats.reduce((prev, current) =>
            prev.total_six > current.total_six ? prev : current
        );

        const highestFours = batsmanStats.reduce((prev, current) =>
            prev.total_fours > current.total_fours ? prev : current
        );
        // Find the bowler with the highest wickets
        const highestWicketBowler = bowlerStats.reduce((prev, current) =>
            prev.total_wickets > current.total_wickets ? prev : current
        );

        bowlerStats.forEach((bowler) => {
            const totalOversBowled = bowler.total_balls_bowled / 6;
            const economy = (bowler.total_runs_given / totalOversBowled).toFixed(2);
            bowler.total_overs_bowled = totalOversBowled.toFixed(2);
            bowler.economy = economy;
        });

        // Construct the response object
        const statistics = {
            match_id: matchDetails[0].matchId,
            venue: matchDetails[0].venue,
            date: matchDetails[0].date,
            team1: matchDetails[0].team1,
            team2: matchDetails[0].team2,
            highest_run: highestRunScorer,
            highest_wicket: highestWicketBowler,
            batsman: batsmanStats,
            bowler: bowlerStats,
            extra: matchExtras,
            highestSixes: highestSixes,
            highestFours: highestFours
        };

        let obj = {
            res: statistics,
        };
        const encryptedData = encryptData(obj);
        res.send(encryptedData);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    getMatchStats,
};

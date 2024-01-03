const { Sequelize, DataTypes } = require("sequelize");

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

const getMatchDetails = async (req, res) => {
    const requestedMatch = req.params.id;
    try {
        const Scorecard = await DeliveriesUpdateTable.findAll({
            attributes: [
                "inning",
                "batsman",
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
                [Sequelize.fn("COUNT", Sequelize.col("ball")), "total_balls"],
                [
                    Sequelize.fn(
                        "MAX",
                        Sequelize.literal("CASE WHEN dismissal_kind IS NOT NULL THEN dismissal_kind ELSE NULL END")
                    ),
                    "dismissal_kind",
                ]
            ],
            where: {
                matchId: requestedMatch,
                inning: {
                    [Sequelize.Op.lte]: 2,
                },
            },
            group: [ "inning", "batsman",],
            raw: true,
        });
        const Details = await MatchdetailsTable.findAll({
            attributes: [
                "matchId",
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
                "reserve_umpire"
            ],
            where: { matchId: requestedMatch },
            raw: true,
        });

        let MatchDetails = Details[0]
        let obj = {
            match_id: MatchDetails.matchId,
            match_number: MatchDetails?.match_number,
            venue: MatchDetails?.venue,
            date: MatchDetails?.date,
            team1: MatchDetails?.team1,
            team2: MatchDetails?.team2,
            player_of_match: MatchDetails?.player_of_match,
            umpires: {
                match_referee: MatchDetails?.match_referee,
                umpire1: MatchDetails?.umpire1,
                umpire2: MatchDetails?.umpire2,
                tv_umpire: MatchDetails?.tv_umpire,
                reserve_umpire: MatchDetails?.reserve_umpire
            },
            toss: {
                toss_winner: MatchDetails?.toss_winner,
                toss_decision: MatchDetails?.toss_decision,
            },
            scorecard: {
                first_innings: Scorecard.filter((a) => a.inning === 1),
                second_innings: Scorecard.filter((a) => a.inning === 2),
            },
            winner: MatchDetails?.winner,
            outcome: MatchDetails?.outcome,
        }
        res.send(obj);
    } catch (error) {
        console.error("Error:", error);
    }
};

module.exports = {
    getMatchDetails,
};

const { Sequelize, DataTypes } = require("sequelize");
const encryptData = require("../../enc");

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
    const requestedSeason = req.params.season;
    try {
        const distinctMatches = await DeliveriesUpdateTable.findAll({
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
            ],
            where: { season: requestedSeason },
            raw: true,
        });

        const pointsTable = {};
        const teamsStats = {};

        distinctMatches.forEach((match) => {
            // Increment total matches played for both teams
            teamsStats[match.team1] = teamsStats[match.team1] || { totalMatchesPlayed: 0, totalWon: 0, totalLost: 0, totalTie: 0 ,total_NR:0};
            teamsStats[match.team2] = teamsStats[match.team2] || { totalMatchesPlayed: 0, totalWon: 0, totalLost: 0, totalTie: 0,total_NR:0 };

            teamsStats[match.team1].totalMatchesPlayed += 1;
            teamsStats[match.team2].totalMatchesPlayed += 1;

            if (match.outcome !== "tie" && match.winner) {
                // Increment total won for the winning team
                pointsTable[match.winner] = (pointsTable[match.winner] || 0) + 2;
                teamsStats[match.winner].totalWon += 1;
                teamsStats[match.team1].totalLost += 1;

            } else if (match.outcome == "tie"  ) {
            
                // Increment tie count for both teams in case of a tie
                pointsTable[match.team1] = (pointsTable[match.team1] || 0) + 1;
                pointsTable[match.team2] = (pointsTable[match.team2] || 0) + 1;
                teamsStats[match.team1].totalTie += 1;
                teamsStats[match.team2].totalTie += 1;
            }
            else if ( match.outcome == "no result" ) {
            
                // Increment tie count for both teams in case of a tie
                pointsTable[match.team1] = (pointsTable[match.team1] || 0) + 1;
                pointsTable[match.team2] = (pointsTable[match.team2] || 0) + 1;
                teamsStats[match.team1].total_NR += 1;
                teamsStats[match.team2].total_NR += 1;
            }
         

 
        });

        // Convert pointsTable object to an array of objects
        const pointsList = Object.keys(pointsTable).map((team) => ({
            team,
            points: pointsTable[team],
        }));

        // Sort the pointsList in descending order of points
        pointsList.sort((a, b) => b.points - a.points);

        // Add additional fields to each team in the pointsList
        const extendedPointsList = pointsList.map((team) => ({
            ...team,
            ...teamsStats[team.team],
           
        }));

        let obj = {
            res: extendedPointsList,
        };
        const encryptedData = encryptData(obj);
        console.log(distinctMatches,'>>>>>>>>')
        res.send(obj);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    getMatchesForSeason,
};

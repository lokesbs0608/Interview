const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');

app.use(bodyParser.json());





const seasonRoutes = require("./routes/seasons/season-routes");
const statsRoutes = require("./routes/matchStats/matchStats");
const seasonstatsRoutes = require("./routes/seasonStats/seasonStats");
const playerStatsRoutes = require("./routes/playerStats/playerStats");
const pointsTable = require("./routes/pointsTable/pointsTable");
const userTable = require("./routes/user/user");

// Enable CORS for all routes
app.use(cors());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });

  
app.use("/api/seasons", seasonRoutes);
app.use("/api/season_stats", seasonstatsRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/player", playerStatsRoutes);
app.use("/api/points_table/", pointsTable);
app.use("/api/user", userTable);




app.listen(process.env.PORT, () => {
    console.log(`server running on port ${process.env.PORT}`);
});

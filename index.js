const express = require('express');
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
require('dotenv').config();
const { Sequelize } = require('sequelize');

const seasonRoutes = require('./routes/seasons/season-routes');


module.exports.connection = new Sequelize(process.env.DB_NAME, process.env.DB_USER_NAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
});


app.use('/api/seasons', seasonRoutes);
// App run

app.listen(process.env.PORT, () => {
    console.log(`server running on port ${process.env.PORT}`)
})


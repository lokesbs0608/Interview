// models/user.js

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../db");

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Add any other fields you need for your User model
});

module.exports = User;

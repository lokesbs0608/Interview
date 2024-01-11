const { DataTypes } = require("sequelize");
const {encryptData} = require("../../enc")
const sequelize = require("../../db");

const DeliveriesUpdateTable = sequelize.define(
  "deliveries_update_table",
  {
    season: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "deliveries_update_table",
    timestamps: false,
  }
);

const getAllSeasons = async (req, res) => {
  try {
    const uniqueSeasons = await DeliveriesUpdateTable.findAll({
      attributes: ["season"],
      group: ["season"],
      raw: true,
    });

    const seasonArray = uniqueSeasons.map((item) => item.season);

    let obj = {
      res: seasonArray,
    };
    // const encryptedData = encryptData(obj);
    res.send(obj);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getAllSeasons,
};

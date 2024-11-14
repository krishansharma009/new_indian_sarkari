const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/datasource-db");

class Depertment extends Model {}

Depertment.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
      // unique: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Depertment",
    tableName: "depertments",
    timestamps: false,
    paranoid: true,
  }
);
module.exports = Depertment;

const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/datasource-db");

class SocialLink extends Model {}

SocialLink.init(
  {
    platformName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    socialIcon: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, 
    },
  },
  {
    sequelize,
    modelName: "SocialLink",
    tableName: "social_links", 
    paranoid: true,
    timestamps: true, 
  }
);

module.exports = SocialLink;

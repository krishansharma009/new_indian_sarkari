const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/datasource-db'); 

class WebStory extends Model {}

WebStory.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    coverImageUrl: {
      type: DataTypes.STRING,
      allowNull: false,  // Cover image is required for a story preview
    },
  },
  { sequelize, modelName: 'WebStory', paranoid: true }
);

module.exports = WebStory;

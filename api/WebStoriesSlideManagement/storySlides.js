const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/datasource-db');
const WebStory = require('../WebStoriesManagement/story');

class WebStorySlide extends Model {}

WebStorySlide.init(
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { sequelize, modelName: 'WebStorySlide', paranoid: true }
);

WebStorySlide.belongsTo(WebStory, { foreignKey: 'webStoryId', onDelete: 'CASCADE' });
WebStory.hasMany(WebStorySlide, { foreignKey: 'webStoryId' });

module.exports = WebStorySlide;

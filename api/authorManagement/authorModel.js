const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/datasource-db');


class Author extends Model {}

Author.init({

  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 30]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100]
    }
  },
  description: {
    type: DataTypes.STRING,
  },
  profilePic: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
  modelName: 'Author',
});

module.exports = Author;
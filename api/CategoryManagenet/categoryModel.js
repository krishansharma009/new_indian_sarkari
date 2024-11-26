const {DataTypes,Model} = require('sequelize');
const sequelize = require("../../config/datasource-db");

class Category extends Model{}

Category.init(
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

    // title: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    // description: {
    //   type: DataTypes.TEXT,
    //   allowNull: true,
    // },
    // // fileUrl: {
    // //   type: DataTypes.STRING,
    // //   allowNull: false,
    // // },
    // educationLevel: {
    //   type: DataTypes.STRING, // Example: 'Undergraduate', 'Postgraduate', etc.
    //   allowNull: false,
    // },
    // courseName: {
    //   type: DataTypes.STRING, // Example: 'Computer Science', 'Mechanical Engineering', etc.
    //   allowNull: false,
    // },
    // jobTitle: {
    //   type: DataTypes.STRING, // Example: 'Software Engineer', 'Data Analyst', etc.
    //   allowNull: false,
    // },

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
    modelName: "Category",
    tableName: "categories",
    timestamps: false,
    paranoid: true,
  }
);
module.exports = Category;

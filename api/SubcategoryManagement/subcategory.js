const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/datasource-db");
const Category = require("../../api/CategoryManagenet/categoryModel"); // Import the Category model

class Subcategory extends Model {}

Subcategory.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category, // Correctly reference the Category model
        key: "id",
      },
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
    modelName: "Subcategory",
    tableName: "subcategorys",
    timestamps: false,
    paranoid: true,
  }
);

// Define the associations
Category.hasMany(Subcategory, { foreignKey: "category_id" });
Subcategory.belongsTo(Category, { foreignKey: "category_id" });

module.exports = Subcategory;

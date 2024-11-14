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
      allowNull: true,
      references: {
        model: Category, // Correctly reference the Category model
        key: "id",
      },
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

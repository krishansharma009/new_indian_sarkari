const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/datasource-db");
const Category = require("../../api/CategoryManagenet/categoryModel");
const State = require("../../api/StateManagement/state");
const Subcategory = require("../../api/SubcategoryManagement/subcategory");
const Department = require("../DepartmentManagement/depertment"); 
// const JobSEO = require("../SEOmanagement/JobSeo");

class Job extends Model {}
Job.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    jobUrl:{
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    date:{
      type: DataTypes.DATE,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "categories",
        key: "id",
      },
    },

    jobSeo_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "jobseos",
        key: "id",
      },
    },

    state_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "states",
        key: "id",
      },
    },
    subcategory_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "subcategorys", 
        key: "id",
      },
    },
    department_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "depertments", 
        key: "id",
      },
    },
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    admit_card_released: {
      type: DataTypes.ENUM("yes", "no"), 
      allowNull: false, 
      defaultValue: "no", 
    },
    answer_key_released: {
      type: DataTypes.ENUM("yes", "no"), 
      allowNull: false, 
      defaultValue: "no", 
    },
    result_released: {
      type: DataTypes.ENUM("yes", "no"), 
      allowNull: false, 
      defaultValue: "no", 
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      //   unique: true,
    },
    meta_title: DataTypes.STRING(255),
    meta_description: DataTypes.TEXT,
    canonical_url: DataTypes.STRING(255),
    og_image: DataTypes.STRING(255),
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
    tableName: "jobs",
    modelName: "job", 
    timestamps: true, 
    paranoid: true,
    createdAt: "created_at", 
    updatedAt: "updated_at", 
  }
);

// Define associations
Job.belongsTo(Category, { foreignKey: "category_id", onDelete: "SET NULL" });
Job.belongsTo(State, { foreignKey: "state_id", onDelete: "SET NULL" });
Job.belongsTo(Subcategory, {
  foreignKey: "subcategory_id",
  onDelete: "SET NULL",
});
Job.belongsTo(Department, {
  foreignKey: "department_id",
  onDelete: "SET NULL",
});

// Job.belongsTo(JobSEO, {
//   foreignKey: "jobSeo_id",
//   onDelete: "SET NULL",
// });
module.exports = Job;

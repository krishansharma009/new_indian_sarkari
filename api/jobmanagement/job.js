const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/datasource-db");
const Category = require("../../api/CategoryManagenet/categoryModel");
const State = require("../../api/StateManagement/state");
const Subcategory = require("../../api/SubcategoryManagement/subcategory");
const Department = require("../DepartmentManagement/depertment"); // corrected spelling
// const JobSEO = require("../SEOmanagement/JobSeo");
const JobCategory = require("../CategoryManagenet/jobCategoryModel");

class Job extends Model {}
Job.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
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
      allowNull: true,
      references: {
        model: "jobseos",
        key: "id",
      },
    },

    state_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "states",
        key: "id",
      },
    },
    subcategory_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "subcategorys", // corrected spelling
        key: "id",
      },
    },
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "depertments", // corrected spelling
        key: "id",
      },
    },
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    admit_card_link: DataTypes.STRING(255),
    answer_key_link: DataTypes.STRING(255),
    result_link: DataTypes.STRING(255),
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
    sequelize, // specifying the Sequelize instance
    tableName: "jobs",
    modelName: "job", // corrected from moduleName to modelName
    timestamps: true, // enabled timestamps
    paranoid: true,
    createdAt: "created_at", // specifying custom createdAt field
    updatedAt: "updated_at", // specifying custom updatedAt field
  }
);

// Define associations
// Job.belongsTo(Category, { foreignKey: "category_id", onDelete: "SET NULL" });
Job.belongsTo(State, { foreignKey: "state_id", onDelete: "SET NULL" });
Job.belongsTo(Subcategory, {
  foreignKey: "subcategory_id",
  onDelete: "SET NULL",
});
Job.belongsTo(Department, {
  foreignKey: "department_id",
  onDelete: "SET NULL",
});

// Many-to-Many relationship with Category
Job.belongsToMany(Category, {
  through: JobCategory,
  foreignKey: 'job_id',
  otherKey: 'category_id',
  as: 'categories'
});

// Reverse association
Category.belongsToMany(Job, {
  through: JobCategory,
  foreignKey: 'category_id',
  otherKey: 'job_id',
  as: 'jobs'
});

// Job.belongsTo(JobSEO, {
//   foreignKey: "jobSeo_id",
//   onDelete: "SET NULL",
// });
module.exports = Job;

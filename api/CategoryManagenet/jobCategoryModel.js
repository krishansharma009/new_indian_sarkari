const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/datasource-db");
const Category = require("./categoryModel");
const Job = require("../../api/jobmanagement/job");

// Create a new junction model for Job-Category relationship
class JobCategory extends Model {}
JobCategory.init(
  {
    job_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'jobs',
        key: 'id'
      }
    },
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'JobCategory',
    tableName: 'job_categories',
    timestamps: false
  }
);

// // Update associations in Job model
// Job.belongsToMany(Category, {
//   through: JobCategory,
//   foreignKey: 'job_id',
//   otherKey: 'category_id',
//   as: 'categories'
// });

// // Update associations in Category model
// Category.belongsToMany(Job, {
//   through: JobCategory,
//   foreignKey: 'category_id',
//   otherKey: 'job_id',
//   as: 'jobs'
// });

module.exports = JobCategory;
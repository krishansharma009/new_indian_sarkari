const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/datasource-db");
const Job = require("../jobmanagement/job");
const Category = require("../../api/CategoryManagenet/categoryModel");
const State = require("../../api/StateManagement/state");
const Subcategory = require("../../api/SubcategoryManagement/subcategory");
const Department = require("../DepartmentManagement/depertment"); // corrected spelling
const JobSEO = require("../SEOmanagement/JobSeo");


class JobUpdate extends Model {}

JobUpdate.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    job_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "jobs",
        key: "id",
      },
    },
    update_type: {
      type: DataTypes.ENUM("admit_card", "answer_key", "result", "other"),
      allowNull: false,
    },
    update_link: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    
    update_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "job_updates",
    modelName: "JobUpdate",
    timestamps: false,
    paranoid: true,
  }
);

// Add the cascade delete behavior
// Add the cascade delete behavior
Job.hasMany(JobUpdate, { foreignKey: "job_id", onDelete: "CASCADE" });

JobUpdate.belongsTo(Category, { foreignKey: "category_id", onDelete: "SET NULL" });
JobUpdate.belongsTo(State, { foreignKey: "state_id", onDelete: "SET NULL" });
JobUpdate.belongsTo(Subcategory, { foreignKey: "subcategory_id", onDelete: "SET NULL" });
JobUpdate.belongsTo(Department, { foreignKey: "department_id", onDelete: "SET NULL" });
JobUpdate.belongsTo(JobSEO, { foreignKey: "jobSeo_id", onDelete: "SET NULL" });

JobUpdate.belongsTo(Job, { foreignKey: "job_id" });

module.exports = JobUpdate;

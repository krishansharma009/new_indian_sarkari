const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/datasource-db");
const Job = require("../jobmanagement/job");
const Category = require("../../api/CategoryManagenet/categoryModel");
const State = require("../../api/StateManagement/state");
const Subcategory = require("../../api/SubcategoryManagement/subcategory");
const Department = require("../DepartmentManagement/depertment"); // corrected spelling
// const JobSEO = require("../SEOmanagement/JobSeo");


class JobUpdate extends Model {}

JobUpdate.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    date:{
      type: DataTypes.DATE,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: true,
      //   unique: true,
    },
    meta_title: {
    type: DataTypes.STRING(255),
    allowNull: true, 
  },
  meta_description: {
    type: DataTypes.TEXT,
    allowNull: true, 
  },
  canonical_url: {
    type: DataTypes.STRING(255),
    allowNull: true, 
  },
    job_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "jobs",
        key: "id",
      },
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
        model: "subcategorys", // corrected spelling
        key: "id",
      },
    },
    department_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "depertments", // corrected spelling
        key: "id",
      },
    },
    update_type: {
      type: DataTypes.ENUM("admit_card", "answer_key", "result", "other"),
      allowNull: false,
    },
    admitCardUrl:{
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    answerKeyUrl:{
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    resultUrl:{
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    otherUrl:{
      type: DataTypes.STRING(255),
      allowNull: true,
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
Job.hasMany(JobUpdate, { foreignKey: "job_id", onDelete: "CASCADE" , onUpdate: "cASCADE"});

JobUpdate.belongsTo(Category, { foreignKey: "category_id", onDelete: "SET NULL" });
JobUpdate.belongsTo(State, { foreignKey: "state_id", onDelete: "SET NULL" });
JobUpdate.belongsTo(Subcategory, { foreignKey: "subcategory_id", onDelete: "SET NULL" });
JobUpdate.belongsTo(Department, { foreignKey: "department_id", onDelete: "SET NULL" });
// JobUpdate.belongsTo(JobSEO, { foreignKey: "jobSeo_id", onDelete: "SET NULL" });

JobUpdate.belongsTo(Job, { foreignKey: "job_id", onDelete: "CASCADE",onUpdate: "CASCADE" });

module.exports = JobUpdate;

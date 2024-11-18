const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/datasource-db");
const Job = require("../jobmanagement/job");

class JobSEO extends Model {}

JobSEO.init(
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

    // jobSeo_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: "jobseos",
    //     key: "id",
    //   },
    // },

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
    tableName: "jobseos",
    moduleName: "jobseo",
    timestamps: false,
    paranoid: true,
  }
);

// JobSEO.belongsTo(Job, { foreignKey: "job_id" });
//ramdev

module.exports = JobSEO;

const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/datasource-db");
const Admission = require("../goverment_admissilns/admission");
const Category = require("../../api/CategoryManagenet/categoryModel");
const State = require("../../api/StateManagement/state");
const Subcategory = require("../../api/SubcategoryManagement/subcategory");
const Department = require("../DepartmentManagement/depertment"); // corrected spelling
// const JobSEO = require("../SEOmanagement/JobSeo");

class AdmissionUpdate extends Model {}

AdmissionUpdate.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    admission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "admissions",
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
      type: DataTypes.ENUM("schools", "universities", "college", "other"),
      allowNull: false,
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
    tableName: "admissionus",
    modelName: "admissionup",
    timestamps: false,
    paranoid: true,
  }
);

// Add the cascade delete behavior
// Add the cascade delete behavior
Admission.hasMany(AdmissionUpdate, {
  foreignKey: "admission_id",
  onDelete: "CASCADE",
});

AdmissionUpdate.belongsTo(Category, {
  foreignKey: "category_id",
  onDelete: "SET NULL",
});
AdmissionUpdate.belongsTo(State, {
  foreignKey: "state_id",
  onDelete: "SET NULL",
});
AdmissionUpdate.belongsTo(Subcategory, {
  foreignKey: "subcategory_id",
  onDelete: "SET NULL",
});
AdmissionUpdate.belongsTo(Department, {
  foreignKey: "department_id",
  onDelete: "SET NULL",
});
// AdmissionUpdate.belongsTo(JobSEO, {
//   foreignKey: "jobSeo_id",
//   onDelete: "SET NULL",
// });

AdmissionUpdate.belongsTo(Admission, { foreignKey: "admission_id" });

module.exports = AdmissionUpdate;

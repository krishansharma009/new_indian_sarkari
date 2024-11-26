
const { Model } = require("sequelize");
const {DataTypes}=require('sequelize');
const sequelize = require("../../config/datasource-db");
const Category = require("../../api/CategoryManagenet/categoryModel");

class FileUpload extends Model {
  // Class method to define associations
//   static associate(models) {
//     // Example of potential associations
//     // this.belongsTo(models.User, { foreignKey: 'userId' });
//   }

  // Custom class methods
  static async findByUploadType(uploadType) {
    return this.findAll({
      where: { uploadType },
      order: [["createdAt", "DESC"]],
    });
  }

  // Instance methods
  async markAsPaid() {
    this.accessType = "Paid";
    return this.save();
  }

  // Validation method
  validateFileUpload() {
    const errors = [];

    if (!this.title || this.title.trim() === "") {
      errors.push("Title is required");
    }

    if (
      ![
        "VideoClasses",
        "BooksManagement",
        "NotesManagement",
        "OldPapersManagement",
      ].includes(this.uploadType)
    ) {
      errors.push("Invalid upload type");
    }

    if (!["Course", "Standalone"].includes(this.courseType)) {
      errors.push("Invalid course type");
    }

    if (!["Free", "Paid"].includes(this.accessType)) {
      errors.push("Invalid access type");
    }

    return errors;
  }
}

FileUpload.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Title cannot be empty",
        },
        len: {
          args: [3, 255],
          msg: "Title must be between 3 and 255 characters",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 1000],
          msg: "Description cannot exceed 1000 characters",
        },
      },
    },
    fileUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: {
          msg: "Must be a valid URL",
        },
      },
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "categories",
        key: "id",
      },
      onDelete: "SET NULL", // Set category_id to NULL on category deletion
      onUpdate: "CASCADE",
    },

    uploadType: {
      type: DataTypes.ENUM(
        "VideoClasses",
        "BooksManagement",
        "NotesManagement",
        "OldPapersManagement"
      ),
      allowNull: false,
    },
    courseType: {
      type: DataTypes.ENUM("Course", "Standalone"),
      allowNull: false,
    },
    accessType: {
      type: DataTypes.ENUM("Free", "Paid"),
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    seoTools: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Add metadata fields
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    downloadCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "FileUpload",
    tableName: "file_uploads",
    paranoid: true,

    // Hooks for additional processing
    hooks: {
      beforeValidate: (file, options) => {
        // Trim string fields
        if (file.title) file.title = file.title.trim();
        if (file.description) file.description = file.description.trim();
      },

      beforeCreate: (file, options) => {
        // Additional create-time processing
        file.views = 0;
        file.downloadCount = 0;
      },

      afterCreate: (file, options) => {
        // Logging or additional processing after create
        console.log(`File upload created: ${file.title}`);
      },
    },

    // Scopes for common queries
    scopes: {
      free: {
        where: {
          accessType: "Free",
        },
      },
      paid: {
        where: {
          accessType: "Paid",
        },
      },
      videoClasses: {
        where: {
          uploadType: "VideoClasses",
        },
      },
    },
  }
);

// Additional static method for complex queries
FileUpload.searchFiles = async function (options = {}) {
  const { uploadType, courseType, accessType, minViews, search } = options;

  const whereClause = {};

  if (uploadType) whereClause.uploadType = uploadType;
  if (courseType) whereClause.courseType = courseType;
  if (accessType) whereClause.accessType = accessType;

  if (minViews) {
    whereClause.views = {
      [Op.gte]: minViews,
    };
  }

  if (search) {
    whereClause[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
    ];
  }

  return this.findAll({
    where: whereClause,
    order: [["createdAt", "DESC"]],
  });
};
FileUpload.belongsTo(Category, {
  foreignKey: "category_id",
  onDelete: "SET NULL",
});
module.exports = FileUpload;
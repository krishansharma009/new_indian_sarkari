// models/Test.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/datasource-db");

class Test extends Model {
  // Class methods
  static associate(models) {
    // Define associations
    this.belongsTo(models.TestSeries, {
      foreignKey: "test_series_id",
      as: "testSeries",
    });

    this.belongsTo(models.ExamType, {
      foreignKey: "exam_type_id",
      as: "examType",
    });

    this.belongsTo(models.User, {
      foreignKey: "created_by",
      as: "creator",
    });

    this.belongsTo(models.User, {
      foreignKey: "reviewed_by",
      as: "reviewer",
    });

    // Add any additional relationships here
    this.hasMany(models.TestAttempt, {
      foreignKey: "test_id",
      as: "attempts",
    });
  }

  // Instance methods
  isTestOpen() {
    const now = new Date();
    return (
      (!this.start_time || now >= this.start_time) &&
      (!this.end_time || now <= this.end_time)
    );
  }

  canRegister() {
    const now = new Date();
    return !this.registration_end_time || now <= this.registration_end_time;
  }

  getTimeLeft() {
    if (!this.end_time) return null;
    const now = new Date();
    const timeLeft = this.end_time - now;
    return timeLeft > 0 ? timeLeft : 0;
  }

  getDuration() {
    return `${this.duration_minutes} minutes`;
  }

  getPassingScore() {
    if (this.passing_percentage) {
      return (this.total_marks * this.passing_percentage) / 100;
    }
    return this.passing_marks;
  }
}

Test.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    test_series_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "test_series",
        key: "id",
      },
    },
    exam_type_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "exam_types",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Test name cannot be empty",
        },
        len: {
          args: [2, 255],
          msg: "Name must be between 2 and 255 characters",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 5000],
          msg: "Description must not exceed 5000 characters",
        },
      },
    },
    short_description: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: "Short description must not exceed 500 characters",
        },
      },
    },
    duration_minutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Duration is required",
        },
        isInt: {
          msg: "Duration must be an integer",
        },
        min: {
          args: [1],
          msg: "Duration must be at least 1 minute",
        },
      },
    },
    total_questions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Total questions is required",
        },
        isInt: {
          msg: "Total questions must be an integer",
        },
        min: {
          args: [1],
          msg: "Total questions must be at least 1",
        },
      },
    },
    total_marks: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Total marks is required",
        },
        isInt: {
          msg: "Total marks must be an integer",
        },
        min: {
          args: [1],
          msg: "Total marks must be at least 1",
        },
      },
    },
    passing_marks: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: {
          msg: "Passing marks must be an integer",
        },
        min: {
          args: [0],
          msg: "Passing marks cannot be negative",
        },
        isLessThanTotal(value) {
          if (value > this.total_marks) {
            throw new Error("Passing marks cannot be greater than total marks");
          }
        },
      },
    },
    test_type: {
      type: DataTypes.ENUM(
        "mock",
        "topic",
        "live",
        "full_length",
        "short",
        "previous_year",
        "sectional"
      ),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Test type is required",
        },
        isIn: {
          args: [
            [
              "mock",
              "topic",
              "live",
              "full_length",
              "short",
              "previous_year",
              "sectional",
            ],
          ],
          msg: "Invalid test type",
        },
      },
    },
    difficulty_level: {
      type: DataTypes.ENUM("beginner", "intermediate", "advanced"),
      allowNull: true,
      validate: {
        isIn: {
          args: [["beginner", "intermediate", "advanced"]],
          msg: "Invalid difficulty level",
        },
      },
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: "Invalid start time",
        },
        isAfterNow(value) {
          if (value && value < new Date()) {
            throw new Error("Start time cannot be in the past");
          }
        },
      },
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: "Invalid end time",
        },
        isAfterStartTime(value) {
          if (value && this.start_time && value <= this.start_time) {
            throw new Error("End time must be after start time");
          }
        },
      },
    },
    registration_end_time: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: "Invalid registration end time",
        },
        isBeforeStartTime(value) {
          if (value && this.start_time && value > this.start_time) {
            throw new Error("Registration end time must be before start time");
          }
        },
      },
    },
    is_proctored: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    proctoring_rules: {
      type: DataTypes.JSON,
      allowNull: true,
      validate: {
        isValidJSON(value) {
          if (value) {
            try {
              JSON.parse(JSON.stringify(value));
            } catch (e) {
              throw new Error("Invalid proctoring rules format");
            }
          }
        },
      },
    },
    negative_marking: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      validate: {
        isDecimal: {
          msg: "Negative marking must be a decimal number",
        },
        min: {
          args: [0],
          msg: "Negative marking cannot be negative",
        },
        max: {
          args: [1],
          msg: "Negative marking cannot be more than 1",
        },
      },
    },
    calculator_allowed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    question_shuffle_allowed: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    show_result_immediately: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    passing_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        isDecimal: {
          msg: "Passing percentage must be a decimal number",
        },
        min: {
          args: [0],
          msg: "Passing percentage cannot be negative",
        },
        max: {
          args: [100],
          msg: "Passing percentage cannot be more than 100",
        },
      },
    },
    maximum_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        isInt: {
          msg: "Maximum attempts must be an integer",
        },
        min: {
          args: [1],
          msg: "Maximum attempts must be at least 1",
        },
      },
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    display_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("draft", "published", "archived"),
      defaultValue: "draft",
      validate: {
        isIn: {
          args: [["draft", "published", "archived"]],
          msg: "Invalid status",
        },
      },
    },
    created_by: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    reviewed_by: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Test",
    tableName: "tests",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    indexes: [
      {
        name: "idx_test_series",
        fields: ["test_series_id"],
      },
      {
        name: "idx_exam_type",
        fields: ["exam_type_id"],
      },
      {
        name: "idx_status",
        fields: ["status"],
      },
      {
        name: "idx_featured",
        fields: ["is_featured"],
      },
      {
        name: "idx_active",
        fields: ["is_active"],
      },
    ],
    hooks: {
      beforeValidate: async (test, options) => {
        // Validate time constraints
        if (test.start_time && test.end_time) {
          if (test.end_time <= test.start_time) {
            throw new Error("End time must be after start time");
          }
        }
      },
      beforeUpdate: async (test, options) => {
        // Set published_at when status changes to published
        if (test.changed("status") && test.status === "published") {
          test.published_at = new Date();
        }
      },
    },
  }
);

module.exports = Test;

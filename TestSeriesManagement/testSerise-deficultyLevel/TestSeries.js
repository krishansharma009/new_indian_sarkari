// models/TestSeries.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/datasource-db");

class TestSeries extends Model {
  // Class methods
  static associate(models) {
    // Define associations here
    this.belongsTo(models.Category, {
      foreignKey: "category_id",
      as: "category",
    });

    // this.belongsTo(models.User, {
    //   foreignKey: "instructor_id",
    //   as: "instructor",
    // });
  }

  // Instance methods
  async updateEnrollmentCount() {
    this.total_enrolled += 1;
    return this.save();
  }

  async updateRating(newRating) {
    const oldTotalScore = this.rating * this.total_ratings;
    this.total_ratings += 1;
    this.rating = (oldTotalScore + newRating) / this.total_ratings;
    return this.save();
  }

  // Get formatted price with currency
  getFormattedPrice() {
    return this.is_free ? "Free" : `₹${this.price}`;
  }

  // Calculate discount percentage
  getDiscountPercentage() {
    if (!this.discounted_price || !this.price) return 0;
    return Math.round(
      ((this.price - this.discounted_price) / this.price) * 100
    );
  }

  // Get actual price (considering discounted price if available)
  getActualPrice() {
    return this.discounted_price || this.price;
  }

  // Check if test series is on sale
  isOnSale() {
    return Boolean(this.discounted_price && this.discounted_price < this.price);
  }
}

TestSeries.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    category_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "test_series_categories",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name cannot be empty",
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
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        isDecimal: {
          msg: "Price must be a decimal number",
        },
        min: {
          args: [0],
          msg: "Price cannot be negative",
        },
      },
      get() {
        const value = this.getDataValue("price");
        return value ? parseFloat(value) : null;
      },
    },
    discounted_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        isDecimal: {
          msg: "Discounted price must be a decimal number",
        },
        min: {
          args: [0],
          msg: "Discounted price cannot be negative",
        },
        isLessThanPrice(value) {
          if (value && parseFloat(value) >= parseFloat(this.price)) {
            throw new Error("Discounted price must be less than regular price");
          }
        },
      },
      get() {
        const value = this.getDataValue("discounted_price");
        return value ? parseFloat(value) : null;
      },
    },
    is_free: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    total_tests: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: {
          msg: "Total tests must be an integer",
        },
        min: {
          args: [0],
          msg: "Total tests cannot be negative",
        },
      },
    },
    validity_days: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: {
          msg: "Validity days must be an integer",
        },
        min: {
          args: [1],
          msg: "Validity days must be at least 1",
        },
      },
    },
    features: {
      type: DataTypes.JSON,
      allowNull: true,
      validate: {
        isValidJSON(value) {
          try {
            if (value) JSON.parse(JSON.stringify(value));
          } catch (e) {
            throw new Error("Features must be valid JSON");
          }
        },
      },
      get() {
        const value = this.getDataValue("features");
        return value ? JSON.parse(JSON.stringify(value)) : [];
      },
    },
    what_you_learn: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    requirements: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    instructor_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    //   references: {
    //     model: "users",
    //     key: "id",
    //   },
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      defaultValue: 0,
      validate: {
        isDecimal: {
          msg: "Rating must be a decimal number",
        },
        min: {
          args: [0],
          msg: "Rating cannot be less than 0",
        },
        max: {
          args: [5],
          msg: "Rating cannot be more than 5",
        },
      },
      get() {
        const value = this.getDataValue("rating");
        return value ? parseFloat(value) : 0;
      },
    },
    total_ratings: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        isInt: {
          msg: "Total ratings must be an integer",
        },
        min: {
          args: [0],
          msg: "Total ratings cannot be negative",
        },
      },
    },
    total_enrolled: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        isInt: {
          msg: "Total enrolled must be an integer",
        },
        min: {
          args: [0],
          msg: "Total enrolled cannot be negative",
        },
      },
    },
    banner_image: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: {
          msg: "Banner image must be a valid URL",
        },
      },
    },
    preview_video_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: {
          msg: "Preview video URL must be a valid URL",
        },
      },
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    meta_title: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        len: {
          args: [0, 255],
          msg: "Meta title must not exceed 255 characters",
        },
      },
    },
    meta_description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 1000],
          msg: "Meta description must not exceed 1000 characters",
        },
      },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "TestSeries",
    tableName: "test_series",
    timestamps: true,
    paranoid: true, // Enables soft delete
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    indexes: [
      {
        name: "idx_category",
        fields: ["category_id"],
      },
      {
        name: "idx_instructor",
        fields: ["instructor_id"],
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
      beforeValidate: (testSeries, options) => {
        // If is_free is true, set price and discounted_price to 0
        if (testSeries.is_free) {
          testSeries.price = 0;
          testSeries.discounted_price = 0;
        }
      },
      beforeCreate: (testSeries, options) => {
        // Set default meta title if not provided
        if (!testSeries.meta_title) {
          testSeries.meta_title = testSeries.name;
        }
      },
    },
  }
);

module.exports = TestSeries;

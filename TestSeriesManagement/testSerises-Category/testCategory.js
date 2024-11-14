const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/datasource-db");

class TestSeriesCategory extends Model {}

TestSeriesCategory.init( 
{
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  parent_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'test_series_categories',  // Make sure this matches your table name exactly
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  icon_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  banner_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  meta_title: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  meta_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  display_order: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'test_series_categories',  // Make sure this is your exact table name
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  deletedAt: 'deleted_at',
  paranoid: true,
  // Add hooks for maintaining referential integrity
  hooks: {
    beforeCreate: async (category) => {
      if (category.parent_id) {
        const parent = await TestSeriesCategory.findByPk(category.parent_id);
        if (!parent) {
          throw new Error('Parent category does not exist');
        }
      }
    },
    beforeUpdate: async (category) => {
      if (category.parent_id) {
        const parent = await TestSeriesCategory.findByPk(category.parent_id);
        if (!parent) {
          throw new Error('Parent category does not exist');
        }
      }
    }
  }
});

// Self-referential association
TestSeriesCategory.belongsTo(TestSeriesCategory, {
  as: 'parent',
  foreignKey: 'parent_id'
});

TestSeriesCategory.hasMany(TestSeriesCategory, {
  as: 'children',
  foreignKey: 'parent_id'
});

module.exports = TestSeriesCategory;
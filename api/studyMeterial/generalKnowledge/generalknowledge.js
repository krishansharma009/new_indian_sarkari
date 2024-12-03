const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../../config/datasource-db");

class GeneralKnowledge extends Model {}

GeneralKnowledge.init(
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      //   validate: {
      //     notEmpty: { msg: "Title cannot be empty" },
      //   },
    },
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: true,
      //   unique: true,
      //   validate: {
      //     notEmpty: { msg: "Slug cannot be empty" },
      //   },
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
      //   validate: {
      //     isUrl: { msg: "Must be a valid URL" },
      //   },
    },
    og_image: {
      type: DataTypes.STRING(255),
      allowNull: true,
      //   validate: {
      //     isUrl: { msg: "Must be a valid image URL" },
      //   },
    },
    is_paid: {
      type: DataTypes.ENUM("free", "paid"),
      allowNull: false,
      defaultValue: "free",
    //   validate: {
    //     isIn: [["free", "paid"]],
    //   },
    },
  },
  {
    sequelize,
    tableName: "general_knowledges",
    modelName: "general_knowledge",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    indexes: [{ unique: true, fields: ["slug"] }, { fields: ["is_paid"] }],
  }
);

module.exports = GeneralKnowledge;

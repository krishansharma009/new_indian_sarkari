// Modified categoryController.js
const Category = require("./categoryModel");
const REST_API = require("../../utils/curdHelper");
const fs = require("fs").promises;
const path = require("path");

const categoryController = {
  getAllCategories: async (req, res) => {
    try {

      const condition = {
        page:req.query.page,
        limit:req.query.limit,
        search:req.query.search,
      }

      const categories = await REST_API.getAll(Category, condition);
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getCategoryById: async (req, res) => {
    try {
      const response = await REST_API.getDataListByField(
        Category,
        "id",
        req.params.id
      );
      if (response[0]) {
        response[0].categoryImg = response[0].categoryImg
          ? `${response[0].categoryImg}`
          : null;
      }
      res.json(response[0]);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  createCategory: async (req, res) => {
    try {
      const categoryData = {
        ...req.body,
        categoryImg: req.file ? req.file.path.replace(/\\/g, "/") : null,
      };

      const response = await REST_API.create(Category, categoryData);
      console.log(response);
      res.status(201).json(response);
    } catch (error) {
      // Delete uploaded file if database operation fails
      if (req.file) {
        await fs.unlink(req.file.path);
      }
      res.status(400).json({ error: error.message });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      // If there's a new file, delete the old one
      if (req.file && category.categoryImg) {
        try {
          await fs.unlink(category.categoryImg);
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }

      const updateData = {
        ...req.body,
        ...(req.file && { categoryImg: req.file.path.replace(/\\/g, "/") }),
      };

      await REST_API.update(Category, req.params.id, updateData);

      const updatedCategory = await Category.findByPk(req.params.id);
      res.json({
        ...updatedCategory.toJSON(),
        categoryImg: updatedCategory.categoryImg
          ? `${req.protocol}://${req.get("host")}/${
              updatedCategory.categoryImg
            }`
          : null,
      });
    } catch (error) {
      // Delete uploaded file if database operation fails
      if (req.file) {
        await fs.unlink(req.file.path);
      }
      res.status(500).json({ error: error.message });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      // Delete the associated image file if it exists
      if (category.categoryImg) {
        try {
          await fs.unlink(category.categoryImg);
        } catch (error) {
          console.error("Error deleting image:", error);
        }
      }

      await REST_API.delete(Category, req.params.id);
      res.status(200).send("deleted successfully");
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = categoryController;

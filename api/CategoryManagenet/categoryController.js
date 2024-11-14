const Category = require("./categoryModel");
const REST_API = require("../../utils/curdHelper");

const categoryController = {
  getAllCategories: async (req, res) => {
    try {
      const response = await REST_API.getAll(Category);
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },//to the node moon

  getCategoryById: async (req, res) => {
    try {
      const response = await REST_API.getDataListByField(
        Category,
        "id",
        req.params.id
      );
      res.json(response[0]);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  createCategory: async (req, res) => {
    try {
      const response = await REST_API.create(Category, req.body);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  //   updateCategory: async (req, res) => {
  //     try {
  //       const response = await REST_API.update(Category, req.params.id, req.body);
  //       res.status(201).json(response);
  //     } catch (error) {
  //       res.status(404).json({ error: error.message });
  //     }
  //   },

  updateCategory: async (req, res) => {
    try {
      await REST_API.update(Category, req.params.id, req.body);
      const updatedCategory = await Category.findByPk(req.params.id);
      if (updatedCategory) {
        res.json(updatedCategory);
      } else {
        res.status(404).json({ error: "Category not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const response = await REST_API.delete(Category, req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = categoryController;

const testCategory = require("./testCategory");
const REST_API = require("../../utils/curdHelper");
const TestSeriesCategory = require("./testCategory");

const testCategoryController = {
  // Get all categories with pagination, search, filter and sort
  getAllTestCategories: async (req, res) => {
    try {
      const query = {
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
        filter: {
          ...(req.query.is_active && {
            is_active: req.query.is_active === "true",
          }),
          ...(req.query.is_featured && {
            is_featured: req.query.is_featured === "true",
          }),
          ...(req.query.parent_id && { parent_id: req.query.parent_id }),
        },
        sort: req.query.sort, // format: "field:direction" e.g. "display_order:desc"
      };

      const result = await REST_API.getAll(TestSeriesCategory, query);
      res.json(result);
    } catch (error) {
      logger.error(`Error in getAllCategories: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  },

  // Get categories by parent ID
  getTestCategoriesByParentId: async (req, res) => {
    try {
      const parentId = req.params.parentId;
      const categories = await REST_API.getDataListByField(
        TestSeriesCategory,
        "parent_id",
        parentId
      );
      res.json(categories);
    } catch (error) {
      logger.error(`Error in getCategoriesByParentId: ${error.message}`);
      res.status(404).json({ error: error.message });
    }
  },

  getTestCategoriesById: async (req, res) => {
    try {
      const id = req.params.id;
      const categories = await REST_API.getDataListByField(
        TestSeriesCategory,
        "id",
        id
      );
      res.json(categories);
    } catch (error) {
      logger.error(`Error in getCategoriesByParentId: ${error.message}`);
      res.status(404).json({ error: error.message });
    }
  },

  // Create new category
  createTestCategory: async (req, res) => {
    try {
      const newCategory = await REST_API.create(TestSeriesCategory, req.body);
      res.status(201).json(newCategory);
    } catch (error) {
      logger.error(`Error in createCategory: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  },

  // Update category
  updateTestCategory: async (req, res) => {
    try {
      const updatedCategory = await REST_API.update(
        TestSeriesCategory,
        req.params.id,
        req.body
      );
      res.json(updatedCategory);
    } catch (error) {
      logger.error(`Error in updateCategory: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  },

  // Hard delete category
  deleteCategory: async (req, res) => {
    try {
      const result = await REST_API.delete(TestSeriesCategory, req.params.id);
      res.json(result);
    } catch (error) {
      logger.error(`Error in deleteCategory: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  },

  // Delete category
  deleteTestCategory: async (req, res) => {
    try {
      await REST_API.delete(TestSeriesCategory, req.params.id);
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      logger.error(`Error in deleteCategory: ${error.message}`);
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = testCategoryController;

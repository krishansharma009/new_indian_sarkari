const Subcategory = require('./subcategory');
const REST_API = require('../../utils/curdHelper');

const SubcategoryController = {
  getAllSubcategories: async (req, res) => {
    try {
      const response = await REST_API.getAll(Subcategory);
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getSubCategoryById: async (req, res) => {
    try {
      const response = await REST_API.getDataListByField(
        Subcategory,
        "id",
        req.params.id
      );
      res.json(response[0]);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  createSubCategory: async (req, res) => {
    try {
      const response = await REST_API.create(Subcategory, req.body);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateSubCategory: async (req, res) => {
    try {
      await REST_API.update(Subcategory, req.params.id, req.body);
      const updateSubCategory = await Subcategory.findByPk(req.params.id);
      if (updateSubCategory) {
        res.json(updateSubCategory);
      } else {
        res.status(404).json({ error: "Category not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteSubCategory: async (req,res) => {
    try{
        const response = await REST_API.delete(Subcategory, req.params.id);
        res.status(204).send();
    }catch(error){
        res.status(400).json({ error: error.message });
    }
  },
};

module.exports = SubcategoryController;

const REST_API = require("../../utils/curdHelper");
const JobSEO = require("./JobSeo");

const JobSEOController = {
  getAllJobSEOs: async (req, res) => {
    try {
      const result = await REST_API.getAll(JobSEO, req.query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getJobSEOById: async (req, res) => {
    try {
      const result = await REST_API.getDataListByField(
        JobSEO,
        "id",
        req.params.id
      );
      res.json(result[0]);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  createJobSEO: async (req, res) => {
    try {
      const result = await REST_API.create(JobSEO, req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateJobSEO: async (req, res) => {
    try {
      await REST_API.update(Category, req.params.id, req.body);
      const updatedSeo = await Category.findByPk(req.params.id);
      if (updatedSeo) {
        res.json(updatedSeo);
      } else {
        res.status(404).json({ error: "Category not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteJobSEO: async (req, res) => {
    try {
      await REST_API.delete(JobSEO, req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = JobSEOController;

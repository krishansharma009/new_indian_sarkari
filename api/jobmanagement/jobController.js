const REST_API = require("../../utils/curdHelper");
const Job = require("./job");
const Category = require("../CategoryManagenet/categoryModel");
const Depertment = require("../DepartmentManagement/depertment");
// const JobSEO = require("../SEOmanagement/JobSeo");
const State = require("../StateManagement/state");
const Subcategory = require("../SubcategoryManagement/subcategory");

const generateUniqueSlug = require("../../utils/slugyfy");

const JobController = {
  getAllJobs: async (req, res) => {
    try {
      const result = await REST_API.getAll(Job, req.query, {
        include: [
          { model: Category },
          { model: Depertment },
          // { model: JobSEO  },
          { model: State },
          { model: Subcategory },
        ],
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getJobById: async (req, res) => {
    try {
      const result = await REST_API.getDataListByField(
        Job,
        "id",
        req.params.id,
        {
          include: [
            { model: Category },
            { model: Depertment },
            // { model: JobSEO  },
            { model: State },
            { model: Subcategory },
          ],
        }
      );
      res.json(result[0]);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  getJobsByCategory: async (req, res) => {
    try {
      const categoryId = req.params.categoryId;
      const result = await Job.findAll({
        where: { category_id: categoryId },
        include: [
          { model: Category },
          { model: Depertment },
          { model: State },
          { model: Subcategory },
        ],
        order: [["created_at", "DESC"]],
      });

      if (!result.length) {
        return res
          .status(404)
          .json({ message: "No jobs found for this category" });
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getJobBySlug: async (req, res) => {
    try {
      const result = await REST_API.getDataListByField(
        Job,
        "slug",
        req.params.slug,
        {
          include: [
            { model: Category },
            { model: Depertment },
            { model: State },
            { model: Subcategory },
          ],
        }
      );

      if (!result.length) {
        return res.status(404).json({ error: "Job not found" });
      }

      res.json(result[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Modified create method to handle manual slug
  createJob: async (req, res) => {
    try {
      const categorydata = await Category.findOne({
        where: { id: req.body.category_id },
      });

      if (!categorydata) {
        return res.status(400).json({ error: "Category not found" });
      }

      // Use generateUniqueSlug for both manual and automatic slugs
      const slug = await generateUniqueSlug(
        Job,
        req.body.slug || req.body.title, // Use provided slug or fall back to title
        categorydata.name
      );

      const jobData = { ...req.body, slug };
      const result = await REST_API.create(Job, jobData);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Modified update method to handle manual slug
  updateJob: async (req, res) => {
    try {
      const existingJob = await Job.findByPk(req.params.id);
      if (!existingJob) {
        return res.status(404).json({ error: "Job not found" });
      }

      let updatedData = { ...req.body };
      const categorydata = await Category.findOne({
        where: { id: existingJob.category_id },
      });

      // Generate new slug if slug or title is provided
      if (
        req.body.slug ||
        (req.body.title && req.body.title !== existingJob.title)
      ) {
        updatedData.slug = await generateUniqueSlug(
          Job,
          req.body.slug || req.body.title,
          categorydata.name,
          existingJob.id
        );
      }

      await REST_API.update(Job, req.params.id, updatedData);
      const updatedJob = await Job.findByPk(req.params.id);
      res.json(updatedJob);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteJob: async (req, res) => {
    try {
      await REST_API.delete(Job, req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = JobController;

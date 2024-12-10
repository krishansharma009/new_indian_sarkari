const { Op } = require("sequelize");
const sequelize = require("../../config/datasource-db");
const Job = require("./job");
const Category = require("../CategoryManagenet/categoryModel");
const Depertment = require("../DepartmentManagement/depertment");
const JobSEO = require("../SEOmanagement/JobSeo");
const State = require("../StateManagement/state");
const Subcategory = require("../SubcategoryManagement/subcategory");
const JobCategory = require("../CategoryManagenet/jobCategoryModel");
const generateUniqueSlug = require("../../utils/slugyfy");

const JobController = {
  // Get All Jobs with Categories
  getAllJobs: async (req, res) => {
    try {
      const { page = 1, limit = 10, search, category_id } = req.query;
      const offset = (page - 1) * limit;

      // Build where conditions
      const whereConditions = {};
      if (search) {
        whereConditions[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ];
      }

      // Query configuration
      const queryOptions = {
        where: whereConditions,
        include: [
          {
            model: Category,
            as: "categories",
            ...(category_id
              ? {
                  where: {
                    id: category_id.split(",").map((id) => parseInt(id)),
                  },
                }
              : {}),
          },
          { model: Depertment },
          { model: State },
          { model: Subcategory },
        ],
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [["created_at", "DESC"]],
      };

      // Fetch jobs
      const { count, rows: jobs } = await Job.findAndCountAll(queryOptions);

      res.json({
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        jobs,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get Job by ID
  getJobById: async (req, res) => {
    try {
      const job = await Job.findByPk(req.params.id, {
        include: [
          { model: Category, as: "categories" },
          { model: Depertment },
          { model: State },
          { model: Subcategory },
        ],
      });

      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      res.json(job);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  // Create Job
  createJob: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const {
        title,
        description,
        category_id = [], // Ensure this is an array
        ...otherFields
      } = req.body;

      // Create job without specifying category_id
      const job = await Job.create(
        {
          title,
          description,
          slug: await generateUniqueSlug(Job, title),
          ...otherFields,
        },
        { transaction }
      );

      // Create job-category associations
      if (category_id && category_id.length > 0) {
        const jobCategories = category_id.map((categoryId) => ({
          job_id: job.id,
          category_id: categoryId,
        }));

        await JobCategory.bulkCreate(jobCategories, { transaction });
      }

      await transaction.commit();

      // Fetch the job with categories
      const fullJob = await Job.findByPk(job.id, {
        include: [
          {
            model: Category,
            as: "categories",
          },
        ],
      });

      res.status(201).json(fullJob);
    } catch (error) {
      await transaction.rollback();
      res.status(400).json({ error: error.message });
    }
  },

  // Update Job
  updateJob: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { title, description, category_id, ...otherFields } = req.body;

      // Find existing job
      const existingJob = await Job.findByPk(id);
      if (!existingJob) {
        return res.status(404).json({ error: "Job not found" });
      }

      // Generate new slug if title changed
      const slug =
        title && title !== existingJob.title
          ? await generateUniqueSlug(Job, title)
          : existingJob.slug;

      // Update job
      await existingJob.update(
        {
          title: title || existingJob.title,
          description: description || existingJob.description,
          slug,
          ...otherFields,
        },
        { transaction }
      );

      // Update categories
      if (category_id) {
        // Remove existing associations
        await JobCategory.destroy({
          where: { job_id: id },
          transaction,
        });

        // Create new associations
        if (category_id.length > 0) {
          const jobCategories = category_id.map((categoryId) => ({
            job_id: id,
            category_id: categoryId,
          }));

          await JobCategory.bulkCreate(jobCategories, { transaction });
        }
      }

      await transaction.commit();

      // Fetch updated job
      const updatedJob = await Job.findByPk(id, {
        include: [{ model: Category, as: "categories" }],
      });

      res.json(updatedJob);
    } catch (error) {
      await transaction.rollback();
      res.status(400).json({ error: error.message });
    }
  },

  // Delete Job
  deleteJob: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const job = await Job.findByPk(req.params.id);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      // Remove job-category associations
      await JobCategory.destroy({
        where: { job_id: req.params.id },
        transaction,
      });

      // Delete job
      await job.destroy({ transaction });

      await transaction.commit();
      res.status(204).send("Job deleted successfully");
    } catch (error) {
      await transaction.rollback();
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = JobController;

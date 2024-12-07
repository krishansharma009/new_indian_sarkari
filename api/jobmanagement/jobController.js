const REST_API = require("../../utils/curdHelper");
const Job = require("./job");
const Category = require("../CategoryManagenet/categoryModel");
const Depertment = require("../DepartmentManagement/depertment");
const JobSEO = require("../SEOmanagement/JobSeo");
const State = require("../StateManagement/state");
const Subcategory = require("../SubcategoryManagement/subcategory");

const generateUniqueSlug = require("../../utils/slugyfy");

const JobController = {
  getAllJobs: async (req, res) => {
    try {
      //      const result = await Job.findAll({
      //   where: req.query,
      //   include: [
      //     { model: Category, attributes: ['name'] },
      //     { model: Department, attributes: ['name'] },
      //     { model: JobSEO, attributes: ['metaTitle', 'metaDescription'] },
      //     { model: State, attributes: ['name'] },
      //     { model: Subcategory, attributes: ['name'] }
      //   ]
      // });

      const result = await REST_API.getAll(Job, req.query, {
        // include: [
        //   { model: Category, attributes: ["name"] },
        //   { model: Depertment, attributes: ["name"] },
        //   { model: JobSEO, attributes: ["metaTitle", "metaDescription"] },
        //   { model: State, attributes: ["name"] },
        //   { model: Subcategory, attributes: ["name"] },
        // ],

        include: [
          { model: Category },
          { model: Depertment },
          { model: JobSEO },
          { model: State },
          { model: Subcategory },
        ],
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // getJobById: async (req, res) => {
  //   try {
  //     const result = await REST_API.getDataListByField(
  //       Job,
  //       "id",
  //       req.params.id
  //     );
  //     res.json(result[0]);
  //   } catch (error) {
  //     res.status(404).json({ error: error.message });
  //   }
  // },

  getJobById: async (req, res) => {
    try {
      const result = await REST_API.getDataListByField(
        Job,
        "id",
        req.params.id,
        {
          // include: [
          //   { model: Category, attributes: ["name"] },
          //   { model: Depertment, attributes: ["name"] },
          //   { model: JobSEO, attributes: ["metaTitle", "metaDescription"] },
          //   { model: State, attributes: ["name"] },
          //   { model: Subcategory, attributes: ["name"] },
          // ],

          include: [
            { model: Category },
            { model: Depertment },
            { model: JobSEO },
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

  createJob: async (req, res) => {
    try {
      // Check if all required fields are present
      const {
        category_id,
        state_id,
        subcategory_id,
        department_id,
        title,
        description,
      } = req.body;

      // Check if the required fields are not empty
      if (
        !category_id ||
        !Array.isArray(category_id) ||
        category_id.length === 0
      ) {
        return res
          .status(400)
          .json({ error: "Category is required and should be an array." });
      }
      if (!state_id || !Array.isArray(state_id) || state_id.length === 0) {
        return res
          .status(400)
          .json({ error: "State is required and should be an array." });
      }
      if (
        !subcategory_id ||
        !Array.isArray(subcategory_id) ||
        subcategory_id.length === 0
      ) {
        return res
          .status(400)
          .json({ error: "Subcategory is required and should be an array." });
      }
      if (
        !department_id ||
        !Array.isArray(department_id) ||
        department_id.length === 0
      ) {
        return res
          .status(400)
          .json({ error: "Department is required and should be an array." });
      }
      if (!title || !description) {
        return res
          .status(400)
          .json({ error: "Title and description are required." });
      }

      // Fetch category data to generate slug
      const categorydata = await Category.findOne({
        where: { id: category_id[0] }, // Using the first category for slug generation
      });

      if (!categorydata) {
        return res.status(400).json({ error: "Category not found." });
      }

      console.log("Category Data:", categorydata);

      // Generate a unique slug using the title and category name
      const slug = await generateUniqueSlug(Job, title, categorydata.name);

      // Prepare job data
      const jobData = {
        ...req.body,
        slug,
      };

      // Create job
      const result = await REST_API.create(Job, jobData);

      // Send response
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // updateJob: async (req, res) => {
  //   try {
  //     const existingJob = await Job.findByPk(req.params.id);
  //     if (!existingJob) {
  //       return res.status(404).json({ error: "Job not found" });
  //     }

  //     let updatedData = { ...req.body };
  //     if (req.body.title && req.body.title !== existingJob.title) {
  //       const newSlug = await generateUniqueSlug(
  //         Job,
  //         req.body.title,
  //         existingJob.id
  //       );
  //       updatedData.slug = newSlug;
  //     }

  //     const result = await REST_API.update(Job, req.params.id, updatedData);
  //     res.json(result);
  //   } catch (error) {
  //     res.status(400).json({ error: error.message });
  //   }
  // },
  updateJob: async (req, res) => {
    try {
      const existingJob = await Job.findByPk(req.params.id);
      if (!existingJob) {
        return res.status(404).json({ error: "Job not found" });
      }

      let updatedData = { ...req.body };

      // Generate a new slug if the title has changed
      if (req.body.title && req.body.title !== existingJob.title) {
        const newSlug = await generateUniqueSlug(
          Job,
          req.body.title,
          existingJob.id
        );
        updatedData.slug = newSlug;
      }

      // Update the job post
      await REST_API.update(Job, req.params.id, updatedData);

      // Fetch the updated job post
      const updatedJob = await Job.findByPk(req.params.id);

      // Return the updated job post in the response
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






//  updateJob: async (req, res) => {
//     try {
//       await REST_API.update(Category, req.params.id, req.body);
//       const updatedjob = await Category.findByPk(req.params.id);
//       if (updatedjob) {
//         res.json(updatedjob);
//       } else {
//         res.status(404).json({ error: "Category not found" });
//       }
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   },

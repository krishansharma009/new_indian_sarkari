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
      // Destructure required fields
      const {
        category_id,
        state_id,
        subcategory_id,
        department_id,
        title,
        description,
      } = req.body;

      // Validation function to check arrays
      const validateArrayField = (field, fieldName) => {
        if (!field || !Array.isArray(field) || field.length === 0) {
          throw new Error(`${fieldName} is required and should be an array.`);
        }
        // Ensure all elements are integers
        return field.map((id) => {
          const parsedId = parseInt(id, 10);
          if (isNaN(parsedId)) {
            throw new Error(`Invalid ${fieldName} value: ${id}`);
          }
          return parsedId;
        });
      };

      // Validate and parse all array fields
      const validatedCategoryIds = validateArrayField(category_id, "Category");
      const validatedStateIds = validateArrayField(state_id, "State");
      const validatedSubcategoryIds = validateArrayField(
        subcategory_id,
        "Subcategory"
      );
      const validatedDepartmentIds = validateArrayField(
        department_id,
        "Department"
      );

      // Additional basic validations
      if (!title || !description) {
        return res
          .status(400)
          .json({ error: "Title and description are required." });
      }

      // Fetch category data to generate slug
      const categorydata = await Category.findOne({
        where: { id: validatedCategoryIds[0] }, // Using the first category for slug generation
      });

      if (!categorydata) {
        return res.status(400).json({ error: "Category not found." });
      }

      // Generate a unique slug using the title and category name
      const slug = await generateUniqueSlug(Job, title, categorydata.name);

      // Prepare job data with comma-separated integer strings
      const jobData = {
        ...req.body,
        category_id: validatedCategoryIds.join(","),
        state_id: validatedStateIds.join(","),
        subcategory_id: validatedSubcategoryIds.join(","),
        department_id: validatedDepartmentIds.join(","),
        slug,
      };

      // Create job
      const result = await REST_API.create(Job, jobData);

      // Send response
      res.status(201).json(result);
    } catch (error) {
      console.error("Job creation error:", error);
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

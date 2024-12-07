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

  // createJob: async (req, res) => {
  //   try {

  //     const categorydata = await Category.findOne({
  //       where: { id: req.body.category_id },
  //     });
  //     const data=req.body.category_id;
  //     req.body.category_id = JSON.parse(data);

  //     console.log(categorydata);

  //     const slug = await generateUniqueSlug(
  //       Job,
  //       req.body.title,
  //       categorydata.name
  //     );
  //     const jobData = { ...req.body, slug };
  //     const result = await REST_API.create(Job, jobData);
  //     res.status(201).json(result);
  //   } catch (error) {
  //     res.status(400).json({ error: error.message });
  //   }
  // },

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

createJob: async (req, res) => {
  try {
    // Ensure category_id is passed as an array
    const categoryIds = Array.isArray(req.body.category_id) ? req.body.category_id : [req.body.category_id];

    // Generate the unique slug for the job title
    const slug = await generateUniqueSlug(Job, req.body.title);

    // Prepare job data, passing categoryIds as a JSON array
    const jobData = {
      ...req.body,
      category_id: categoryIds,  // category_id should be an array (JSON format)
      slug,
    };

    // Create the job in the database
    const result = await REST_API.create(Job, jobData);
    
    // Respond with the created job
    res.status(201).json(result);
  } catch (error) {
    console.error("Job creation error:", error);
    res.status(500).json({ error: error.message });
  }
},


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

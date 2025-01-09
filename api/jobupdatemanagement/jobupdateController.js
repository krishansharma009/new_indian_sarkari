const REST_API = require("../../utils/curdHelper");
const JobUpdate = require("./job-update");
const Job = require("../jobmanagement/job");

const Category = require("../CategoryManagenet/categoryModel");
const Depertment = require("../DepartmentManagement/depertment");
// const JobSEO = require("../SEOmanagement/JobSeo");
const State = require("../StateManagement/state");
const Subcategory = require("../SubcategoryManagement/subcategory");
// const { Op } = require("sequelize");
const generateUniqueSlug = require("../../utils/slugyfy");


const JobUpdateController = {
  getAllJobUpdates: async (req, res) => {
    try {
      const result = await REST_API.getAll(JobUpdate, req.query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  //this is the fluid

  getJobUpdateById: async (req, res) => {
    try {
      const result = await REST_API.getDataListByField(
        JobUpdate,
        "id",
        req.params.id
      );
      res.json(result[0]);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  // createJobUpdate: async (req, res) => {
  //   try {
  //     const job = await Job.findOne({ where: { id: req.body.job_id } });
  //     req.body.category_id = job.category_id;
  //     // req.body.jobSeo_id = job.jobSeo_id;
  //     req.body.state_id = job.state_id;
  //     req.body.subcategory_id = job.subcategory_id;
  //     req.body.department_id = job.department_id;
  //     const result = await REST_API.create(JobUpdate, req.body);
  //     res.status(201).json(result);
  //   } catch (error) {
  //     res.status(400).json({ error: error.message });
  //   }
  // },




  createJobUpdate: async (req, res) => {
  try {
    if (req.body.job_id) {
      const job = await Job.findOne({ where: { id: req.body.job_id } }); 
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }
      req.body.category_id = job.category_id;
      req.body.state_id = job.state_id;
      req.body.subcategory_id = job.subcategory_id;
      req.body.department_id = job.department_id;
    } else {
      req.body.job_id = null; 
    }
 // Use generateUniqueSlug for both manual and automatic slugs
      const slug = await generateUniqueSlug(
        Job,
        req.body.slug || req.body.title,
        
      );
       const jobData = { ...req.body, slug };
    const result = await REST_API.create(JobUpdate, jobData);
    res.status(201).json(result);
  } catch (error) {
    // Handle any errors that occur
    console.error('Error creating record in JobUpdate:', error.message);
    res.status(400).json({ error: error.message });
  }
},




  // updateJobUpdate: async (req, res) => {
  //   try {
  //     const result = await REST_API.update(JobUpdate, req.params.id, req.body);
  //     res.json(result);
  //   } catch (error) {
  //     res.status(400).json({ error: error.message });
  //   }
  // },


 updateJobUpdate: async (req, res) => {
    try {
      const existingJobUpdate = await JobUpdate.findByPk(req.params.id);
      if (!existingJobUpdate) {
        return res.status(404).json({ error: "JobUpdate not found" });
      }

      // const category = await Category.findOne({ where: { id: existingJobUpdate.category_id } });

      let updatedData = { ...req.body };
      // Generate a new slug if slug or title is updated
      if (
        req.body.slug ||
        (req.body.title && req.body.title !== existingJobUpdate.title)
      ) {
        updatedData.slug = await generateUniqueSlug(
          JobUpdate,
          req.body.slug || req.body.title,
          // category?.name || "",
          existingJobUpdate.id
        );
      }

      const result = await REST_API.update(JobUpdate, req.params.id, updatedData);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error updating record in JobUpdate:", error.message);
      res.status(400).json({ error: error.message });
    }
  },




  deleteJobUpdate: async (req, res) => {
    try {
      await REST_API.delete(JobUpdate, req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getLatestJobs: async (req, res) => {
    try {
      const result = await Job.findAll({
        order: [["created_at", "DESC"]],
        limit: 10, 
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAdmitCards: async (req, res) => {
    try {
      const condition = {
        where: { update_type: "admit_card" },
        order: [["update_date", "DESC"]],
        include: [
          { model: Job },
          { model: Category },
          { model: Depertment },
          // { model: JobSEO },
          { model: State },
          { model: Subcategory },
        ],
      };
      const result = await REST_API.getAll(JobUpdate, req.query, condition);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAnswerKeys: async (req, res) => {
    try {
      const result = await JobUpdate.findAll({
        where: { update_type: "answer_key" },
        order: [["update_date", "DESC"]],
        // include: [{ model: Job, attributes: ["id", "title", "slug"] }],
        include: [
          { model: Job },
          { model: Category },
          { model: Depertment },
          // { model: JobSEO },
          { model: State },
          { model: Subcategory },
        ],
        limit: 10, // Adjust the limit as needed
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getResults: async (req, res) => {
    try {
      const result = await JobUpdate.findAll({
        where: { update_type: "result" },
        order: [["update_date", "DESC"]],
        // include: [{ model: Job, attributes: ["id", "title", "slug"] }],
        include: [
          { model: Job },
          { model: Category },
          { model: Depertment },
          // { model: JobSEO },
          { model: State },
          { model: Subcategory },
        ],
        limit: 10, // Adjust the limit as needed
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAdmitCardById: async (req, res) => {
    try {
      const result = await JobUpdate.findOne({
        where: {
          id: req.params.id,
          update_type: "admit_card",
        },
        include: [
          { model: Job },
          { model: Category },
          { model: Depertment },
          { model: State },
          { model: Subcategory },
        ],
      });

      if (!result) {
        return res.status(404).json({ error: "Admit Card not found" });
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAnswerKeyById: async (req, res) => {
    try {
      const result = await JobUpdate.findOne({
        where: {
          id: req.params.id,
          update_type: "answer_key",
        },
        include: [
          { model: Job },
          { model: Category },
          { model: Depertment },
          { model: State },
          { model: Subcategory },
        ],
      });

      if (!result) {
        return res.status(404).json({ error: "Answer Key not found" });
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getResultById: async (req, res) => {
    try {
      const result = await JobUpdate.findOne({
        where: {
          id: req.params.id,
          update_type: "result",
        },
        include: [
          { model: Job },
          { model: Category },
          { model: Depertment },
          { model: State },
          { model: Subcategory },
        ],
      });

      if (!result) {
        return res.status(404).json({ error: "Result not found" });
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },




    getUpdatedJobBySlug: async (req, res) => {
    try {
      const result = await REST_API.getDataListByField(
        JobUpdate,
        "slug",
        req.params.slug,
        {
          include: [
            { model: Category },
            { model: Depertment },
            { model: State },
            { model: Subcategory },
          ],
          order: [["created_at", "DESC"]],
        }
      );

      if (!result.length) {
        return res.status(404).json({ error: "Updated Job not found" });
      }

      res.json(result[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },



};

module.exports = JobUpdateController;

//  updateJobUpdate: async (req, res) => {
//     try {
//       await REST_API.update(Category, req.params.id, req.body);
//       const updatedJob = await Category.findByPk(req.params.id);
//       if (updatedJob) {
//         res.json(updatedJob);
//       } else {
//         res.status(404).json({ error: "Category not found" });
//       }
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   },

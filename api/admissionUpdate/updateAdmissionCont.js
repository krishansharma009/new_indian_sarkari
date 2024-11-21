const REST_API = require("../../utils/curdHelper");
const AdmissionUpdate = require("./updateAdmission");

const Category = require("../CategoryManagenet/categoryModel");
const Depertment = require("../DepartmentManagement/depertment");
const JobSEO = require("../SEOmanagement/JobSeo");
const State = require("../StateManagement/state");
const Subcategory = require("../SubcategoryManagement/subcategory");
const Admission = require("../goverment_admissilns/admission");
// const { Op } = require("sequelize");

const AdmissionUpdateController = {
  getAllAdmissionUpdates: async (req, res) => {
    try {
      const result = await REST_API.getAll(AdmissionUpdate, req.query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  //this is the fluid

  getAdmissionUpdateById: async (req, res) => {
    try {
      const result = await REST_API.getDataListByField(
        AdmissionUpdate,
        "id",
        req.params.id
      );
      res.json(result[0]);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  createAdmissionUpdate: async (req, res) => {
    try {
      const job = await Admission.findOne({ where: { id: req.body.admission_id } });
      req.body.category_id = job.category_id;
      req.body.jobSeo_id = job.jobSeo_id;
      req.body.state_id = job.state_id;
      req.body.subcategory_id = job.subcategory_id;
      req.body.department_id = job.department_id;
      const result = await REST_API.create(AdmissionUpdate, req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateAdmissionUpdate: async (req, res) => {
    try {
      const result = await REST_API.update(
        AdmissionUpdate,
        req.params.id,
        req.body
      );
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteAdmissionUpdate: async (req, res) => {
    try {
      await REST_API.delete(AdmissionUpdate, req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getLatestAdmission: async (req, res) => {
    try {
      const result = await Admission.findAll({
        order: [["created_at", "DESC"]],
        limit: 10, // Adjust the limit as needed
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getSchools: async (req, res) => {
    try {
      const condition = {
        where: { update_type: "schools" },
        order: [["update_date", "DESC"]],
        include: [
          { model: Admission },
          { model: Category },
          { model: Depertment },
          { model: JobSEO },
          { model: State },
          { model: Subcategory },
        ],
      };
      const result = await REST_API.getAll(
        AdmissionUpdate,
        req.query,
        condition
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getUniversities: async (req, res) => {
    try {
      const condition={
         where: { update_type: "universities" },
        order: [["update_date", "DESC"]],
        // include: [{ model: Job, attributes: ["id", "title", "slug"] }],
        include: [
          { model: Admission },
          { model: Category },
          { model: Depertment },
          { model: JobSEO },
          { model: State },
          { model: Subcategory },
        ]
      }
      
      const result = await REST_API.getAll(AdmissionUpdate, req.query, condition);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // getColleges: async (req, res) => {
  //   try {
  //     const result = await AdmissionUpdate.findAll({
  //       where: { update_type: "result" },
  //       order: [["update_date", "DESC"]],
  //       // include: [{ model: Job, attributes: ["id", "title", "slug"] }],
  //       include: [
  //         { model: Admission },
  //         { model: Category },
  //         { model: Depertment },
  //         { model: JobSEO },
  //         { model: State },
  //         { model: Subcategory },
  //       ],
  //       limit: 10, // Adjust the limit as needed
  //     });
  //     res.json(result);
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // },

  getColleges: async (req, res) => {
    try {

      const condition={
        where: { update_type: "colleges" },
        order: [["update_date", "DESC"]],
        // include: [{ model: Job, attributes: ["id", "title", "slug"] }],
        include: [
          { model: Admission },
          { model: Category },
          { model: Depertment },
          { model: JobSEO },
          { model: State },
          { model: Subcategory },
        ]
      }
      const result = await REST_API.getAll(AdmissionUpdate, req.query, condition);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
      }
};

};

module.exports = AdmissionUpdateController;



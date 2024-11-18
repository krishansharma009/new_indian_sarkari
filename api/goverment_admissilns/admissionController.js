const REST_API = require("../../utils/curdHelper");
const Category = require("../CategoryManagenet/categoryModel");
const Depertment = require("../DepartmentManagement/depertment");
const JobSEO = require("../SEOmanagement/JobSeo");
const State = require("../StateManagement/state");
const Subcategory = require("../SubcategoryManagement/subcategory");

const generateUniqueSlug = require("../../utils/slugyfy");
const Admission = require("./admission");

const AdmissionController = {
  getAllAdmission: async (req, res) => {
    try {
      const result = await REST_API.getAll(Admission, req.query, {
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

  getAdmissionById: async (req, res) => {
    try {
      const result = await REST_API.getDataListByField(
        Admission,
        "id",
        req.params.id,
        {
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

  createAdmission: async (req, res) => {
    try {
      const categorydata = await Category.findOne({
        where: { id: req.body.category_id },
      });

      console.log(categorydata);

      const slug = await generateUniqueSlug(
        Admission,
        req.body.title,
        categorydata.name
      );
      const jobData = { ...req.body, slug };
      const result = await REST_API.create(Admission, jobData);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateAdmission: async (req, res) => {
    try {
      const existingAdmission = await Admission.findByPk(req.params.id);
      if (!existingAdmission) {
        return res.status(404).json({ error: "Admission not found" });
      }

      let updatedData = { ...req.body };

      // Generate a new slug if the title has changed
      if (req.body.title && req.body.title !== existingAdmission.title) {
        const newSlug = await generateUniqueSlug(
          Admission,
          req.body.title,
          existingAdmission.id
        );
        updatedData.slug = newSlug;
      }

      // Update the job post
      await REST_API.update(Admission, req.params.id, updatedData);

      // Fetch the updated job post
      const updatedAdmission = await Admission.findByPk(req.params.id);

      // Return the updated job post in the response
      res.json(updatedAdmission);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteAdmission: async (req, res) => {
    try {
      await REST_API.delete(Admission, req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = AdmissionController;


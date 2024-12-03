const GeneralKnowledge = require("./generalknowledge");
const REST_API = require("../../../utils/curdHelper");
const generateUniqueSlug = require("../../../utils/slugyfy");
class GeneralKnowledgeController {
  static async createGeneralKnowledge(req, res) {
    try {
      const {
        title,
        content,
        meta_title,
        meta_description,
        canonical_url,
        is_paid,
        slug: providedSlug,
      } = req.body;





      // Validate is_paid value
      if (is_paid && !["free", "paid"].includes(is_paid)) {
        return res.status(400).json({
          message: "Invalid is_paid value. Must be 'free' or 'paid'.",
        });
      }



      

      // Use the external generateUniqueSlug function
      const slug = providedSlug
        ? await generateUniqueSlug(GeneralKnowledge, title, providedSlug)
        : await generateUniqueSlug(GeneralKnowledge, title);

      const data = {
        title,
        content,
        slug,
        meta_title: meta_title || title,
        meta_description: meta_description || content.substring(0, 160),
        canonical_url,
        is_paid,
      };

      const result = await REST_API.create(GeneralKnowledge, data);

      res.status(201).json({
        // message: "General Knowledge created successfully",
        data: result,
      });
    } catch (error) {
      console.error("SQL Error:", error.sql);
      console.error("Fields:", error.fields);
      res.status(500).json({
        message: "Error creating General Knowledge",
        error: error.message,
      });
    }
  }

  static async getGeneralKnowledge(req, res) {
    try {
      const { is_paid } = req.query;
      const query = {
        ...req.query,
        filter: {
          ...(is_paid && ["free", "paid"].includes(is_paid) ? { is_paid } : {}),
        },
      };

      const result = await REST_API.getAll(GeneralKnowledge, query);

      res.status(200).json({
        // message: "General Knowledge retrieved successfully",
        ...result,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving General Knowledge",
        error: error.message,
      });
    }
  }

  static async getGeneralKnowledgeBySlug(req, res) {
    try {
      const { slug } = req.params;
      const [result] = await REST_API.getDataListByField(
        GeneralKnowledge,
        "slug",
        slug
      );

      res.status(200).json({
        // message: "General Knowledge retrieved successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving General Knowledge",
        error: error.message,
      });
    }
  }

  static async updateGeneralKnowledge(req, res) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };





      // Validate is_paid value if provided
      if (
        updateData.is_paid &&
        !["free", "paid"].includes(updateData.is_paid)
      ) {
        return res.status(400).json({
          message: "Invalid is_paid value. Must be 'free' or 'paid'.",
        });
      }





      // Handle slug generation/update
      if (updateData.title || updateData.slug) {
        // Prioritize provided slug, fall back to title
        const slugSource = updateData.slug || updateData.title;
        updateData.slug = await generateUniqueSlug(
          GeneralKnowledge,
          slugSource,
          updateData.slug || updateData.title,
          id // Pass existing ID to exclude from duplicate check
        );
      }

      const result = await REST_API.update(GeneralKnowledge, id, updateData);

      res.status(200).json({
        // message: "General Knowledge updated successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error updating General Knowledge",
        error: error.message,
      });
    }
  }

  static async deleteGeneralKnowledge(req, res) {
    try {
      const { id } = req.params;
      const result = await REST_API.delete(GeneralKnowledge, id);

      res.status(200).json({
        // message: "General Knowledge deleted successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error deleting General Knowledge",
        error: error.message,
      });
    }
  }
}

module.exports = GeneralKnowledgeController;

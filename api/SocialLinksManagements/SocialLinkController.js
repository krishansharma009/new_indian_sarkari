const SocialLink = require("./SocialLink");
const CurdHelper = require("../../utils/curdHelper");
const fs = require("fs").promises;
const path = require("path");

const SocialLinkController = {
  async create(req, res) {
    try {
      const data = {
        ...req.body,
        socialIcon: req.file ? req.file.path.replace(/\\/g, "/") : null, // Handle file upload
      };

      const result = await CurdHelper.create(SocialLink, data);
      return res.status(201).json(result);
    } catch (error) {
      // Delete uploaded file if an error occurs
      if (req.file) {
        await fs.unlink(req.file.path);
      }
      return res.status(500).json({ message: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const query = {
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
      };

      const result = await CurdHelper.getAll(SocialLink, query);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const result = await CurdHelper.getDataListByField(SocialLink, "id", id);

      if (result[0]) {
        result[0].socialIcon = result[0].socialIcon
           ? `${result[0].socialIcon}`
          : null;
      }

      return res.status(200).json(result[0]);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const socialLink = await SocialLink.findByPk(id);
      if (!socialLink) {
        return res.status(404).json({ error: "SocialLink not found" });
      }

      // If there's a new file, delete the old one
      if (req.file && socialLink.socialIcon) {
        try {
          await fs.unlink(socialLink.socialIcon);
        } catch (error) {
          console.error("Error deleting old file:", error);
        }
      }

      const data = {
        ...req.body,
        ...(req.file && { socialIcon: req.file.path.replace(/\\/g, "/") }), // Update file path if uploaded
      };

      await CurdHelper.update(SocialLink, id, data);

      const updatedSocialLink = await SocialLink.findByPk(id);
      return res.status(200).json({
        ...updatedSocialLink.toJSON(),
        socialIcon: updatedSocialLink.socialIcon
          ? `${req.protocol}://${req.get("host")}/${updatedSocialLink.socialIcon}`
          : null,
      });
    } catch (error) {
      // Delete uploaded file if an error occurs
      if (req.file) {
        await fs.unlink(req.file.path);
      }
      return res.status(500).json({ message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const socialLink = await SocialLink.findByPk(id);

      if (!socialLink) {
        return res.status(404).json({ error: "SocialLink not found" });
      }

      // Delete the associated file if it exists
      if (socialLink.socialIcon) {
        try {
          await fs.unlink(socialLink.socialIcon);
        } catch (error) {
          console.error("Error deleting file:", error);
        }
      }

      await CurdHelper.delete(SocialLink, id);
      return res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = SocialLinkController;

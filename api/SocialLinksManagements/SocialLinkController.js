const SocialLink = require("./SocialLink");
const CurdHelper = require("../../utils/curdHelper");

const SocialLinkController = {
  async create(req, res) {
    try {
      const data = req.body;
      const result = await CurdHelper.create(SocialLink, data);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const query = req.query;
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
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const result = await CurdHelper.update(SocialLink, id, data);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await CurdHelper.delete(SocialLink, id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = SocialLinkController;

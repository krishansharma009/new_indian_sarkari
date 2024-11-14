const Depertment = require("./depertment");
const REST_API = require("../../utils/curdHelper");
const depertmentController = {
  getAllDepertment: async (req, res) => {
    try {
      const response = await REST_API.getAll(Depertment);
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getDepertmentById: async (req, res) => {
    try {
      const response = await REST_API.getDataListByField(
        Depertment,
        "id",
        req.params.id
      );
      res.json(response[0]);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  createDepertment: async (req, res) => {
    try {
      const response = await REST_API.create(Depertment, req.body);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  //   updateDepertment: async (req, res) => {
  //     try {
  //       const response = await REST_API.update(Depertment, req.params.id, req.body);
  //       res.status(201).json(response);
  //     } catch (error) {
  //       res.status(404).json({ error: error.message });
  //     }
  //   },

  updateDepertment: async (req, res) => {
    try {
      await REST_API.update(Depertment, req.params.id, req.body);
      const updatedDepertment = await Depertment.findByPk(req.params.id);
      if (updatedDepertment) {
        res.json(updatedDepertment);
      } else {
        res.status(404).json({ error: "Depertment not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteDepertment: async (req, res) => {
    try {
      const response = await REST_API.delete(Depertment, req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = depertmentController;

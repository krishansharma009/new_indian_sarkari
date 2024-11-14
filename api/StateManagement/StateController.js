const State = require("./state");
const REST_API = require("../../utils/curdHelper");

const StateController = {
  getAllStates: async (req, res) => {
    try {
      const response = await REST_API.getAll(State);
      res.json(response);
    } catch (err) {
      res.status(500).json({ error: error.message });
    }
  },

  getStateById: async (req, res) => {
    try {
      const response = await REST_API.getDataListByField(
        State,
        "id",
        req.params.id
      );
      res.json(response[0]);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  updateState: async (req, res) => {
    try {
      await REST_API.update(State, req.params.id, req.body);
      const updatedState = await State.findByPk(req.params.id);
      if (updatedState) {
        res.json(updatedState);
      } else {
        res.status(404).json({ error: "Category not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deleteState: async (req, res) => {
    try {
      const response = await REST_API.delete(State, req.params.id);
      res.status(200).send("record deleted successfully");
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  createState: async (req, res) => {
    try {
      const response = await REST_API.create(State, req.body);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = StateController;

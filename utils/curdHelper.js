const { Op, DataTypes } = require("sequelize");
const logger = require("../middleware/logger");
const sequelize = require("../config/datasource-db"); // Assume this is your Sequelize instance

const REST_API = {
  /**
   * Get all records with advanced querying options.
   * @param {Sequelize.Model} model - Sequelize model instance
   * @param {object} query - Query object with pagination, searching, filtering, and sorting options
   * @returns {Promise<object>} - Records data
   */
  getAll: async (model, query = {}, options = {}) => {
    try {
      const { page = 1, limit = 10, search, searchExact, filter, sort } = query;
      const offset = (page - 1) * limit;
      const where = {};
      let order = [];

      // Handle exact search
      //in postman kye: searchExact and value: you want to search(data name)
      if (searchExact) {
        where[Op.or] = Object.keys(model.rawAttributes)
          .filter(
            (attr) => model.rawAttributes[attr].type instanceof DataTypes.STRING
          )
          .map((attr) => ({
            [attr]: searchExact, // Exact match instead of LIKE
          }));
      }

      else if (search) {
        where[Op.or] = Object.keys(model.rawAttributes)
          .filter(
            (attr) => model.rawAttributes[attr].type instanceof DataTypes.STRING
          )
          .map((attr) => ({
            [attr]: { [Op.like]: `%${search}%` },
          }));
      }

      if (filter) {
        Object.keys(filter).forEach((key) => {
          where[key] = filter[key];
        });
      }

      if (sort) {
        const [field, direction] = sort.split(":");
        order.push([field, direction.toUpperCase()]);
      }

      const result = await model.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order,
        paranoid: true,
        ...options,
      });

      logger.info(
        `Read records from ${model.name} with query ${JSON.stringify(query)}`
      );
      return {
        rows: result.rows,
        count: result.count,
        totalPages: Math.ceil(result.count / limit),
        currentPage: parseInt(page),
      };
    } catch (error) {
      logger.error(
        `Error reading records from ${model.name}: ${error.message}`
      );
      throw error;
    }
  },

  /**
   * Get a record by ID or any other field.
   * @param {Sequelize.Model} model - Sequelize model instance
   * @param {string} fieldName - Field name to search by
   * @param {any} fieldValue - Value to search for
   * @returns {Promise<object>} - Record data
   */
  getDataListByField: async (model, fieldName, fieldValue, options = {}) => {
    try {
      const result = await model.findAll({
        where: { [fieldName]: fieldValue },
        paranoid: true,
        ...options, // Include the 'options' parameter here as well
      });

      if (result.length === 0) {
        throw new Error(
          `${model.name} with ${fieldName} ${fieldValue} not found`
        );
      }

      logger.info(
        `Read record(s) from ${model.name} with ${fieldName} ${fieldValue}`
      );
      return result;
    } catch (error) {
      logger.error(`Error reading ${model.name}: ${error.message}`);
      throw error;
    }
  },

  /**
   * Update a record.
   * @param {Sequelize.Model} model - Sequelize model instance
   * @param {number} id - Record ID
   * @param {object} data - Updated data
   * @returns {Promise<object>} - Updated record
   */
  update: async (model, id, data) => {
    const transaction = await sequelize.transaction();
    try {
      if (!data || Object.keys(data).length === 0) {
        throw new Error("Update data cannot be empty");
      }

      const [updatedRowsCount, updatedRows] = await model.update(data, {
        where: { id },
        returning: true,
        transaction,
        paranoid: true,
      });

      if (updatedRowsCount === 0) {
        throw new Error(
          `${model.name} with id ${id} not found or no changes applied`
        );
      }

      // Then fetch the updated record
      const updatedRecord = await model.findByPk(id, {
        transaction,
        paranoid: true,
      });

      await transaction.commit();
      logger.info(`Updated record in ${model.name} with id ${id}`);
      console.log(updatedRecord);
      return { updatedRecord };
    } catch (error) {
      await transaction.rollback();
      logger.error(`Error updating record in ${model.name}: ${error.message}`);
      throw error;
    }
  },

  /**
   * Soft delete a record.
   * @param {Sequelize.Model} model - Sequelize model instance
   * @param {number} id - Record ID
   * @returns {Promise<void>}
   */
  delete: async (model, id) => {
    const transaction = await sequelize.transaction();
    try {
      // Get the record before deletion to check if it exists
      const record = await model.findByPk(id, { paranoid: true });

      if (!record) {
        throw new Error(`${model.name} with id ${id} not found`);
      }

      // Perform soft delete
      await record.destroy({ transaction });

      await transaction.commit();
      logger.info(`Soft deleted record from ${model.name} with id ${id}`);

      return {
        message: "Record deleted successfully",
        deletedRecord: record, // Returns the deleted record
      };
    } catch (error) {
      await transaction.rollback();
      logger.error(
        `Error soft deleting record from ${model.name}: ${error.message}`
      );
      throw error;
    }
  },
  /**
   * Create a new record.
   * @param {Sequelize.Model} model - Sequelize model instance
   * @param {object} data - Data to be inserted
   * @returns {Promise<object>} - Created record
   */
  create: async (model, data) => {
    const transaction = await sequelize.transaction();
    try {
      if (!data || Object.keys(data).length === 0) {
        throw new Error("Data cannot be empty");
      }

      const result = await model.create(data, { transaction });

      await transaction.commit();
      logger.info(`Created record in ${model.name} with id ${result.id}`);
      return result;
    } catch (error) {
      await transaction.rollback();
      logger.error(`Error creating record in ${model.name}: ${error.message}`);
      throw error;
    }
  },

  /**
   * Hard delete a record.
   * @param {Sequelize.Model} model - Sequelize model instance
   * @param {number} id - Record ID
   * @returns {Promise<void>}
   */
  delete: async (model, id) => {
    const transaction = await sequelize.transaction();
    try {
      // Force: true will perform a hard delete
      const result = await model.destroy({
        where: { id },
        force: true, // This makes it a hard delete
        transaction,
      });

      if (result === 0) {
        throw new Error(`${model.name} with id ${id} not found`);
      }

      await transaction.commit();
      logger.info(`Hard deleted record from ${model.name} with id ${id}`);
      return { message: "Record permanently deleted" };
    } catch (error) {
      await transaction.rollback();
      logger.error(
        `Error deleting record from ${model.name}: ${error.message}`
      );
      throw error;
    }
  },
};

module.exports = REST_API;

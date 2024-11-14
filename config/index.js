const db = require("./datasource-db");
const logger = require("../middleware/logger");
// const transporter = require("./mailer");

exports.db = db;
exports.logger = logger;
exports.transporter = transporter;

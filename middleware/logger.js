const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;

// Custom log levels for better verbosity control
const customLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

// Define the log format with a custom label and formatted timestamp
const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

// Transports for console (with color) and separate log files for general and error logs
const logger = createLogger({
  levels: customLevels,
  format: combine(
    label({ label: "localhost" }), // Custom label for easier filtering
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Custom timestamp format
    logFormat // Simple and readable log format
  ),
  transports: [
    new transports.Console({
      level: "debug", // Log everything from 'debug' and above to the console
      format: combine(
        format.colorize(), // Colorized logs for better visibility in the console
        logFormat
      ),
    }),
    new transports.File({
      filename: "logs/app.log",
      level: "info", // Log 'info' level and above to app.log
      format: logFormat,
    }),
    new transports.File({
      filename: "logs/error.log",
      level: "error", // Log only 'error' level logs to error.log
      format: logFormat,
    }),
  ],
});

module.exports = logger;

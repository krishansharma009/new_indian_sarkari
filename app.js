const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const path = require("path");
const sequelize = require("./config/datasource-db");
const logger = require("./middleware/logger");
const rateLimiter = require("./middleware/rateLimiter");
const swagger = require("./config/swagger");
const swaggerUi = require("swagger-ui-express");

const errorHandler = require("./middleware/errorHandler");

// const adminRoutes = require("./routes/admin");
// const jobsRoutes = require("./routes/jobs");
const categoryRoute = require("./api/CategoryManagenet/categoryRoute");
const subCategoryRoute = require("./api/SubcategoryManagement/subCategoryRoute");
const statesRoute = require("./api/StateManagement/stateroute");
const depertmentRoute = require("./api/DepartmentManagement/depertmentRoute");
const jobRouter = require("./api/jobmanagement/jobRoute");
const jobupdateRouter = require("./api/jobupdatemanagement/jobupdateRoute");
const jobSeoRouter = require("./api/SEOmanagement/jobSeoRoute");
const admissionRouter = require("./api/goverment_admissilns/adissionRoute");
const updateAdmissionRouter = require("./api/admissionUpdate/updateAdmissionRout");
const fileUploadRouter = require("./api/studyMeterial/fileUpload.routes");
const generalKnowRouter = require("./api/studyMeterial/generalKnowledge/generalknowRoute");

//testserize management

const testCategoryRouter = require("./TestSeriesManagement/testSerises-Category/testCatRoute");
const testSeriesRouter = require("./TestSeriesManagement/testSerise-deficultyLevel/testseriesRoute");

const app = express();
const port = process.env.PORT || 8080;

// Basic authentication middleware

// Middleware
app.use(cors());
app.use(helmet());
app.use(rateLimiter);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagger));

app.use(express.static(path.join(__dirname, "public")));

//trust proxy headers
app.set("trust proxy", 1);

// // Database sync
// sequelize
//   .sync({ alter: true })
//   .then(() => {
//     console.log("Database synced successfully.");
//     logger.info("Database synced successfully.");
//   })
//   .catch((err) => {
//     console.error("Error syncing database:", err);
//     logger.error("Error syncing database:", err);
//   });

// Request logging
app.use((req, res, next) => {
  logger.http(`${req.method} ${req.url}`);
  next();
});

// Route: Home
app.get("/", (req, res) => {
  logger.debug("Visited home page");
  res.sendFile(path.join(__dirname, "index.html"));
});

// Error handling middleware (Combined)
app.use((err, req, res, next) => {
  logger.error(err.stack);
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Routes
// app.use("/", publicRoutes);
// app.use("/jobs", jobsRoutes);
// app.use("/admin", adminRoutes);
app.use("/category", categoryRoute);
app.use("/subcategory", subCategoryRoute);
app.use("/state", statesRoute);
app.use("/depertment", depertmentRoute);
app.use("/job", jobRouter);
app.use("/jobupdate", jobupdateRouter);
app.use("/seo", jobSeoRouter);
app.use("/admission", admissionRouter);
app.use("/upadmis", updateAdmissionRouter);
app.use("/fileUpload", fileUploadRouter);
app.use("/generalknow", generalKnowRouter);

//testserize route
app.use("/testCat", testCategoryRouter);
app.use("/testSeries", testSeriesRouter);

// Error handling middleware
app.use(errorHandler);

// // Start server
// app.listen(port, () => {
//   logger.info(`Server running on port ${port}`);
//   console.log(`Server is running on http://localhost:${port}`);
//   // Print the Swagger URL in the console
//   console.log(`Swagger Docs available at http://localhost:${port}/api-docs`);
// });

// Database sync
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced successfully.");
    logger.info("Database synced successfully.");
    // Start server
    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
      console.log(`Server is running on http://localhost:${port}`);
      // Print the Swagger URL in the console
      console.log(
        `Swagger Docs available at http://localhost:${port}/api-docs`
      );
    });
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
    logger.error("Error syncing database:", err);
  });

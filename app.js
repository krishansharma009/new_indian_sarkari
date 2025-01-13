const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const { Sequelize } = require("sequelize");
const path = require("path");
const sequelize = require("./config/datasource-db");
const logger = require("./middleware/logger");
const rateLimiter = require("./middleware/rateLimiter");
const swagger = require("./config/swagger");
const swaggerUi = require("swagger-ui-express");
const cookieParser = require("cookie-parser");

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
const admissonRouter = require("./api/goverment_admissilns/adissionRoute");
const updateAdmissionRouter = require("./api/admissionUpdate/updateAdmissionRout");
const fileUploadRouter = require("./api/studyMeterial/fileUpload.routes");
const generalKnowRouter = require("./api/studyMeterial/generalKnowledge/generalknowRoute");
const socialLinkRouter = require("./api/SocialLinksManagements/SocialLinkRoutes");
const authRouter = require("./api/userManagement/authRoutes");
const storyRouter = require("./api/WebStoriesManagement/storyRoute");
const storySlidesRouter = require("./api/WebStoriesSlideManagement/storySlidesRoute");
const authorRouter = require("./api/authorManagement/authorRoute");

//testserize management

const testCategoryRouter = require("./TestSeriesManagement/testSerises-Category/testCatRoute");
const testSeriesRouter = require("./TestSeriesManagement/testSerise-deficultyLevel/testseriesRoute");

const app = express();
const port = process.env.PORT || 8080;

// Basic authentication middleware
app.use(cookieParser());
// Middleware
app.use(cors());
app.use(helmet());
app.use(rateLimiter);
app.use(morgan("dev"));
app.use(errorHandler);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(compression());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagger));
// Serve static files
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
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handling middleware (Combined)
app.use((err, req, res, next) => {
  logger.error(err.stack);
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// API Route to fetch job data
// app.get('/api/jobs', async (req, res) => {
//   try {
//     // Raw SQL query to fetch data from wp_posts table
//     const [results, metadata] = await sequelize.query(`select *  FROM job_list`);

//     // Send the results as response
//     res.json(results); // This will send the fetched data in JSON format
//   } catch (error) {
//     console.error('Error fetching job data:', error);
//     res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// });

// app.get('/api/jobs/:slug', async (req, res) => {
//   const slug = req.params.slug;
//   try {
//     const [results, metadata] = await sequelize.query('select * FROM job_list WHERE slug = ?',{ replacements: [slug] });

//     if (results.length > 0) {
//       res.json(results);
//     } else {
//       res.status(404).json({ message: 'Job not found for the given slug.' });
//     }
//   } catch (error) {
//     console.error('Error fetching job data:', error);
//     res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// });

//  app.get('/api/jobs/:slug', async (req, res) => {
//   const slug = req.params.slug;
//   const JobModel = require("./api/jobmanagement/job");
//   const AdmitModel = require("./api/jobupdatemanagement/job-update");
//   try {
//     const [results, metadata] = await sequelize.query('select * FROM job_list ',{ replacements: [slug] });
//     if(results.length>0){
//    await Promise.all(
//       results.map(async (jobData) => {
//         const additionalContent = {
//           Advt_No: jobData.Advt_No,
//           Online_Application_Start: jobData.Online_Application_Start,
//           Registration_Last_Date: jobData.Registration_Last_Date,
//           Fee_Payment_Last_Date: jobData.Fee_Payment_Last_Date,
//           Exam_Date: jobData.Exam_Date,
//           Admit_Card_Date: jobData.Admit_Card_Date,
//           Result_Date: jobData.Result_Date,
//           Answer_Key: jobData.Answer_Key,
//           General_OBC_Application_Fee: jobData.General_OBC_Application_Fee,
//           SC_ST_Application_Fee: jobData.SC_ST_Application_Fee,
//           Fresh_Candidates_Below_Age_Limit: jobData.Fresh_Candidates_Below_Age_Limit,
//           Max_age: jobData.Max_age,
//           Total_Vacancy: jobData.Total_Vacancy,
//           Eligibility_Details: jobData.Eligibility_Details,
//           official_link: jobData.official_link,
//           admitcard_link: jobData.admitcard_link,
//           result_link: jobData.result_link,
//           answerkey_link: jobData.answerkey_link,
//           examdate_link: jobData.examdate_link,
//           apply_link: jobData.apply_link,
//           notification_link: jobData.notification_link,
//         };

//         // Create a new job in the JobModel
//        const job = await JobModel.create({
//           title: jobData.Post_Title,
//           description: jobData.Short_Information,
//           slug: jobData.slug,
//           meta_title: jobData.Post_Title,
//           meta_description: jobData.Short_Information,
//           canonical_url: jobData.official_link,
//           date: jobData.Post_Update_Date,
//           // state_id: jobData.State, // Uncomment if you want to map State field
//           content: JSON.stringify(additionalContent), // Store additional fields as JSON
//           admit_card_released: jobData.Admit_Card_Date ? "yes" : "no",
//           answer_key_released: jobData.Answer_Key ? "yes" : "no",
//           result_released: jobData.Result_Date ? "yes" : "no",
//         });

//         console.log(job.id);

//       })
//     );
//     }
//     if (results.length > 0) {
//       res.json(results);
//     } else {
//       res.status(404).json({ message: 'Job not found for the given slug.' });
//     }
//   } catch (error) {
//     console.error('Error fetching job data:', error);
//     res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// });

// Routes
// app.use("/", publicRoutes);
// app.use("/jobs", jobsRoutes);
// app.use("/admin", adminRoutes);

// const JobModel = require("./api/jobmanagement/job");
// const JobUpdateModel = require("./api/jobupdatemanagement/job-update");

// app.get('/api/jobsgk/', async (req, res) => {
//   const slug = req.params.slug;

//   try {
//     // Fetch job data using raw SQL query
//     const [results, metadata] = await sequelize.query(`SELECT * FROM job_list `);

//     if (results.length > 0) {
//       // Process each job entry
//       await Promise.all(
//         results.map(async (jobData) => {
//           // Prepare additional content
//           const additionalContent = {
//             Advt_No: jobData.Advt_No,
//             Online_Application_Start: jobData.Online_Application_Start,
//             Registration_Last_Date: jobData.Registration_Last_Date,
//             Fee_Payment_Last_Date: jobData.Fee_Payment_Last_Date,
//             Exam_Date: jobData.Exam_Date,
//             Admit_Card_Date: jobData.Admit_Card_Date,
//             Result_Date: jobData.Result_Date,
//             Answer_Key: jobData.Answer_Key,
//             General_OBC_Application_Fee: jobData.General_OBC_Application_Fee,
//             SC_ST_Application_Fee: jobData.SC_ST_Application_Fee,
//             Fresh_Candidates_Below_Age_Limit: jobData.Fresh_Candidates_Below_Age_Limit,
//             Max_age: jobData.Max_age,
//             Total_Vacancy: jobData.Total_Vacancy,
//             Eligibility_Details: jobData.Eligibility_Details,
//             official_link: jobData.official_link,
//             admitcard_link: jobData.admitcard_link,
//             result_link: jobData.result_link,
//             answerkey_link: jobData.answerkey_link,
//             examdate_link: jobData.examdate_link,
//             apply_link: jobData.apply_link,
//             notification_link: jobData.notification_link,
//           };

//           // Create or Update Job in JobModel
//           const job = await JobModel.create({
//             title: jobData.Post_Title,
//             description: jobData.Short_Information,
//             slug: jobData.slug,
//             meta_title: jobData.Post_Title,
//             meta_description: jobData.Short_Information,
//             canonical_url: jobData.official_link,
//             date: jobData.Post_Update_Date,
//             content: JSON.stringify(additionalContent), // Store additional fields as JSON
//             admit_card_released: jobData.Admit_Card_Date ? "yes" : "no",
//             answer_key_released: jobData.Answer_Key ? "yes" : "no",
//             result_released: jobData.Result_Date ? "yes" : "no",
//           });

//           // Create Job Update Entries in JobUpdateModel
//           if (jobData.Admit_Card_Date) {
//             await JobUpdateModel.create({
//               job_id: job.id,
//               update_type: "admit_card",
//               update_date: jobData.Admit_Card_Date,
//               admitCardUrl: jobData.admitcard_link,
//             });
//           }
//           if (jobData.Answer_Key) {
//             await JobUpdateModel.create({
//               job_id: job.id,
//               update_type: "answer_key",
//               update_date: jobData.Answer_Key,
//               answerKeyUrl: jobData.answerkey_link,
//             });
//           }
//           if (jobData.Result_Date) {
//             await JobUpdateModel.create({
//               job_id: job.id,
//               update_type: "result",
//               update_date: jobData.Result_Date,
//               resultUrl: jobData.result_link,
//             });
//           }

//           console.log(`Job created/updated with ID: ${job.id}`);
//         })
//       );

//       res.json({ message: "Jobs processed successfully.", jobs: results });
//     } else {
//       res.status(404).json({ message: "Job not found for the given slug." });
//     }
//   } catch (error) {
//     console.error("Error fetching job data:", error);
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// });

app.use("/category", categoryRoute);
app.use("/subcategory", subCategoryRoute);
app.use("/state", statesRoute);
app.use("/depertment", depertmentRoute);
app.use("/job", jobRouter);
app.use("/jobupdate", jobupdateRouter);
app.use("/seo", jobSeoRouter);
app.use("/admission", admissonRouter);
app.use("/upadmis", updateAdmissionRouter);
app.use("/fileUpload", fileUploadRouter);
app.use("/generalknow", generalKnowRouter);
app.use("/generate", socialLinkRouter);
app.use("/user", authRouter);
app.use("/story", storyRouter);
app.use("/slides", storySlidesRouter);
app.use("/author", authorRouter);

//testserize route
app.use("/testCat", testCategoryRouter);
app.use("/testSeries", testSeriesRouter);

// // Start server
// app.listen(port, () => {
//   logger.info(`Server running on port ${port}`);
//   console.log(`Server is running on http://localhost:${port}`);
//   // Print the Swagger URL in the console
//   console.log(`Swagger Docs available at http://localhost:${port}/api-docs`);
// });

// Database sync

// const fs = require("fs");

// const mysql = require("mysql2");
// const readline = require("readline");

// (async () => {
//   const sqlFilePath = path.join(__dirname, "database.sql"); // Path to your SQL file

//   try {
//     // Create MySQL connection
//     const connection = mysql.createConnection({
//       host: "localhost", // Replace with your database host
//       user: "root",      // Replace with your database user
//       password: "",      // Replace with your database password
//       database: "random", // Replace with your database name
//       // port: 27462,
//     });

//     console.log("Connected to the database.");

//     // Create a read stream for the SQL file
//     const fileStream = fs.createReadStream(sqlFilePath, { encoding: "utf8" });
//     const rl = readline.createInterface({
//       input: fileStream,
//       crlfDelay: Infinity, // Recognize all instances of CRLF as a single newline
//     });

//     let sqlQuery = "";

//     // Read the file line by line
//     for await (const line of rl) {
//       // Skip comments and empty lines
//       if (line.startsWith("--") || line.trim() === "") continue;

//       // Accumulate the SQL query
//       sqlQuery += line;

//       // If the query ends with a semicolon, execute it
//       if (line.trim().endsWith(";")) {
//         await new Promise((resolve, reject) => {
//           connection.query(sqlQuery, (err) => {
//             if (err) {
//               console.error(`Error executing query: ${sqlQuery}`, err);
//               reject(err);
//             } else {
//               console.log("Executed:", sqlQuery);
//               resolve();
//             }
//           });
//         });

//         // Reset the query accumulator
//         sqlQuery = "";
//       }
//     }

//     console.log("SQL file imported successfully.");

//     // Close the connection
//     connection.end();
//   } catch (error) {
//     console.error("Error:", error.message);
//   }
// })();

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
    // Exit process if database sync fails
    process.exit(1);
  });


  //this
const FileUpload = require("./studyMatrial");
const REST_API = require("../../utils/curdHelper");
const FileUploadHelper = require("../../utils/fileUpload.helper");
const Category = require("../CategoryManagenet/categoryModel");

const FileUploadController = {
  // Create new file upload
  async create(req, res) {
    try {
      const {
        title,
        description,
        uploadType,
        courseType,
        accessType,
        fileUrl,
        seoTools,
        category_id,
      } = req.body;

      let filePath = null;
      if (req.file) {
        // filePath = req.file.path;
        // Simple path extraction method
        filePath = req.file.path.replace(/^.*uploads[\\\/]/, "/uploads/");
      }

      const fileData = {
        title,
        description,
        uploadType,
        courseType,
        accessType,
        fileUrl: fileUrl || null,
        filePath,
        seoTools,
        category_id,
      };

      const result = await REST_API.create(FileUpload, fileData);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update file upload
  async update(req, res) {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        uploadType,
        courseType,
        accessType,
        fileUrl,
        seoTools,
        category_id,
      } = req.body;

      // Find existing record
      const existingRecord = await FileUpload.findByPk(id);
      if (!existingRecord) {
        return res.status(404).json({ error: "File record not found" });
      }

      let filePath = existingRecord.filePath;

      // Handle file replacement
      if (req.file) {
        // Replace the existing file if it exists
        if (existingRecord.filePath) {
          await FileUploadHelper.replaceFile(
            existingRecord.filePath,
            req.file.path
          );
        }
        // filePath = req.file.path;
        // Extract only the relative path
        filePath = req.file.path.replace(/^.*uploads[\\\/]/, "/uploads/");
      }

      const updateData = {
        title,
        description,
        uploadType,
        courseType,
        accessType,
        fileUrl: fileUrl || null,
        filePath,
        seoTools,
        category_id,
      };

      const result = await REST_API.update(FileUpload, id, updateData);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get files by upload type
  async getFilesByType(req, res) {
    try {
      const { uploadType } = req.params;
      const options = {
        where: { uploadType },

        include: [{ model: Category }],
      };

      const result = await REST_API.getAll(FileUpload, {}, options);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete file upload
  async delete(req, res) {
    try {
      const { id } = req.params;
      const fileRecord = await FileUpload.findByPk(id);

      if (fileRecord && fileRecord.filePath) {
        // Delete physical file
        await FileUploadHelper.replaceFile(fileRecord.filePath);
      }

      const result = await REST_API.delete(FileUpload, id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const {
        uploadType,
        courseType,
        accessType,
        sortBy = "createdAt",
        sortOrder = "DESC",
      } = req.query;

      // Construct where clause for filtering
      const whereClause = {};

      // Filtering options
      if (uploadType) {
        whereClause.uploadType = uploadType;
      }

      if (courseType) {
        whereClause.courseType = courseType;
      }

      if (accessType) {
        whereClause.accessType = accessType;
      }

      // Search across multiple fields

      // Fetch files with filtering, pagination, and sorting
      const { count, rows: files } = await FileUpload.findAndCountAll({
        where: whereClause,
        attributes: {
          exclude: ["filePath"], // Exclude sensitive file path information
        },
        include: [{ model: Category }],
      });

      // Prepare response
      res.json({ files });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching files",
        error: error.message,
      });
    }
  },

  // Get File by ID with Detailed Information
  async getById(req, res) {
    try {
      const { id } = req.params;

      // Find file by ID with optional related data
      const file = await FileUpload.findByPk(id, {
        attributes: {
          exclude: ["filePath"], // Exclude sensitive file path information
        },
        // Uncomment and modify if you want to include associations
        // include: [
        //   { model: User, attributes: ['id', 'name'] }
        // ]
      });

      // Check if file exists
      if (!file) {
        return res.status(404).json({
          message: "File not found",
          fileId: id,
        });
      }

      // Increment view count (optional)
      file.views = (file.views || 0) + 1;
      await file.save();

      res.json(file);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching file details",
        error: error.message,
      });
    }
  },
};

module.exports = FileUploadController;

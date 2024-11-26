const fs = require("fs").promises;
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const uploadDirectory = path.join(__dirname, "../uploads");

// Ensure upload directory exists
const ensureUploadDirectory = async () => {
  try {
    await fs.mkdir(uploadDirectory, { recursive: true });
  } catch (error) {
    console.error("Error creating upload directory:", error);
  }
};

// File storage configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await ensureUploadDirectory();
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    const fileExtension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
  },
});

// File upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = [
      "application/pdf",
      "video/mp4",
      "image/jpeg",
      "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
});

// File management helper functions
const FileUploadHelper = {
  uploadSingleFile: upload.single("file"),

  // Delete existing file if it exists
  async replaceFile(oldFilePath, newFilePath) {
    try {
      if (oldFilePath && (await this.fileExists(oldFilePath))) {
        await fs.unlink(oldFilePath);
      }
    } catch (error) {
      console.error("Error replacing file:", error);
    }
  },

  // Check if file exists
  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  },

  // Get file URL or local path
  getFileAccessPath(filePath) {
    return filePath ? `/uploads/${path.basename(filePath)}` : null;
  },
};

module.exports = FileUploadHelper;

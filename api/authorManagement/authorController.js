const Author = require("./authorModel");
const REST_API = require("../../utils/curdHelper");
const fs = require("fs").promises;
const path = require("path");

const authorController = {
    createAuthor: async(req,res) =>{
        try {
            const profilePic = req.file 
              ? `${req.protocol}://${req.get('host')}/uploads/${path.basename(req.file.path)}`
              : null; 
        
            const data = {
              ...req.body,
              profilePic,
            };
        
            const newAuthor = await REST_API.create(Author, data);
            res.status(201).json(newAuthor);
          } catch (error) {
            if (req.file) {
              await fs.unlink(req.file.path); // Delete file on error
            }
            console.log(error);
            res.status(400).json({ error: error.message });
          }
    },
    getAuthors: async(req,res)=>{
        try {
            const condition = {
                page:req.query.page,
                limit:req.query.limit,
                search:req.query.search,
              }
        
              const categories = await REST_API.getAll(Author, condition);
              res.json(categories);
        } catch (error) {
            res.status(400).json({message:error.message})
        }
    },
    getAuthorById: async(req,res)=>{
        try {
            const response = await REST_API.getDataListByField(
              Author,
              "id",
              req.params.id
            );
            if (response[0]) {
              response[0].profilePic = response[0].profilePic
                ? `${response[0].profilePic}`
                : null;
            }
            res.json(response[0]);
          } catch (error) {
            res.status(404).json({ error: error.message });
          } 
    },
    updateAuthor: async (req, res) => {
        try {
          const author = await Author.findByPk(req.params.id);
          if (!author) {
            return res.status(404).json({ error: "author not found" });
          }
              
          // If there's a new file, delete the old one
          if (req.file && author.profilePic) {
            try {
              await fs.unlink(author.profilePic);
            } catch (error) {
              console.error("Error deleting old image:", error);
            }
          }
    
          const updateData = {
            ...req.body,
            ...(req.file && { profilePic: req.file.path.replace(/\\/g, "/") }),
          };
    
          await REST_API.update(Author, req.params.id, updateData);
    
          const updatedAuthor = await Author.findByPk(req.params.id);
          res.json({
            ...updatedAuthor.toJSON(),
            profilePic: updatedAuthor.profilePic
              ? `${req.protocol}://${req.get("host")}/${
                  updatedAuthor.profilePic
                }`
              : null,
          });
        } catch (error) {
          // Delete uploaded file if database operation fails
          if (req.file) {
            await fs.unlink(req.file.path);
          }
          res.status(500).json({ error: error.message });
        }
      },
      deleteAuthor: async (req, res) => {
        try {
          const author = await Author.findByPk(req.params.id);
          if (!author) {
            return res.status(404).json({ error: "Author not found" });
          }
    
          // Delete the associated image file if it exists
          if (author.profilePic) {
            try {
              await fs.unlink(author.profilePic);
            } catch (error) {
              console.error("Error deleting image:", error);
            }
          }
          await REST_API.delete(Author, req.params.id);
          res.status(200).send("deleted successfully");
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
      },

}

module.exports = authorController
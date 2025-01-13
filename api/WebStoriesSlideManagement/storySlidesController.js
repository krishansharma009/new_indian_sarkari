const WebStorySlide = require('./storySlides');
const REST_API = require('../../utils/curdHelper');
const fs = require("fs").promises;
const path = require("path")

const slidesController = {
    addSlidesToWebStory: async (req, res) => {
        try {
          const { webStoryId } = req.params;
      
          const uploadedFiles = req.files;
          const slideContents = req.body.content;
      
          if (!uploadedFiles || uploadedFiles.length === 0) {
            return res.status(400).json({ error: 'Slide images are required' });
          }
      
          if (!slideContents || slideContents.length !== uploadedFiles.length) {
            return res.status(400).json({ error: 'Number of content entries must match the number of uploaded images' });
          }
      
          // Preparing data for bulk creation
          const slideData = uploadedFiles.map((file, index) => ({
            content: slideContents[index] || '', // Ensure content is assigned
            imageUrl: `${req.protocol}://${req.get('host')}/uploads/${path.basename(file.path)}`, // Construct public URL, // Handle file path normalization
            order: index + 1, // Assigning order
            webStoryId, 
          }));
      
          // Insert multiple slides in one transaction
          const newSlides = await WebStorySlide.bulkCreate(slideData);
          res.status(201).json({ message: 'Slides added successfully', slides: newSlides });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },
      getAllSlidesForWebStory: async (req, res) => {
        try {
          const { webStoryId } = req.params;
      
          
          const slides = await WebStorySlide.findAll({
            where: { webStoryId },
            order: [['order', 'ASC']], 
          });
      
          if (slides.length === 0) {
            return res.status(404).json({ message: 'No slides found for this story' });
          }
      
          res.status(200).json({ slides });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },
      deleteSlide: async (req, res) => {
        try {
          const { slideId } = req.params;
          const slide = await WebStorySlide.findByPk(slideId);
      
          if (!slide) {
            return res.status(404).json({ error: 'Slide not found' });
          }
      
          // Delete the image file associated with the slide if it exists
          if (slide.imageUrl) {
            const slideImagePath = path.join(__dirname, '../../uploads', path.basename(slide.imageUrl));
            try {
              await fs.unlink(slideImagePath);
            } catch (error) {
              console.error('Error deleting slide image:', error.message);
            }
          }
          await REST_API.delete(WebStorySlide, slideId);
          res.status(200).json({ message: 'Slide deleted successfully' });
        } catch (error) {
          console.log(error);
          res.status(500).json({ error: error.message });
        }
      }
      
}

module.exports = slidesController
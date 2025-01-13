const WebStory = require('./story');
const REST_API = require('../../utils/curdHelper');
const fs = require("fs").promises;
const path = require("path")

const storyController= {

createStory: async(req,res)=>{
  try {
    const coverImageUrl = req.file 
      ? `${req.protocol}://${req.get('host')}/uploads/${path.basename(req.file.path)}`
      : null; // Handle uploaded cover image path

    const storyData = {
      ...req.body,
      coverImageUrl,
    };

    const newStory = await REST_API.create(WebStory, storyData);
    res.status(201).json(newStory);
  } catch (error) {
    if (req.file) {
      await fs.unlink(req.file.path); // Delete file on error
    }
    console.log(error);
    res.status(400).json({ error: error.message });
  }
},
getStories: async (req, res) => {
  try {
    const queryOptions = {
      // Parse query parameters for pagination, filtering, etc.
      page: req.query.page || 1,
      limit: req.query.limit || 10,
      search: req.query.search || '',
    };

    const stories = await REST_API.getAll(WebStory, queryOptions);

    // Modify the response to include full URLs for coverImageUrl
    const updatedStories = stories.rows.map((story) => ({
      ...story.toJSON(),
      coverImageUrl: story.coverImageUrl
        ? `${req.protocol}://${req.get('host')}/${story.coverImageUrl}`
        : null,
    }));

    res.status(200).json({
      rows: updatedStories,
      count: stories.count,
      totalPages: stories.totalPages,
      currentPage: stories.currentPage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
},
getStoryById: async (req, res) => {
  try {
    const { id } = req.params;
    const story = await WebStory.findByPk(id, {
      include: {
        association: 'WebStorySlides', // Assuming you have an association set up for slides
      },
    });

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    // Format the response to include the full URL for coverImageUrl
    const formattedStory = {
      ...story.toJSON(),
      coverImageUrl: story.coverImageUrl
        ? `${req.protocol}://${req.get('host')}/${story.coverImageUrl}`
        : null,
    };

    res.status(200).json(formattedStory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
},
deleteStory: async (req, res) => {
  try {
    const { id } = req.params;
    
    // Fetch the story to check if it exists and get the image path
    const story = await WebStory.findByPk(id, {
      include: {
        association: 'WebStorySlides', // Fetch related slides if necessary
      },
    });

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    if (story.coverImageUrl) {
      const coverImagePath = path.join(__dirname, '../../uploads', path.basename(story.coverImageUrl));
      try {
        await fs.unlink(coverImagePath);
      } catch (error) {
        console.error('Error deleting cover image:', error.message);
      }
    }
    await REST_API.delete(WebStory, id);
    res.status(200).json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
}

module.exports = storyController
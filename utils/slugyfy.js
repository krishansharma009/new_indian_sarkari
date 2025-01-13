const slugify = require("slugify");
const { Op } = require("sequelize");

const generateUniqueSlug = async (model, titleOrSlug, existingId = null) => {
  // Generate slug from the titleOrSlug (manual or fallback to title)
  let baseSlug = slugify(titleOrSlug, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });

  let counter = 1;
  let uniqueSlug = baseSlug;

  while (true) {
    const whereCondition = {
      slug: uniqueSlug,
    };

    if (existingId) {
      whereCondition.id = { [Op.ne]: existingId };
    }

    const existingRecord = await model.findOne({ where: whereCondition });

    if (!existingRecord) {
      return uniqueSlug; // Return the first available unique slug
    }

    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }
};

module.exports = generateUniqueSlug;

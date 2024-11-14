const slugify = require("slugify");
const { Op } = require("sequelize");

const generateUniqueSlug = async (model, title,name, existingId = null) => {
  let slug = slugify(title+"-"+name, { lower: true, strict: true });
  let counter = 1;
  let uniqueSlug = slug;

  while (true) {
    const whereCondition = {
      slug: uniqueSlug,
    };

    if (existingId) {
      whereCondition.id = { [Op.ne]: existingId };
    }

    const existingRecord = await model.findOne({ where: whereCondition });

    if (!existingRecord) {
      return uniqueSlug;
    }

    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
};

module.exports = generateUniqueSlug;

const slugify = require("slugify");
const { Op } = require("sequelize");

const generateUniqueSlug = async (model, title, name, existingId = null) => {
  // Get current date for month and year
  const date = new Date();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  // Create base slug combining title, category, month, and year
  let baseSlug = slugify(`${title}-${name}`, {
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
      return uniqueSlug;
    }

    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }
};

module.exports = generateUniqueSlug;

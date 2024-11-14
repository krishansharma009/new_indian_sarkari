const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 17 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (request, response, next) => {
    logger.warn(`Rate limit exceeded for IP ${request.ip}`);
    response.status(429).send("Too many requests, please try again later.");
  },
});

module.exports = limiter;

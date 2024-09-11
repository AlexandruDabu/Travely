const rateLimit = require('express-rate-limit');

exports.specificLimiter = rateLimit({
    windowMs: 3 * 60 * 1000,
    max: 4,
    message: {
      status: 429,
      message:`Too many requests to this route, please try again later.`
    }
  })
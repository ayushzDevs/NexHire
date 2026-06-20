const { rateLimit, ipKeyGenerator } = require("express-rate-limit");

/**
 * @name analyzeRateLimiter
 * @description limits skill-gap analysis to 5 requests per 15 minutes per user
 */
const analyzeRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many analysis requests. Please wait 15 minutes and try again.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id || ipKeyGenerator(req.ip),
});

/**
 * @name resumeGenRateLimiter
 * @description limits ATS resume generation to 5 requests per 15 minutes per user
 */
const resumeGenRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many resume generation requests. Please wait 15 minutes and try again.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id || ipKeyGenerator(req.ip),
});

/**
 * @name uploadRateLimiter
 * @description limits resume uploads to 10 per 15 minutes per user
 */
const uploadRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    message: "Too many upload attempts. Please wait 15 minutes and try again.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id || ipKeyGenerator(req.ip),
});

module.exports = { analyzeRateLimiter, resumeGenRateLimiter, uploadRateLimiter };
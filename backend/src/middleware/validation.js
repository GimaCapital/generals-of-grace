const Joi = require('joi');

// Sermon validation schema
const sermonSchema = Joi.object({
  title: Joi.string().required().min(3).max(200),
  speaker: Joi.string().required().min(2).max(100),
  description: Joi.string().allow('').max(2000),
  date: Joi.date().required(),
  videoUrl: Joi.string().uri().allow(''),
  audioUrl: Joi.string().uri().allow(''),
  thumbnailUrl: Joi.string().uri().allow(''),
  scripture: Joi.array().items(Joi.string()),
  categories: Joi.array().items(Joi.string()),
  status: Joi.string().valid('draft', 'published'),
  isLive: Joi.boolean(),
});

// Event validation schema
const eventSchema = Joi.object({
  title: Joi.string().required().min(3).max(200),
  description: Joi.string().allow('').max(2000),
  date: Joi.date().required(),
  time: Joi.string().allow(''),
  venue: Joi.string().allow('').max(200),
  type: Joi.string().valid('service', 'conference', 'outreach', 'prayer_meeting'),
  registrationRequired: Joi.boolean(),
  capacity: Joi.number().integer().min(0).allow(null),
  status: Joi.string().valid('upcoming', 'ongoing', 'completed'),
  imageUrl: Joi.string().uri().allow(''),
});

// Giving validation schema
const givingSchema = Joi.object({
  amount: Joi.number().required().min(100).max(10000000),
  type: Joi.string().valid(
    'tithe', 
    'offering', 
    'building', 
    'mission', 
    'seed', 
    'thanksgiving',
    'custom'  // ✅ Added custom type
  ).required(),
  currency: Joi.string().default('NGN'),
  paymentMethod: Joi.string().valid('flutterwave', 'bank_transfer'),
  customTypeName: Joi.string().allow('').max(100),  // ✅ For custom type name
});
// User validation schema
const userSchema = Joi.object({
  displayName: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  phoneNumber: Joi.string().allow(''),
  role: Joi.string().valid('member', 'pastor', 'admin'),
  address: Joi.object({
    street: Joi.string().allow(''),
    city: Joi.string().allow(''),
    state: Joi.string().allow(''),
    country: Joi.string().default('Nigeria'),
  }),
});

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

const validateSermon = validate(sermonSchema);
const validateEvent = validate(eventSchema);
const validateGiving = validate(givingSchema);
const validateUser = validate(userSchema);

module.exports = {
  validate,
  validateSermon,
  validateEvent,
  validateGiving,
  validateUser,
  sermonSchema,
  eventSchema,
  givingSchema,
  userSchema,
};
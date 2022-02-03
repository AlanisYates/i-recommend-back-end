const mongoose = require("mongoose");
const validator = require("validator");

const recommendationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please, include a name"],
  },
  rating: {
    type: Number,
    min: [0, "The minimum rating is 0"],
    max: [5, "The maximum rating is 5"],
  },
  generalLocation: String,
  address: {
    line1: String,
    line2: String,
    state: String,
    city: String,
    zip: {
      type: String,
      validate: [validator.isPostalCode, "Please, enter a valid postal code"],
    },
  },
  images: [String],
  description: {
    type: String,
    required: [true, "Please, include a description"],
  },
  cost: {
    type: String,
    enum: {
      values: ["low", "medium", "high", "free"],
      message: "Price can only be, low, medium, high, or free",
    },
  },
  businessType: String,
  website: String,
  googleMapsLink: String,
});

const RecommendationModel = new mongoose.model(
  "recModel",
  recommendationSchema
);

module.exports = RecommendationModel;

const mongoose = require("mongoose");
const validator = require("validator");

const itinSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please, include an itinerary name"],
  },
  recommendations: [String],
  orderOfRecs: [String],
  sortBy: String,
  description: String,
  origionalAuthor: String,
  public: {
    type: Boolean,
    default: false,
  },
  zip: {
    type: String,
    validate: function (zipcode) {
      return validator.isPostalCode(zipcode, "US");
    },
    message: "Please, enter a valid postal code",
  },
});

const ItinModel = mongoose.model("ItinModel", itinSchema);

module.exports = ItinModel;

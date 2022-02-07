const mongoose = require("mongoose");

const itinSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please, include an itinerary name"],
  },
  recommendations: [String],
});

const ItinModel = mongoose.model("ItinModel", itinSchema);

module.exports = ItinModel;

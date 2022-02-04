const mongoose = require("mongoose");

const ItinerarySchema = new mongoose.Schema({
  name: {
    String,
    required: [true, "Please, include a name"],
  },
});

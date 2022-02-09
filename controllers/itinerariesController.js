const ItinModel = require("../models/itinerariesModel");

exports.getItins = async function (req, res, next) {
  try {
    const itins = await ItinModel.find();

    res.status(200).json({
      status: "success",
      results: itins.length,
      data: {
        itineraries: itins,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.createItin = async function (req, res, next) {
  try {
    const body = {
      name: req.body.name,
      recommendations: req.body.recommendations,
      orderOfRecs: req.body.orderOfRecs,
      sortBy: req.body.sortBy,
      description: req.body.description,
      origionalAuthor: req.body.origionalAuthor,
      public: req.body.public,
      zip: req.body.zip,
    };

    const newItin = await ItinModel.create(body);

    res.status(201).json({
      status: "success",
      data: {
        newItin,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getItin = async function (req, res, next) {
  try {
    const id = req.params.id;

    const itin = await ItinModel.findById(id);

    if (!itin) {
      return next(new Error("Itinerary ID is invalid."));
    }

    res.status(200).json({
      status: "success",
      data: {
        itin,
      },
    });
  } catch (err) {
    next(err);
  }
};

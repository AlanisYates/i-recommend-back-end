const ItinModel = require("../models/itinerariesModel");

exports.getItins = async function (req, res, next) {
  try {
    const itins = await ItinModel.find();

    res.status(200).json({
      status: "success",
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

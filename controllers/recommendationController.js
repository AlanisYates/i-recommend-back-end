const RecModel = require("../models/recommendationModel");

module.exports = async function createRec(req, res, next) {
  try {
    const body = {
      name: req.body.name,
      generalLocation: req.body.generalLocation,
      address: req.body.address,
      images: req.body.images,
      description: req.body.description,
      cost: req.body.cost,
      businessType: req.body.businessType,
      website: req.body.website,
      googleMapsLink: req.body.googleMapsLink,
    };

    const newRec = await RecModel.create(body);

    res.status(201).json({
      status: "success",
      data: {
        recommendation: newRec,
      },
    });
  } catch (err) {
    next(err);
  }
};

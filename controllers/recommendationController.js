const RecModel = require("../models/recommendationModel");

exports.createRec = async function (req, res, next) {
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
      notes: req.body.notes,
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

exports.getRec = async function (req, res, next) {
  try {
    const id = req.params.id;
    const rec = await RecModel.findById(id);

    if (!rec) {
      return next(new Error("Recommendation ID is invalid."));
    }

    res.status(200).json({
      status: "success",
      data: {
        recommendation: rec,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getRecs = async function (req, res, next) {
  try {
    const recs = await RecModel.find();

    res.status(200).json({
      status: "success",
      results: recs.length,
      data: {
        recommendations: recs,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateRec = async function (req, res, next) {
  try {
    const id = req.params.id;

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
      notes: req.body.notes,
    };

    const updatedRec = await RecModel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedRec) {
      return next(new Error("Recommendation ID is invalid."));
    }

    res.status(201).json({
      status: "success",
      data: {
        recommendation: updatedRec,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteRec = async function (req, res, next) {
  try {
    const id = req.params.id;

    const rec = await RecModel.findByIdAndDelete(id);

    if (!rec) {
      return next(new Error("Recommendation ID is invalid."));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

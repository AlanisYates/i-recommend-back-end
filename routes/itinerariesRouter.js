const express = require("express");

const itinController = require("../controllers/itinerariesController");

const router = express.Router();

router.route("/").get(itinController.getItins).post(itinController.createItin);

module.exports = router;

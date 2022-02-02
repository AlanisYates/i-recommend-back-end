const express = requrie("express");
const recController = require("../controllers/recommendationController");

const router = express.Router();

router.route("/").post(recController.createRec);

module.exports = router;

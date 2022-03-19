const router = require("express").Router()
const ObservationController = require('../controller/ObservationController');

router.post("/baseR4/Observation", ObservationController.createObeservation)

router.get("/baseR4/Observation/:id", ObservationController.getObservationById)

module.exports = router
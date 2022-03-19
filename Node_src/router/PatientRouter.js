const router = require("express").Router()
const PatientController = require('../controller/PatientController');

router.post("/baseR4/Patient", PatientController.createPatient)

router.get("/baseR4/Patient/:id", PatientController.getPatientById)

module.exports = router
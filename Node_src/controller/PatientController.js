const PatientSchema = require('../model/patient/Patient.js');

class PatientController {

    async createPatient(req, res) {
        try {
            let patient = req.body;
            const result = await PatientSchema.create(patient);
            return res.status(201).json(result);
        } catch (error) {
            console.log(error);
        }
    }

    async getPatientById(req, res) {
        try {
            const result = await PatientSchema.findById(req.params.id).exec();
            console.log(result)
            if (result == null) {
                return res.status(404).json("Patient not found");
            }
            return res.json(result);
        } catch (error) {
            return res.status(404).json("Patient not found");
        }
    }
}

module.exports = new PatientController();
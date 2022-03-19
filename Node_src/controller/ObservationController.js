const ObservationSchema = require('../model/observation/Observation.js');
const PatientSchema = require('../model/patient/Patient');

class ObservationController {

    async createObeservation(req, res) {
        let observation = req.body;
        let patientReference = observation.subject.reference;
        let patientId = patientReference.split("/")[1];

        try {
            const patient = await PatientSchema.findById(patientId).exec();
        } catch (error) {
            return res.status(404).json("Patient not found");
        }
        
        observation.subject.reference = `${process.env.HOST}/baseR4/Patient/${patientId}`;

        try {
            const result = await ObservationSchema.create(observation);
            return res.status(201).json(result);
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    }

    async getObservationById(req, res) {
        try {
            const result = await ObservationSchema.findById(req.params.id).exec();
            return res.json(result);
        } catch (error) {
            return res.status(404).json("Observation not found");
        }
    }
}

module.exports = new ObservationController();
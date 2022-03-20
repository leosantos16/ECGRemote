const ObservationSchema = require('../model/observation/Observation.js');
const PatientSchema = require('../model/patient/Patient');

class ObservationController {

    async createObeservation(req, res) {
        let observation = req.body;
        let patientReference = observation.subject.reference;
        let patientId = patientReference.split("/")[1];

        try {
            if (patientId.match(/^[0-9a-fA-F]{24}$/)) {
                const patient = await PatientSchema.findById(patientId).exec();
                if (patient == null) {
                    return res.status(404).json("Patient not found");
                }
            } else {
                return res.status(404).json("Patient not found");
            }

        } catch (error) {
            return res.status(500).json(error);
        }


        observation.subject.reference = `Patient/${patientId}`;

        try {
            const result = await ObservationSchema.create(observation);
            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    async updateObservation(req, res) {

        let observation = req.body;

        if (observation.subject != undefined || observation.subject != null) {
            let patientReference = observation.subject.reference;
            let patientId = patientReference.split("/")[1];
            try {
                if (patientId.match(/^[0-9a-fA-F]{24}$/)) {
                    console.log("Entrou aqui")
                    const patient = await PatientSchema.findById(patientId).exec();
                    if (patient == null) {
                        return res.status(404).json("Patient not found");
                    }
                } else {
                    return res.status(404).json("Patient not found");
                }
            } catch (error) {
                return res.status(500).json(error);
            }
            observation.subject.reference = `/Patient/${patientId}`;
        }

        try {
            const toGetComponentData = await ObservationSchema.findById(req.params.id).exec();
            observation.component = [...toGetComponentData.component, ...observation.component];
            const updated = await ObservationSchema.updateOne({ _id: req.params.id }, observation)
            return res.status(200).json(updated)
        } catch (error) {
            console.log(error)
            res.status(500).json({ erro: error })
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
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



    async patchComponent(req, res) {
        let component = req.body;
        console.log(component);
        try {
            const observation = await ObservationSchema.findById(req.params.id).exec();
            if (observation == null) {
                return res.status(404).json("Observation not found");
            }
            console.log(observation.component);
            observation.component = [...observation.component, ...component];
            const updated = await ObservationSchema.updateOne({ _id: req.params.id }, observation)
            if(updated.nModified == 1 ){
                return res.status(200).json(observation)
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }


    }

    async getObservationById(req, res) {
        console.log("chamando by id")
        try {
            const result = await ObservationSchema.findById(req.params.id).exec();
            if (result == null) {
                return res.status(404).json("Observation not found");
            }
            return res.json(result);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

}

module.exports = new ObservationController();
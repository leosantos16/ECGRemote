const ObservationSchema = require('../model/observation/Observation.js');

class ObservationController {
    
    async createObeservation(req, res){
       
        try {
            let observation = req.body;
            const result = await ObservationSchema.create(observation);
            return res.status(201).json(result);
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    }

    async getObservationById(req, res){
        try {
            const result = await ObservationSchema.findById(req.params.id).exec();
            return res.json(result);
        } catch (error) {
            return res.status(404).json("Observation not found");
        }
    }
}

module.exports = new ObservationController();
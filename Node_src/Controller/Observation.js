const ObservationService = require('../service/Observation');

class ObservationController {
  async createObeservation(req, res) {
    try {
      const result = await ObservationService.createObeservation(req.body);
      return res.status(201).json(result);
    } catch (e) {
      if (e.message == 'Patient not found')
        res.status(404).json('Patient not found');
      else res.status(500).json(e);
    }
  }

  async patchComponent(req, res) {
    const body = req.body;
    const id = req.params.id;
    const result = await ObservationService.patchComponent(body, id);
    res.status(200).json(result);
  }

  // async patchComponent(req, res) {
  //     const component = req.body.component;
  //     const id = req.params.id;
  //     try {
  //         const result = await ObservationService.patchComponent(component, id);
  //         res.json(result);
  //     }catch (e) {
  //         if (e.message == "Observation not found")
  //             res.status(404).json("Observation not found")
  //         else
  //             res.status(500).json(e)
  //     }
  //
  // }

  async getObservationById(req, res) {
    try {
      const result = await ObservationService.getObservationById(req.params.id);
      if (result === null) {
        res.status(404).json('Observation not found');
      } else {
        res.json(result);
      }
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getObservation(req, res) {
    try {
      const result = await ObservationService.getObservation(req.query);
      if (result === null) {
        res.status(404).json('Observation not found');
      } else {
        res.json({
          resourceType: 'Bundle',
          entry: result,
        });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json(e);
    }
  }

  async updateObservation(req, res) {
    const observation = req.body;
    const id = req.params.id;
    try {
      const result = await ObservationService.updateObservation(
        observation,
        id
      );
      res.json(result);
    } catch (e) {
      if (e.message == 'Observation not found') {
        res.status(404).json('Observation not found');
      } else {
        res.status(500).json({ message: e.message });
      }
    }
  }

  async deleteObservation(req, res) {
    const id = req.params.id;
    try {
      const result = await ObservationService.delete(id);
      if (result) {
        res.json('Deletado com sucesso');
      } else {
        res.status(404).json(`Observation not found`);
      }
    } catch (e) {
      res.status(500).json(e);
    }
  }
}

module.exports = new ObservationController();

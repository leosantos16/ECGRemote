const PatientDatabase = require('../Database/FHIRResource/Patient')();

class PatientService {
  async create(patient) {
    try {
      const result = await PatientDatabase.create(patient);
      console.log(result);
      return result;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async find() {
    try {
      const result = await PatientDatabase.find();
      return result;
    } catch (e) {
      return e;
    }
  }

  async findById(id) {
    try {
      const result = await PatientDatabase.findById(id);
      return result;
    } catch (e) {
      return e;
    }
  }
  async remove(id) {
    try {
      const result = await PatientDatabase.deleteOne(id);
      return result;
    } catch (e) {
      return e;
    }
  }
}

module.exports = new PatientService();

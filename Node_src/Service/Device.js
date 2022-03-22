const DeviceDatabase = require('../Database/FHIRResource/Device')();

class DeviceService {
  async create(device) {
    try {
      const result = await DeviceDatabase.create(device);
      return result;
    } catch (e) {
      return e;
    }
  }
}

module.exports = new DeviceService();

const jwt = require('jsonwebtoken');
const axios = require('axios').default;
const AuthDatabase = require('../Database/Auth')();
const PatientService = require('./Patient');

class AuthService {
  async register(body) {
    try {
      await AuthDatabase.create(body);
      const patient = await PatientService.findOne();
      const code = jwt.sign(
        { patient: patient.id, scope: body.scope },
        'my_secret',
        {
          expiresIn: 300,
        }
      );
      return {
        patient,
        code,
      };
    } catch (e) {
      return e;
    }
  }

  async token(body) {
    if (body.code == null) {
      return {
        code: 400,
        message: 'Invalid params',
      };
    }
    try {
      const decodedJWT = jwt.decode(body.code);
      console.log(decodedJWT);
      const result = await AuthDatabase.findOne({
        client_id: body.client_id,
      });
      console.log(result);
      if (result !== null) {
        const access_token = jwt.sign(
          { id: result.id, scope: body.scope },
          'my_secret',
          {
            expiresIn: 300,
          }
        );
        return {
          access_token,
          token_type: 'bearer',
          expires_in: 3600,
          scope: decodedJWT.scope,
          patient: decodedJWT.patient,
          client_id: body.client_id,
        };
      }
      return {
        code: 401,
        message: 'Invalid user',
      };
    } catch (e) {
      console.log(e);
      return {
        code: 401,
        message: 'Invalid auth',
      };
    }
  }
}

module.exports = new AuthService();

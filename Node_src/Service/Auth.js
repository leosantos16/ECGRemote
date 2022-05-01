const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mongoose = require('mongoose');
const AuthDatabase = require('../Database/Auth')();
const PacienteService = require('./Pacientes');
const PatientService = require('./Patient');
const { checkScope } = require('../utils/Auth');

class AuthService {
  async login(body) {
    try {
      const login = await PacienteService.find({
        cpf: body.cpf,
        senha: crypto.createHash('md5').update(body.senha).digest('hex'),
      });
      if (login.length === 0) {
        return {
          code: 401,
          message: 'Login not found',
        };
      }

      const checkScopes = checkScope(body.scope);
      if (checkScopes[2] || checkScopes[4] || checkScopes[5]) {
        return {
          code: 401,
          error: 'User flow clients do not have write permission',
        };
      }

      const auth = await AuthDatabase.find({
        client_id: body.client_id,
        paciente_id: login[0]._id,
      });
      if (auth.length === 0) {
        return {
          login: login[0],
        };
      }

      const patient = await PatientService.findOne({
        identifier: {
          $elemMatch: {
            value: mongoose.Types.ObjectId(login[0]._id),
          },
        },
      });
      const code = jwt.sign(
        { patient: patient.id, scope: auth.scope },
        `${process.env.OAUTH_SECRET}`,
        {
          expiresIn: 300,
        }
      );
      return {
        code,
        login: login[0],
      };
    } catch (e) {
      return e;
    }
  }

  async authorize(params) {
    try {
      const auth = await AuthDatabase.create({
        aud: params.aud,
        scope: params.scope,
        client_id: params.client_id,
        state: params.state,
        redirect_uri: params.redirect_uri,
        paciente_id: params.paciente_id,
      });
      const patient = await PatientService.findOne({
        identifier: {
          $elemMatch: {
            value: mongoose.Types.ObjectId(params.paciente_id),
          },
        },
      });
      const code = jwt.sign(
        { patient: patient.id, scope: auth.scope },
        `${process.env.OAUTH_SECRET}`,
        {
          expiresIn: 300,
        }
      );
      return {
        params,
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
      const result = await AuthDatabase.findOne({
        client_id: body.client_id,
      });
      const decodedJWT = jwt.decode(body.code);
      let arrayScopes = result.scope.split(' ');
      if (decodedJWT.scope !== undefined) {
        arrayScopes = decodedJWT.scope.split(' ');
      }
      if (result === null) {
        return {
          code: 401,
          message: 'Invalid user',
        };
      }

      const patient = await PatientService.findById(decodedJWT.patient);
      const access_token = jwt.sign(
        {
          scope: decodedJWT.scope,
          patient: decodedJWT.patient,
          client_id: body.client_id,
          expires_in: 3600,
        },
        `${process.env.OAUTH_SECRET}`,
        {
          expiresIn: 3600,
        }
      );
      const retorno = {
        access_token,
        token_type: 'bearer',
        expires_in: 3600,
        scope: decodedJWT.scope,
        patient: decodedJWT.patient,
        client_id: body.client_id,
      };
      if (arrayScopes.includes('openid')) {
        retorno.id_token = jwt.sign(
          {
            name: patient.name.use,
            given_name: patient.name.given,
            family_name: patient.name.family,
            profile: `${process.env.DEFAULT_URL}/Patient/${patient.id}`,
          },
          `${process.env.OAUTH_SECRET}`,
          { expiresIn: 3600 }
        );
      }
      if (arrayScopes.includes('launch/patient')) {
        retorno.patient = patient.id;
      }
      return retorno;
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

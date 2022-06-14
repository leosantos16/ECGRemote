const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mongoose = require('mongoose');
const AuthDatabase = require('../database/Auth')();
const PacienteService = require('./Pacientes');
const MedicoService = require('./Medicos');
const PatientService = require('./Patient');
const { checkScope } = require('../utils/Auth');

class AuthService {
  async login(body) {
    try {
      let login = await PacienteService.find({
        cpf: body.cpf,
        senha: crypto.createHash('md5').update(body.senha).digest('hex'),
      });
      if (login.length === 0) {
        login = await MedicoService.find({
          cpf: body.cpf,
          senha: crypto.createHash('md5').update(body.senha).digest('hex'),
        });
        if (login.length === 0) {
          return {
            code: 401,
            message: 'Login not found',
          };
        }
        return {
          medico: true,
          login: login[0],
        };
      }

      const checkScopes = checkScope(body.scope);
      if (checkScopes[2] || checkScopes[4] || checkScopes[5]) {
        return {
          code: 401,
          message: 'User flow clients do not have write permission',
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

  async select(body) {
    const patient = await PatientService.findById(body.patient);
    const code = jwt.sign(
      { patient: patient.id, scope: body.scope },
      `${process.env.OAUTH_SECRET}`,
      {
        expiresIn: 300,
      }
    );
    return {
      params,
      code,
    };
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
      if (decodedJWT.grant_type === 'authorization_code') {
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
      } else if (decodedJWT.grant_type === 'client_credentials') {
        const access_token = jwt.sign(
          {
            scope: decodedJWT.scope,
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
          client_id: body.client_id,
        };
        return retorno;
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

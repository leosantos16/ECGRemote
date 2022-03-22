const jwt = require('jsonwebtoken');
const axios = require('axios').default;
const AuthDatabase = require('../Database/Auth')();

class AuthService {
  async register(body) {
    try {
      const result = await AuthDatabase.create(body);
      return result.id;
    } catch (e) {
      return e;
    }
  }

  async token(body) {
    if (body.client_assertion == null) {
      return {
        code: 400,
        message: 'Invalid params',
      };
    }
    try {
      const decodedJWT = jwt.decode(body.client_assertion);
      const result = await AuthDatabase.findOne({
        id: decodedJWT.client_id,
      });
      if (result.length > 0) {
        jwt.verify(body.client_assertion, result[0].jwks_uri);
        const access_token = jwt.sign(
          { id: result.id, scope: body.scope },
          process.env.SECRET,
          {
            expiresIn: 300,
          }
        );
        return {
          access_token,
          token_type: 'bearer',
          expires_in: 300,
          scope: body.scope,
        };
      }
      return {
        code: 401,
        message: 'Invalid user',
      };
    } catch (e) {
      return {
        code: 401,
        message: 'Invalid auth',
      };
    }
  }
}

module.exports = new AuthService();

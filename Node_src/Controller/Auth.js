const AuthService = require('../Service/Auth');

class AuthController {
  async register(req, res) {
    res.json(await AuthService.register(req.body));
  }

  async token(req, res) {
    res.json(await AuthService.token(req.query));
  }
}

module.exports = new AuthController();

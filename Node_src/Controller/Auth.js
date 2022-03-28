const AuthService = require('../Service/Auth');

class AuthController {
  async register(req, res) {
    const register = await AuthService.register(req.query);
    console.log(register);
    res.render('list', {
      base_url: req.query.redirect_uri,
      state: req.query.state,
      code: register.code,
      patient: register.patient,
    });
  }

  async token(req, res) {
    res.json(await AuthService.token(req.body));
  }
}

module.exports = new AuthController();

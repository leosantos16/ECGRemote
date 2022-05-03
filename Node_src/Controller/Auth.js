const AuthService = require('../Service/Auth');

class AuthController {
  async register(req, res) {
    const { redirect_uri, state, aud, scope, client_id } = req.query;
    res.redirect(
      `/auth/login?redirect_uri=${redirect_uri}&state=${state}&aud=${aud}&scope=${scope}&client_id=${client_id}`
    );
  }

  login(req, res) {
    const { redirect_uri, state, aud, scope, client_id } = req.query;
    res.render('login', {
      redirect_uri,
      state,
      aud,
      scope,
      client_id,
    });
  }

  async postLogin(req, res) {
    const { redirect_uri, state, aud, scope, client_id } = req.body;
    const login = await AuthService.login(req.body);
    if (login.code && login.code === 401) {
      res.status(401).json({
        code: login.code,
        message: login.message,
      });
      return;
    }
    if (login.code) {
      res.redirect(`${redirect_uri}?state=${state}&code=${login.code}`);
      return;
    }
    res.redirect(
      `/auth/authorize?redirect_uri=${redirect_uri}&state=${state}&paciente_id=${login.login._id}&aud=${aud}&scope=${scope}&client_id=${client_id}`
    );
  }

  authorize(req, res) {
    const { redirect_uri, state, aud, scope, client_id, paciente_id } =
      req.query;
    res.render('auth', {
      redirect_uri,
      state,
      paciente_id,
      aud,
      scope,
      client_id,
    });
  }

  async postAuthorize(req, res) {
    const { redirect_uri, state } = req.body;
    const auth = await AuthService.authorize(req.body);
    res.redirect(`${redirect_uri}?state=${state}&code=${auth.code}`);
  }

  async token(req, res) {
    res.json(await AuthService.token(req.body));
  }
}

module.exports = new AuthController();

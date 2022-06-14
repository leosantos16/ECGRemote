const AuthService = require('../Service/Auth');
const PatientService = require('../Service/Patient');

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
    if (login.medico) {
      res.redirect(
        `/auth/list?redirect_uri=${redirect_uri}&state=${state}&medico_id=${login.login._id}&aud=${aud}&scope=${scope}&client_id=${client_id}`
      );
      return;
    }
    res.redirect(
      `/auth/authorize?redirect_uri=${redirect_uri}&state=${state}&paciente_id=${login.login._id}&aud=${aud}&scope=${scope}&client_id=${client_id}`
    );
  }

  async list(req, res) {
    const { redirect_uri, state, aud, scope, client_id, medico_id } = req.query;
    const patients = await PatientService.find();
    res.render('list', {
      redirect_uri,
      state,
      medico_id,
      aud,
      scope,
      client_id,
      patients,
    });
  }

  async select(req, res) {
    const { redirect_uri, state } = req.body;
    const auth = await AuthService.select(req.body);
    res.redirect(`${redirect_uri}?state=${state}&code=${auth.code}`);
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

const router = require('express').Router();

const AuthController = require('../Controller/Auth');

router.post('/register', (req, res) => {
  AuthController.register(req, res);
});

router.post('/token', (req, res) => {
  AuthController.token(req, res);
});

module.exports = router;

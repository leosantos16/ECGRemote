const router = require('express').Router();
const jwt = require('jsonwebtoken');
const set_data = require('./class');

const pacientesRouter = require('./Routes/Pacientes');

const patientRouter = require('./Routes/Patient');
const deviceRouter = require('./Routes/Device');

const authRouter = require('./Routes/Auth');
const { verifyJWT } = require('./utils/Auth');
const wellKnown = require('./utils/wellKnown');
const key = require('./utils/key');

router.get('/key', (req, res) => {
  res.json(key);
});

router.use('/auth', authRouter);

router.use('/Paciente', verifyJWT, pacientesRouter);

router.use('/Patient', verifyJWT, patientRouter);
router.use('/Device', verifyJWT, deviceRouter);

router.get('/render', (req, res) => {
  const data = new set_data(req.query['id']);

  res.json({ res: JSON.parse(data.getShaHead()) });
});

router.get('/dashboard', (req, res) => {
  res.render('index');
});

router.get('/.well-known/smart-configuration', (req, res) => {
  res.json(wellKnown);
});

router.get('/', (req, res) => {
  res.json({ res: res.statusCode });
});

module.exports = router;

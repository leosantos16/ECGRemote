const router = require('express').Router();
const set_data = require('./class');

const patientRouter = require('./Routes/Patient');
const deviceRouter = require('./Routes/Device');

const authRouter = require('./Routes/Auth');

function verifyJWT(req, res, next) {
  const token = req.headers['Authorization'];
  if (!token)
    return res.status(401).json({ auth: false, message: 'No token provided.' });

  jwt.verify(token, process.env.SECRET, function (err, decoded) {
    if (err)
      return res
        .status(500)
        .json({ auth: false, message: 'Failed to authenticate token.' });
    req.userId = decoded.id;
    next();
  });
}

router.use('/auth', authRouter);

router.use('/test', verifyJWT, (req, res) => console.log(req));

router.use('/Patient', patientRouter);
router.use('/Device', deviceRouter);

router.get('/render', (req, res) => {
  const data = new set_data(req.query['id']);

  res.json({ res: JSON.parse(data.getShaHead()) });
});

router.get('/.well-known/smart-configuration', (req, res) => {
  res.json({
    authorization_endpoint: 'http://localhost:8000/auth/register',
    token_endpoint: 'http://localhost:8000/auth/token',
    token_endpoint_auth_methods_supported: ['private_key_jwt'],
    grant_types_supported: ['authorization_code', 'client_credentials'],
    scopes_supported: ['patient/*.rs'],
    response_types_supported: ['code'],
    capabilities: ['client-confidential-asymmetric'],
    code_challenge_methods_supported: ['S256'],
    token_endpoint_auth_signing_alg_values_supported: ['RS384', 'ES384'],
  });
});

router.get('/', (req, res) => {
  res.json({ res: res.statusCode });
});

module.exports = router;

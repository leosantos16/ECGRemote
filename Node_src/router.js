const router = require('express').Router();
const jwt = require('jsonwebtoken');
const set_data = require('./class');

const patientRouter = require('./Routes/Patient');
const deviceRouter = require('./Routes/Device');

const authRouter = require('./Routes/Auth');

function verifyJWT(req, res, next) {
  const token = req.headers['authorization'];
  if (!token)
    return res.status(401).json({ auth: false, message: 'No token provided.' });

  jwt.verify(token, process.env.OAUTH_SECRET, function (err, decoded) {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ auth: false, message: 'Failed to authenticate token.' });
    }
    req.userId = decoded.id;
    next();
  });
}

router.get('/key', (req, res) => {
  res.json({
    kty: 'RSA',
    e: 'AQAB',
    use: 'sig',
    kid: '623a20795e7bbc86915e9a0a',
    alg: 'RS384',
    n: 'gINK0kobY6jLUiGvRNdOn0jCBWW-_4mtz5IFGdZgesP_NGBhu_SZ5HUTUHh0UAC0Xr7bUKJAJMEWzy7_rrZZIHg7IhvuhEOC3nzXrux1hGPrVy7jrZwaeTwzrVfKyY4LHMKOirinoj77P0jv85LKFzwo1WOnbQaZeFLvjYXPzgw0IfrEVIuBz0PAGTsCFOXnskkd6P_L4Zt5T_RfncxC_RyYo3yTfFPscrHvIedLMyhFTgTD5a34nVMqqAHl5pHmxEaw48waJCQP1poTwkpWkokoKQHXhtUF1blc2XQ-z5FK3et-_O2h1mJJciZwvg5LosJRg0f7YPH6RVr5hAVI0Q',
  });
});

router.use('/auth', authRouter);

router.use('/test', verifyJWT, (req, res) => res.send(200));

router.use('/Patient', patientRouter);
router.use('/Device', deviceRouter);

router.get('/render', (req, res) => {
  const data = new set_data(req.query['id']);

  res.json({ res: JSON.parse(data.getShaHead()) });
});

router.get('/dashboard', (req, res) => {
  res.render('index');
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

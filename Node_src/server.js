const app = require('express')();
const router = require('./router');
const bp = require('body-parser');

require('dotenv').config();

const mongoDB = require('./Database/mongo');

mongoDB.mongodb.once('open', (_) => {
  console.log('Mongo Conectado');
});

let allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'origin, authorization, accept, content-type, x-requested-with'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'GET, HEAD, POST, PUT, DELETE, TRACE, OPTIONS'
  );
  res.header('Access-Control-Allow-Origin', '*');
  next();
};

app.use(allowCrossDomain);

app.set('view engine', 'html');

app
  .use(bp.json())
  .use(bp.urlencoded({ extended: true }))
  .use(router);

app.listen(process.env.SERVER_PORT, () => {
  console.log('server started');
});

const app = require('express')();
const router = require('./router');
const bp = require('body-parser');
const cors = require('cors');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mongoDB = require('./database/mongo');
const { checkScope } = require('./utils/Auth');

mongoDB.mongodb.once('open', (_) => {
  console.log('Mongo Conectado');
});

app.use(cors());
app.set('view engine', 'ejs');
app.locals.checkScope = checkScope;

app
  .use(bp.json())
  .use(bp.urlencoded({ extended: true }))
  .use(router);

app.listen(process.env.SERVER_PORT, () => {
  console.log('server started');
});

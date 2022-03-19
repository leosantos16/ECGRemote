const app = require("express")()
require("dotenv").config()
const bp = require('body-parser')

const router = require('./router')
const mongoDB = require('./database/mongo')

const patientRouter = require('./router/PatientRouter')
const observationRouter = require('./router/ObservationRouter')
const ObservationController = require("./controller/ObservationController")

mongoDB.mongodb.once("open", _ => {
  console.log("Mongo Conectado")
})

let allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', "*");
  next();
}

app.use(allowCrossDomain);

app.set('view engine', 'html')

app.use(bp.json())
  .use(bp.urlencoded({ extended: true }))
  .use(patientRouter)
  .use(observationRouter)


app.listen(process.env.SERVER_PORT, () => {
  console.log("server started")
})

const mongoose = require("mongoose")

const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env

let connString = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/?authSource=admin`
console.log(connString)

// mongodb://username:password@host:port

class dbConnect{
    constructor(){
        mongoose.connect(connString, {dbName : DB_NAME, useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
        // mongoose.connect(process.env.URL_BASE, {dbName : process.env.MONGO_DB_URL, useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})

        this.mongodb = mongoose.connection;

    }
}

module.exports = new dbConnect()
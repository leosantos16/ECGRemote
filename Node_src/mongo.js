require('dotenv').config({path:__dirname+'/.env'})
const mongoose = require("mongoose")

const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env

let connString = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/?authSource=admin`
// let connString = `mongodb://root:password@localhost:27017/?authSource=admin`
//let connString = "mongodb://root:password@localhost:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"


// mongodb://username:password@host:port

class dbConnect{
    
    constructor(){
        console.log(connString)
        mongoose.connect(connString, {dbName : DB_NAME, useNewUrlParser: true, useUnifiedTopology: true})
    

        this.mongodb = mongoose.connection;

    }
}

module.exports = new dbConnect()
const router = require("express").Router()
const set_data  = require("./class")

const fs = require("fs")
const path = require("path")
let event = require("events")

const examDBO = require("./database/Controller/exam")

const eventEmitter = new event.EventEmitter()

const {inspect} = require("util") 

// Criar um arquivo para cada transmissao de dados
// criar um timeout de conexao
// criar o link pro txt da req na rota /seetxt

//Rotas para mongoDB

router.post("/save_exam", (req,res) => {
    //res.json(req.body)
    examDBO.create(req.body,res)
})

router.post("/save_user", (req,res) => {
    res.json("teste")
})
router.delete("/:user/exams/:id/remove", (req,res) => {
    examDBO.removeExam(req,res)
})

router.get("/:user/exams/update/:id", (req,res) => {
    //res.json(req.query)
    examDBO.findAndUpdate(req,res)
})

router.get("/list_all", (req,res) => {
    examDBO.find(req.query,res)
})

router.get("/:user/exams/:id", (req,res) =>{
    examDBO.findById(req,res)
})

router.post("/update_exam/:id", (req,res) => {

    examDBO.postUpdate(req,res)
})

router.get("/render",(req,res) => {
    const data = new set_data(req.query["id"])
    
    res.json({"res": JSON.parse(data.getShaHead())})
})


//Rota Raiz
router.get("/", (req,res) => {
    res.json({"res": res.statusCode})
})

module.exports = router
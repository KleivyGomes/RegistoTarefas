//Carregando módulos
const express = require("express")
const handlebars = require("express-handlebars")
const bodyParse = require("body-parser")
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
require("dotenv").config()

//configurações
//session
app.use(session({
    secret: process.env.SECRETKEY,
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

//Midleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next()
})
//bodyParse

app.use(bodyParse.urlencoded({ extended: true }))
app.use(bodyParse.json())

//handlebars
app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//Public
app.use(express.static(path.join(__dirname, 'public')))
//Rotas

app.use('/user', admin)
app.get('/', (req, res) => {
    req.session.user = 'User'
    req.session.logged = false
    res.render('admin/login')
})
//Outros
const port = 8081
app.listen(port, () => {
    console.log('Servidor Rodando')
})
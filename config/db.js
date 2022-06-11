require("dotenv").config()
const mysql = require('mysql2')

//Configurar acesso a base de dados
const pool = mysql.createPool({
    host: process.env.DB_host,
    user: process.env.DB_user,
    database: process.env.DB_database,
    password: process.env.DB_password,
})

module.exports = pool.promise()
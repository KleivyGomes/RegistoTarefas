const localStrategy = require("passport-local").Strategy
const mysql = require('mysql2')
const bcrypt = require('bcryptjs')


module.exports = function(passport){
    passport.use(new localStrategy({usernameField: user}),(email,senha,done) =>{
        Usuario
    })
}
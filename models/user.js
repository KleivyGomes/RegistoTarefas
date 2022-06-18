const db = require('../config/db')

// configurando modificadores da base de dados
class User {
    static save(usuario, password, user) {
        let sql = `INSERT INTO user(name,password,user_name) 
        VALUES('${usuario}','${password}','${user}');`
        return db.execute(sql)
    }
    static findAll() {
        let sql = `SELECT * FROM user;`
        return db.execute(sql)
    }
    static findOne(id) {
        let sql = `SELECT * FROM user where id = ${id};`
        return db.execute(sql)
    }
    static loginUser(user) {
        let sql = `SELECT * FROM user where user_name = '${user}';`
        return db.execute(sql)
    }
}

module.exports = User
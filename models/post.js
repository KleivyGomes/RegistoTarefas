const db = require('../config/db')

class Post {
    constructor(usuario, password, user) {
        this.usuario = usuario;
        this.password = password;
        this.user = user;
    }

    async save() {
        let sql = `INSERT INTO user(name,password,user_name) 
        VALUES('${this.usuario}','${this.password}','${this.user}');`
        const [newPost, _] = await db.execute(sql)
        return newPost
    }
    static findAll() {
        let sql = `SELECT * FROM user;`
        return db.execute(sql)
    }
    static findOne(id) {
        let sql = `SELECT * FROM user where id = ${id};`
        return db.execute(sql)
    }
    async savet(id_user, nome_tarefa, descricao_tarefa, data_tarefa) {
        let sql = `INSERT INTO lista_de_tarefas(user_id,Nome_tarefa,Descricao,data_tarefa) 
        VALUES('${id_user}','${nome_tarefa}','${descricao_tarefa}','${data_tarefa}');`
        const [newPost, _] = await db.execute(sql)
        return newPost
    }
    static findOnet(tipo, id) {
        let sql = `SELECT * FROM lista_de_tarefas where ${tipo} = ${id};`
        return db.execute(sql)
    }
    static DeleteT() {
        let sql = `DELETE FROM lista_de_tarefas;`
        return db.execute(sql)
    }
    static ResetID() {
        let sql = `ALTER TABLE lista_de_tarefas AUTO_INCREMENT = 1;`
        return db.execute(sql)
    }
    static DeleteOne(tabela, id, valor) {
        let sql = `DELETE FROM ${tabela} where ${id} = ${valor};`
        return db.execute(sql)
    }
    static loginUser(user) {
        let sql = `SELECT * FROM user where user_name = '${user}';`
        return db.execute(sql)
    }
}

module.exports = Post
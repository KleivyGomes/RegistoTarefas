const db = require('../config/db')

// configurando modificadores da base de dados
class Tarefa {
    static save(id_user, nome_tarefa, descricao_tarefa, data_tarefa) {
        let sql = `INSERT INTO lista_de_tarefas(user_id,Nome_tarefa,Descricao,data_tarefa) 
        VALUES('${id_user}','${nome_tarefa}','${descricao_tarefa}','${data_tarefa}');`
        return db.execute(sql)
    }
    static findOne(tipo, id) {
        let sql = `SELECT * FROM lista_de_tarefas where ${tipo} = ${id} ORDER BY data_tarefa ;`
        return db.execute(sql)
    }
    static Delete(id) {
        let sql = `DELETE FROM lista_de_tarefas where user_id = ${id};`
        return db.execute(sql)
    }
    static update(nome, descricao, data, id) {
        let sql = `UPDATE lista_de_tarefas set Nome_tarefa = '${nome}', descricao = '${descricao}', data_tarefa = '${data}' WHERE id_tarefa = ${id};`
        return db.execute(sql)
    }
    static DeleteOne(id, valor) {
        let sql = `DELETE FROM lista_de_tarefas where ${id} = ${valor};`
        return db.execute(sql)
    }
}

module.exports = Tarefa
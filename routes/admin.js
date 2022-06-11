const express = require('express')
const { route } = require('express/lib/application')
const { redirect } = require('express/lib/response')
const router = express.Router()
const mysql = require('../config/db').pool
const Post = require('../models/post')
const bcrypt = require('bcryptjs')

router.get('/tarefas', async (req, res) => {
    if(req.session.logged){
        const [Tarefas, _] = await Post.findOnet(req.session.user_id, 1)
        res.render('admin/tarefas', { Tarefas: Tarefas })
    }else{
        res.redirect('/')
    }
    
})

router.get('/tarefas/add', (req, res) => {
    res.render('admin/addtarefa')
})
router.get('/add', (req, res) => {
    res.render('admin/adduser')
})
router.post('/tarefas/nova', async (req, res) => {

    var erros = []
    if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        erros.push({ texto: "Nome Inválido!" })
    }

    if (!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) {
        erros.push({ texto: "Descricão Inválido!" })
    }

    if (!req.body.data || typeof req.body.data == undefined || req.body.data == null) {
        erros.push({ texto: "Data Inválido!" })
    }

    if (req.body.name.length < 3) {
        erros.push({ texto: "Nome Muito Pequeno!" })
    }
    if (req.body.descricao.length < 6) {
        erros.push({ texto: "Descrição Muito Pequeno!" })
    }
    if (req.body.data.length != 10) {
        erros.push({ texto: "Verifique a data inserida formato ####-##-##" })
    }

    if (erros.length > 0) {
        res.render("admin/addtarefa", { erros: erros })
    } else {
        console.log('Usuario criado')
        let post = new Post()
        await post.savet('1', req.body.name, req.body.descricao, req.body.data)
        req.flash("success_msg", "Tarefa criada com sucesso")
        res.redirect('/user/tarefas')
    }
})

router.post('/adduser/nova', async (req, res) => {
    var erros = []
    if (req.body.password != req.body.password2) {
        erros.push({ texto: "Passwords incompativeis!" })
    }
    if (!req.body.usuario || typeof req.body.usuario == undefined || req.body.usuario == null) {
        erros.push({ texto: "Usuario Inválido!" })
    }

    if (!req.body.user || typeof req.body.user == undefined || req.body.user == null) {
        erros.push({ texto: "User Inválido!" })
    }
    if (req.body.user.length < 6) {
        erros.push({ texto: "User Muito Pequeno!" })
    }
    if (req.body.usuario.length < 6) {
        erros.push({ texto: "Usuário Muito Pequeno!" })
    }
    if (req.body.password.length < 6) {
        erros.push({ texto: "Password Muito Pequeno!" })
    }

    if (erros.length > 0) {
        res.render("admin/adduser", { erros: erros })
    } else {
        let password = req.body.password
        bcrypt.genSalt(10, (erro, salt) => {
            bcrypt.hash(password, salt,async (erro, hash) => {
                if (erro) {
                    req.flash("error_msg", "houve erro no salvamento")
                    res.redirect("/")
                }
                password = hash
                let post = new Post(req.body.usuario, password, req.body.user)
                await post.save()
                req.flash("success_msg", "Usuário criada com sucesso")
                res.redirect('/')
            })
        })

    }


})

router.post('/login', async (req, res) => {
    var erros = []

    if (!req.body.user || typeof req.body.user == undefined || req.body.user == null) {
        erros.push({ texto: "* User vazio! Tente novamente!!!" })
    }

    if (!req.body.password || typeof req.body.password == undefined || req.body.password == null) {
        erros.push({ texto: "* Password vazio! Tente novamente!!!" })
    }

    const [user, _] = await Post.loginUser(req.body.user)
    if (user.length == 0) {
        erros.push({ texto: "* Credênciais Incorretas!!!" })
    }else{
        bcrypt.compare(req.body.password,user[0].password,(erro,resultado)=>{
            if(!resultado){
                erros.push({texto:'* Senha Incorreta'})   
            }
        })
    }
    
    if (erros.length > 0) {
        res.render("admin/login", { erros: erros })
    } else {
        req.session.user_id = user[0].id
        req.session.name = user[0].name
        req.session.logged = true

        req.flash("success_msg",`Bem Vindo!!! ${user[0].name}`)
        res.redirect('/user/tarefas')
    }
})

router.get('/tarefas/edit/:id', async (req, res) => {
    [Tarefa, _] = await Post.findOnet('id_tarefa', req.params.id)
    res.render('admin/editarefa', { tarefa: Tarefa })
})
router.post('/tarefas/confirmedit', (req, res) => {
    res.redirect('/user/tarefas')
})

router.get('/tarefas/delete/:id', (req, res) => {

    res.render('admin/deletetarefa', { id: req.params.id })
})
router.post('/tarefas/delete/confirm', async (req, res) => {
    await Post.DeleteOne('lista_de_tarefas', 'id_tarefa', req.body.id)
    res.redirect('/user/tarefas')
})


router.get('/tarefas/reset', async (req, res) => {
    if(req.session.logged){
        res.render('admin/reset')
    }else{
        res.redirect('/')
    }
    
})

router.post('/tarefas/reset/confirm', async (req, res) => {
    await Post.DeleteT()
    await Post.ResetID()
    req.flash("success_msg", "reset")
    res.redirect('/user/tarefas')
})

module.exports = router
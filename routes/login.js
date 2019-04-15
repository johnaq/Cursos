var express = require('express');
var path = require('path');
var fs = require('fs');
var bcrypt = require('bcryptjs');
var router = express.Router();

const Usuario = require('../models/usuarios');

router.get('/', function(req, res, next) {
    res.render('login/login', { title: 'Ingreso al sistema' });
});

router.post('/', function(req, res, next) {
    Usuario.findOne({docUsuario: req.body.docLogin}).exec((err, result) => {
        if (err) {            
            req.flash('mensajeError', err);
            return res.redirect('/usuarios/nuevo');
        }

        if(result){
            if(bcrypt.compareSync(req.body.pswLogin, result.pswUsuario)){
                req.session.usuario = result;
                res.redirect('cursos')
            }else{
                req.flash('mensajeError', 'Usuario o contraseña incorrectos')
                res.redirect('/')
            }
        }else{
            req.flash('mensajeError', 'Usuario o contraseña incorrectos')
            res.redirect('/')
        }
    });
});

router.get('/salir', function(req, res, next) {
    req.session.destroy()
    res.redirect('/')
});

module.exports = router;

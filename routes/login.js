var express = require('express');
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

                var io = req.app.get('socketio');

                io.on('connection', client => { 
                    io.emit('message', 'Ingreso el usuario ' + result.nombreUsuario);
                });
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

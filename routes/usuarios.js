var express = require('express');
var bcrypt = require('bcryptjs');
var router = express.Router();

const Usuarios = require('../models/usuarios');
var saltRounds = 10;

//Lista de usuarios
router.get('/', function(req, res, next) {
    let session = req.session.usuario;
    if(session.rolUsuario != 'Coordinador'){
        req.flash('mensajeError', 'No tiene permisos')
        res.redirect('/cursos')
        return;
    }

    Usuarios.find({}).exec((err, result) => {
        res.render('usuarios/index', 
        { 
            title: 'Usuarios',
            listaUsuarios: result,
            coordinador: (session.rolUsuario == 'Coordinador') ? true : false,
            aspirante: (session.rolUsuario == 'Aspirante') ? true : false 
        });
    });
});

/* Nuevo usuario */
router.get('/nuevo', function(req, res, next) {
  res.render('usuarios/nuevo',
  {
      title: "Crear usuario"
  });
});

/* Nuevo curso */
router.post('/nuevo', function(req, res, next) {
    Usuarios.find({docUsuario: req.body.docUsuario}).exec((err, result) => { 
        if (err) {            
            req.flash('mensajeError', err);
            return res.redirect('/usuarios/nuevo');
        }

        var hashPassword = bcrypt.hashSync(req.body.pswUsuario, saltRounds);
        
        if(result.length == 0){
            let usuario = new Usuario ({
                docUsuario:         req.body.docUsuario,
                nombreUsuario:      req.body.nombreUsuario,
                emailUsuario:       req.body.emailUsuario,
                telUsuario:         req.body.telUsuario,
                pswUsuario:         hashPassword,
                rolUsuario:         'Aspirante'    
            });

            usuario.save( (err, result) => {
                if (err) {
                    req.flash('mensajeError', err);
                    return res.redirect('/usuarios/nuevo');
                }
                req.flash('mensajeExito', 'Usuario creado correctamente');
                res.redirect('/usuarios/nuevo');
                           
            });
             
        }else{
            req.flash('mensajeError', 'El usuario con identificación '+req.body.docUsuario+' ya existe')
            res.redirect('/usuarios/nuevo');
        }

    });    

});

router.post('/editar', function(req, res, next) {
    Usuarios.updateOne({docUsuario: req.body.docUsuario},
        {
            nombreUsuario: req.body.nombreUsuario,
            emailUsuario: req.body.emailUsuario,
            telUsuario: req.body.telUsuario,
            rolUsuario: (req.body.newRolUsuario == '0') ? req.body.rolUsuario : req.body.newRolUsuario
        }, (err, result) => {
            var test = result;
            if(result.ok){
                req.flash('mensajeExito', 'Usuario editado con exito')
                res.redirect(req.get('referer'))
            }else{
                req.flash('mensajeError', 'Error al actualizar usuario')
                res.redirect(req.get('referer'))
            }
        });
});

/* editar usuarios */
router.get('/editar/:docUsuario', function(req, res, next) {
    let session = req.session.usuario;
    Usuarios.findOne({docUsuario: req.params.docUsuario}).exec((err, result) => {
        if (err) {            
            req.flash('mensajeError', err);
            return res.redirect('/usuarios');
        }

        if(result){
            res.render('usuarios/editar', 
            { 
                title: 'Editar - ' + result.nombreUsuario,
                usuario: result,
                coordinador: (session.rolUsuario == 'Coordinador') ? true : false,
                aspirante: (session.rolUsuario == 'Aspirante') ? true : false 
            });
        }
    });
});

module.exports = router;

var express = require('express');
var path = require('path');
var fs = require('fs');
var router = express.Router();

const archivo = path.join(__dirname , '../datos/usuarios.json');
const Usuario = require('../models/usuarios');
var usuarios = [];

//Lista de usuarios
router.get('/', function(req, res, next) {
    let session = req.session.usuario;
    if(session.rolUsuario != 'Coordinador'){
        req.flash('mensajeError', 'No tiene permisos')
        res.redirect('/cursos')
        return;
    }
    
    cargarArchivo();
    
    res.render('usuarios/index', 
    { 
        title: 'Usuarios',
        listaUsuarios: usuarios,
        coordinador: (session.rolUsuario == 'Coordinador') ? true : false,
        aspirante: (session.rolUsuario == 'Aspirante') ? true : false 
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
    Usuario.find({docUsuario: req.body.docUsuario}).exec((err, result) => {
        
        if (err) {            
            req.flash('mensajeError', err);
            return res.redirect('/usuarios/nuevo');
        }
        
        if(result.length == 0){
            let usuario = new Usuario ({
                docUsuario:         req.body.docUsuario,
                nombreUsuario:      req.body.nombreUsuario,
                emailUsuario:       req.body.emailUsuario,
                telUsuario:         req.body.telUsuario,
                pswUsuario:         req.body.pswUsuario,
                pswConfirmaUsuario: req.body.pswConfirmaUsuario,
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
    cargarArchivo();
    let session = req.session.usuario;
    let buscar = usuarios.find(x => x.docUsuario == req.body.docUsuario);
    if(buscar !== undefined){
        
        buscar['nombreUsuario'] = req.body.nombreUsuario;
        buscar['emailUsuario'] = req.body.emailUsuario;
        buscar['telUsuario'] = req.body.telUsuario;
        buscar['rolUsuario'] = (req.body.newRolUsuario == '0') ? buscar.rolUsuario:req.body.newRolUsuario;
        guardarArchivo(JSON.stringify(usuarios))
        req.flash('mensajeExito', 'Usuario editado con exito')
        res.redirect(req.get('referer'))
    }else{
        req.flash('mensajeError', 'No se pudo editar el usuario')
        res.redirect('/usuarios')
    }
});

/* editar usuarios */
router.get('/editar/:docUsuario', function(req, res, next) {
    cargarArchivo();
    let session = req.session.usuario;
    let buscar = usuarios.find(x => x.docUsuario == req.params.docUsuario);

    res.render('usuarios/editar', 
    { 
        title: 'Editar - ' + buscar.nombreUsuario,
        usuario: buscar,
        coordinador: (session.rolUsuario == 'Coordinador') ? true : false,
        aspirante: (session.rolUsuario == 'Aspirante') ? true : false 
    });
});

let cargarArchivo = () => {
    try{
        let data = fs.readFileSync(archivo)
        usuarios = JSON.parse(data)
    }catch(error){
       usuarios = [];
    }
}

let guardarArchivo = (data) => {
    fs.writeFile(archivo, data, (err) => {
        if (err) throw (err);
        return true;
     });
}

module.exports = router;

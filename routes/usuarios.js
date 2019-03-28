var express = require('express');
var path = require('path');
var fs = require('fs');
var router = express.Router();

const archivo = path.join(__dirname , '../datos/usuarios.json');
var usuarios = [];

// router.get('/', function(req, res, next) {
//     res.render('index', { title: 'Usuarios' });
// });

/* Nuevo usuario */
router.get('/nuevo', function(req, res, next) {
  res.render('usuarios/nuevo',
  {
      title: "Crear usuario"
  });
});

/* Nuevo curso */
router.post('/nuevo', function(req, res, next) {
    cargarArchivo();
    let buscar = usuarios.find(x => x.docUsuario == req.body.docUsuario);

    if(buscar === undefined){
        let usuario = {
            docUsuario:         req.body.docUsuario,
            nombreUsuario:      req.body.nombreUsuario,
            emailUsuario:       req.body.emailUsuario,
            telUsuario:         req.body.telUsuario,
            pswUsuario:         req.body.pswUsuario,
            pswConfirmaUsuario: req.body.pswConfirmaUsuario,
            rolUsuario:         'Aspirante'
        };
        usuarios.push(usuario);
        guardarArchivo(JSON.stringify(usuarios));
        req.flash('mensajeExito', 'Usuario creado correctamente')
    }else{
        req.flash('mensajeError', 'El usuario con identificación '+req.body.docUsuario+' ya existe')
    }
    res.redirect('/usuarios/nuevo')
});

let cargarArchivo = () => {
    try{
        let data = fs.readFileSync(archivo)
        cursos = JSON.parse(data)
    }catch(error){
       cursos = [];
    }
}

let guardarArchivo = (data) => {
    fs.writeFile(archivo, data, (err) => {
        if (err) throw (err);
        return true;
     });
}

module.exports = router;

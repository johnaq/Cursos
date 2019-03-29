var express = require('express');
var path = require('path');
var fs = require('fs');
var router = express.Router();

const archivo = path.join(__dirname , '../datos/usuarios.json');
var usuarios = [];

router.get('/', function(req, res, next) {
    res.render('login/login', { title: 'Ingreso al sistema' });
});

router.post('/', function(req, res, next) {
    cargarArchivo();
    // console.log(usuarios);
    
    let buscar = usuarios.find(x => x.docUsuario == req.body.docLogin & x.pswUsuario == req.body.pswLogin);
    // console.log(buscar);
    if(buscar === undefined){
        req.flash('mensajeError', 'Usuario o contraseña incorrectos')
        res.redirect('/')   
    }else{

        req.session.usuario = buscar;
        // req.session.docUsuario = buscar.docUsuario;
        // req.session.nomUsuario = buscar.nombreUsuario; 
        // req.session.emaUsuario = buscar.emailUsuario; 
        // req.session.telUsuario = buscar.telUsuario; 
        // req.session.rolUsuario = buscar.rolUsuario; 
               
        res.redirect('cursos')        
    }
});

let cargarArchivo = () => {
    try{
        let data = fs.readFileSync(archivo)
        usuarios = JSON.parse(data)
    }catch(error){
       usuarios = [];
    }
}

module.exports = router;

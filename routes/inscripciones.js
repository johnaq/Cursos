var express = require('express');
var path = require('path');
var fs = require('fs');
var router = express.Router();

const archivo = path.join(__dirname , '../datos/inscripciones.json');
var inscripciones = [];

const archivoCursos = path.join(__dirname , '../datos/cursos.json');
var cursos = [];

/* Nueva inscripción*/
router.get('/nuevo/:idCurso', function(req, res, next) {

    if(!req.session.usuario){
        req.flash('mensajeError', 'No tiene permisos')
        res.redirect('/')
        return;
    }
    let session = req.session.usuario;    
    cargarArchivo();
    //Se buscan los cursos de la persona que se encuentre logueada
    let buscar = inscripciones.find(x => x.docUsuario == session.docUsuario & x.idCurso == req.params.idCurso);cargarCursos();
    let curso = cursos.find(x => x.idCurso == req.params.idCurso);

    if(buscar === undefined){
        let inscrito = {
            docUsuario:  session.docUsuario,
            idCurso:     req.params.idCurso,
            nombreCurso: curso.nombreCurso,
            descripcion: curso.descripcion,
            valor:       curso.valor,
            modalidad:   curso.modalidad,
            intensidad:  curso.intensidad
        };
             
        inscripciones.push(inscrito);
        guardarArchivo(JSON.stringify(inscripciones));
        req.flash('mensajeExito', 'La inscripción se ha realizado correctamente para el curso '+ curso.nombreCurso)
    }else{
        req.flash('mensajeError', 'Ya se encuentra inscrito en el curso ' + curso.nombreCurso)
    }
    res.redirect('/inscripciones')
});

/* Ver inscripciones */
router.get('/', function(req, res, next) {
    if(!req.session.usuario){
        req.flash('mensajeError', 'No tiene permisos')
        res.redirect('/')
        return;
    }
    let session = req.session.usuario;
    cargarArchivo();
    let buscar = inscripciones.filter(x => x.docUsuario == session.docUsuario);
    // console.log(buscar);    
    if(buscar !== undefined){
        res.render('inscripciones/index',
        { 
            title: 'Inscripciones - ' + session.nombreUsuario,
            inscripcion: buscar,
            coordinador: (session.rolUsuario == 'Coordinador') ? true : false,
            aspirante: (session.rolUsuario == 'Aspirante') ? true : false
        });
    }else{
        
        res.redirect('/cursos')
    }
});

let cargarArchivo = () => {
    try{
        let data = fs.readFileSync(archivo)
        inscripciones = JSON.parse(data)
    }catch(error){
        inscripciones = [];
    }
}

let cargarCursos = () => {
    try{
        let data = fs.readFileSync(archivoCursos)
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

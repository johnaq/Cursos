var express = require('express');
var path = require('path');
var fs = require('fs');
var router = express.Router();

const archivo = path.join(__dirname , '../datos/cursos.json');
var cursos = [];

//Lista de cursos para aspirantes y coordinadores
router.get('/', function(req, res, next) {
    if(!req.session.usuario){
        req.flash('mensajeError', 'No tiene permisos')
        res.redirect('/')
        return;
    }
    let session = req.session.usuario;
    cargarArchivo();

    //Si es rol Aspirante solo se visualizan los cursos activos
    if(session.rolUsuario == 'Aspirante'){
        cursos = cursos.filter(x => x.estado == 1)
    }
    
    res.render('cursos/index', 
    { 
        title: 'Cursos',
        listaCursos: cursos,
        coordinador: (session.rolUsuario == 'Coordinador') ? true : false  
    });
});

/* Nuevo curso */
router.get('/nuevo', function(req, res, next) {
    let session = req.session.usuario;
    res.render('cursos/nuevo',
    {
        title: "Crear curso",
        coordinador: (session.rolUsuario == 'Coordinador') ? true : false
    });
});

/* Nuevo curso */
router.post('/nuevo', function(req, res, next) {
    cargarArchivo();
    let buscar = cursos.find(x => x.idCurso == req.body.idCurso);

    if(buscar === undefined){
        let curso = {
            idCurso: req.body.idCurso,
            nombreCurso: req.body.nombreCurso,
            descripcion: req.body.descripcion,
            valor: req.body.valor,
            modalidad: req.body.modalidad,
            intensidad: req.body.intensidad,
            estado: 1
        };
        cursos.push(curso);
        guardarArchivo(JSON.stringify(cursos));
        req.flash('mensajeExito', 'Curso creado correctamente')
    }else{
        req.flash('mensajeError', 'El curso con ID '+req.body.idCurso+' ya existe')
    }
    res.redirect('/cursos/nuevo')
});

/* Ver curso */
router.get('/:id', function(req, res, next) {
    cargarArchivo();
    let session = req.session.usuario;
    let buscar = cursos.find(x => x.idCurso == req.params.id);
    if(buscar !== undefined){
        res.render('cursos/curso', 
        { 
            title: 'Cursos - ' + buscar.nombreCurso,
            curso: buscar,
            coordinador: (session.rolUsuario == 'Coordinador') ? true : false
        });
    }else{
        req
        res.redirect('/cursos')
    }
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

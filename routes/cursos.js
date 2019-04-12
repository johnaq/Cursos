var express = require('express');
var router = express.Router();

const Cursos = require('../models/cursos');
const Usuarios = require('../models/usuarios');
const Cierres = require('../models/cerrar');
const Inscripciones = require('../models/inscripciones');

//Lista de cursos para aspirantes y coordinadores
router.get('/', function(req, res, next) {
    if(!req.session.usuario){
        req.flash('mensajeError', 'No tiene permisos')
        res.redirect('/')
        return;
    }
    let session = req.session.usuario;
    var listCursos = [];
    var verInsc = [];
    if(session.rolUsuario == 'Docente'){
        //Logica para el docente

        Cierres.find({idDocente: session._id}).populate('idCurso').exec((err, result) => {
            listCursos = result;
            listCursos.forEach(curso => {
                curso['cierres'] = [];
                Inscripciones.find({idCurso: curso.idCurso.id}).populate('idUsuario').exec((err, inscripcion) => {
                    inscripcion.forEach(element => {
                        // element.idUsuario['cierres'] = element.nombreCurso;
                        curso['cierres'].push(element.idUsuario);
                    }); 
                    verInsc.push(curso);              
                });
            });
            console.log(JSON.stringify(verInsc))
            res.render('cursos/vercursosdocente', {
                title: 'Cursos docente',
                inscripciones: verInsc
            })
        });
        


    }else{
        Cursos.find({}).exec((err, result) => {
            //Si es rol Aspirante solo se visualizan los cursos activos
            if(session.rolUsuario == 'Aspirante'){
                result = result.filter(x => x.estado == 1)
            }
    
            res.render('cursos/index', 
            { 
                title: 'Cursos',
                listaCursos: result
            });
        });
    }

    
});

/* Nuevo curso */
router.get('/nuevo', function(req, res, next) {
    let session = req.session.usuario;
    res.render('cursos/nuevo',
    {
        title: "Crear curso"
    });
});

/* Nuevo curso */
router.post('/nuevo', function(req, res, next) {
    Cursos.find({idCurso: req.body.idCurso}).exec((err, result) => { 
        if (err) {            
            req.flash('mensajeError', err);
            return res.redirect('/cursos/nuevo');
        }

        if(result.length == 0){
            let curso = new Cursos ({
                idCurso: req.body.idCurso,
                nombreCurso: req.body.nombreCurso,
                descripcion: req.body.descripcion,
                valor: req.body.valor,
                modalidad: (req.body.modalidad == "0") ? "" : req.body.modalidad,
                intensidad: req.body.intensidad,
                estado: 1
            });

            curso.save( (err, result) => {
                if (err) {
                    req.flash('mensajeError', err);
                    return res.redirect('/cursos/nuevo');
                }
                req.flash('mensajeExito', 'Curso creado correctamente');
                res.redirect('/cursos');
                           
            });
             
        }else{
            req.flash('mensajeError', 'El curso con id '+req.body.idCurso+' ya existe')
            res.redirect('/cursos/nuevo');
        }
    }); 
});

router.get('/cerrar/:id', function(req, res, next) {

    Cursos.findOne({_id: req.params.id}).exec((err, result) => { 
        
        if (err) {            
            req.flash('mensajeError', err);
            return res.redirect('/cursos');
        }

        Usuarios.find({rolUsuario: 'Docente'}).exec((error, docentes) => {
            if (error) {                
                req.flash('mensajeError', err);
                return res.redirect('/cursos');
            }

            res.render('cursos/cerrar', 
            { 
                title: 'Cerrar Curso - ' + result.nombreCurso,
                idCurso: result._id,
                nomCurso: result.nombreCurso,
                docentes: docentes
            });
            
        });       

    });    
    
});

router.post('/cerrar', function(req, res, next) {    
    
    let cierre = new Cierres ({
        idCurso: req.body.idCurso,
        idDocente: req.body.docente
    });

    cierre.save( (err, result) => {
        if (err) {
            req.flash('mensajeError', err);
            return res.redirect('/cursos');
        }

        Cursos.updateOne({_id: req.body.idCurso},
        {
            estado: 0
        }, (err, result) => {
            if(result.ok){
                req.flash('mensajeExito', 'Curso cerrado correctamente');
                res.redirect('/cursos');
            }else{
                req.flash('mensajeError', 'No se pudo actualizar el curso')
                res.redirect('/cursos');
            }
        });      
                            
    });

});

/* Ver curso */
router.get('/:id', function(req, res, next) {
    Cursos.findOne({idCurso: req.params.id}).exec((err, result) => {
        if (err) {
            req.flash('mensajeError', err);
            return res.redirect('/cursos');
        }

        if(result){
            res.render('cursos/curso', 
            { 
                title: 'Curso - ' + result.nombreCurso,
                curso: result
            });
        }
    });
});

module.exports = router;

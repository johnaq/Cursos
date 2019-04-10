var express = require('express');
var router = express.Router();

const Inscripciones = require('../models/inscripciones');
const Usuarios = require('../models/usuarios');
const Cursos = require('../models/cursos');

/* Nueva inscripción*/
router.get('/nuevo/:idCurso', function(req, res, next) {

    let session = req.session.usuario
    let inscripcion = new Inscripciones ({
        idCurso: req.params.idCurso,
        idUsuario:  session._id,
    });
    
    inscripcion.save( (err, result) => {
        if (err) {
            req.flash('mensajeError', err);
            return res.redirect('/inscripciones');
        }
        req.flash('mensajeExito', 'Curso creado correctamente'); 
        res.redirect('/inscripciones')                  
    });
});

/* Ver inscripciones */
router.get('/', function(req, res, next) {
    let session = req.session.usuario;
    Inscripciones.find({idUsuario: session._id}).populate('idCurso').exec((err,inscripciones) => {
        res.render('inscripciones/index', {
            title: 'Inscripciones',
            inscripciones: inscripciones
        })
    });
});

router.get('/verinscripciones', function(req, res, next) {
    var listInsc = [];
    var verInsc = [];
    Cursos.find({estado: 1}).exec((err, result) => {
        listInsc = result;
        listInsc.forEach(curso => {
            curso['inscripciones'] = [];
            Inscripciones.find({idCurso: curso.id}).populate('idUsuario').exec((err, inscripcion) => {
                inscripcion.forEach(element => {
                    element.idUsuario['idInscripcion'] = element.id;
                    curso['inscripciones'].push(element.idUsuario);
                }); 
                verInsc.push(curso);
                console.log(verInsc);               
            });
        });
        
    });

    res.render('inscripciones/verinscripciones', {
        title: 'Inscripciones',
        inscripciones: verInsc
    })
});

/* Eliminar inscripción*/
router.get('/eliminar/:id', function(req, res, next) {
    let session = req.session.usuario;
    Inscripciones.deleteOne({_id: req.params.id}, (err, result) => {
        if(result.ok){
            req.flash('mensajeExito', 'La inscripción se ha eliminado con éxito.')
    
            if(session.rolUsuario == 'Aspirante'){
                res.redirect('/inscripciones')
            }else{
                res.redirect('/inscripciones/verinscripciones')
            }
        }
    });
});

module.exports = router;

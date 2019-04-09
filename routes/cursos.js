var express = require('express');
var router = express.Router();

const Cursos = require('../models/cursos');

//Lista de cursos para aspirantes y coordinadores
router.get('/', function(req, res, next) {
    if(!req.session.usuario){
        req.flash('mensajeError', 'No tiene permisos')
        res.redirect('/')
        return;
    }
    let session = req.session.usuario;
    
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
                modalidad: req.body.modalidad,
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

router.get('/estado/:id', function(req, res, next) {
    Cursos.findOne({idCurso: req.params.id}).exec((err, result) => { 
        Cursos.updateOne({idCurso: req.params.id},
            {
                estado: (result.estado == 1) ? 0 : 1
            }, (err, result) => {
                var test = result;
                if(result.ok){
                    req.flash('mensajeExito', 'Curso activado/desactivado con exito')
                    res.redirect(req.get('referer'))
                }else{
                    req.flash('mensajeError', 'No se pudo actualizar el curso')
                    res.redirect(req.get('referer'))
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

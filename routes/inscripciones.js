var express = require('express');
var path = require('path');
var fs = require('fs');
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
    

    // let session = req.session.usuario;    
    // cargarArchivo();
    // //Se buscan los cursos de la persona que se encuentre logueada
    // let buscar = inscripciones.find(x => x.docUsuario == session.docUsuario & x.idCurso == req.params.idCurso);
    // cargarCursos();
    // let curso = cursos.find(x => x.idCurso == req.params.idCurso);

    // if(buscar === undefined){
    //     let inscrito = {
    //         id:          session.docUsuario+req.params.idCurso,
    //         docUsuario:  session.docUsuario,
    //         idCurso:     req.params.idCurso,
    //         nombreCurso: curso.nombreCurso,
    //         descripcion: curso.descripcion,
    //         valor:       curso.valor,
    //         modalidad:   curso.modalidad,
    //         intensidad:  curso.intensidad
    //     };
             
    //     inscripciones.push(inscrito);
    //     guardarArchivo(JSON.stringify(inscripciones));
    //     req.flash('mensajeExito', 'La inscripción se ha realizado correctamente para el curso '+ curso.nombreCurso)
    // }else{
    //     req.flash('mensajeError', 'Ya se encuentra inscrito en el curso ' + curso.nombreCurso)
    // }
    // res.redirect('/inscripciones')
});

/* Ver inscripciones */
router.get('/', function(req, res, next) {

    // Inscripciones.find({}).exec((err, result) => {
        
    //     Usuarios.populate(result, {path: 'idUsuario'}, (err, usuario) => {

    //         Cursos.populate(result, {path: 'idUsuario'}, (err, usuario) => {

    //     });

    // });


    Inscripciones.find({}).populate('idCurso').exec((err, inscripcion) => {
		if(err){
			res.status(500).send({message:'Error de conexión a la BD'});
		}else{
			if(!inscripcion){
				res.status(404).send({message: 'No existe el curso'});
			}else{
				Usuarios.populate(inscripcion,'idUsuario', (err, idUsuario) => {
					
					if(err){
						res.status(500).send({message: 'Error en la peticiona la BD'});
					}else{
						res.status(200).send(idUsuario);
					}
				});
			}
		}
	});



    
//     let session = req.session.usuario;
//     cargarArchivo();
//     let buscar = inscripciones.filter(x => x.docUsuario == session.docUsuario);
//     // console.log(buscar);    
//     if(buscar !== undefined){
//         res.render('inscripciones/index',
//         { 
//             title: 'Inscripciones - ' + session.nombreUsuario,
//             inscripcion: buscar,
//             coordinador: (session.rolUsuario == 'Coordinador') ? true : false,
//             aspirante: (session.rolUsuario == 'Aspirante') ? true : false
//         });
//     }else{
        
//         res.redirect('/cursos')
//     }
// });

// router.get('/verinscripciones', function(req, res, next) {
//     let session = req.session.usuario;
//     if(!session.rolUsuario == 'Coordinador'){
//         req.flash('mensajeError', 'No tiene permisos')
//         res.redirect('/cursos')
//         return;
//     }

//     let newArray = [];

//     cargarCursos();
//     cargarArchivo();
//     cargarUsuarios();

//     cursos = cursos.filter(x => x.estado == 1);

//     cursos.forEach(function(curso) {
//         let newArray2 = [];
//         let temp = inscripciones.filter(x => x.idCurso == curso.idCurso);
//         temp.forEach(function(i){
//             let temp2 = usuarios.find(u => u.docUsuario == i.docUsuario)
//             i.usuario = temp2;
//             newArray2.push(i);
//         });
//         curso.inscritos = newArray2;
//         newArray.push(curso);
//     });

//     console.log(newArray);
    
    
    // res.render('inscripciones/verinscripciones', {
    //     title: 'Inscripciones',
    //     inscripciones: newArray
    // })
});

/* Eliminar inscripción*/
router.get('/eliminar/:id', function(req, res, next) {

    if(!req.session.usuario){
        req.flash('mensajeError', 'No tiene permisos')
        res.redirect('/')
        return;
    }
    let session = req.session.usuario;    
    cargarArchivo();
    //Se buscan los cursos de la persona que se encuentre logueada
    let buscar = inscripciones.filter(x => x.id != req.params.id);cargarCursos();             
    console.log(buscar);
    
    guardarArchivo(JSON.stringify(buscar));
    req.flash('mensajeExito', 'La inscripción se ha eliminado con éxito.')
    
    if(session.rolUsuario == 'Aspirante'){
        res.redirect('/inscripciones')
    }else{
        res.redirect('/inscripciones/verinscripciones')
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

let cargarUsuarios = () => {
    try{
        let data = fs.readFileSync(archivoUsuarios)
        usuarios = JSON.parse(data)
    }catch(error){
       usuarios = [];
    }
}

module.exports = router;

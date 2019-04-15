const hbs = require('hbs');
const Inscripciones = require('../models/inscripciones');

//Helper para seleccionar valor por defecto en los select
hbs.registerHelper('select', function(selected, options) {
    return options.fn(this).replace(
        new RegExp(' value=\"' + selected + '\"'),
        '$& selected="selected"');
});

hbs.registerHelper('consultarInscritos', async (idCurso) => {
    let listaInscritos = '';
    var promesa = await Inscripciones.find({idCurso: idCurso}).populate('idUsuario').then(function(inscripciones){
        inscripciones.forEach(inscripcion => {
            listaInscritos += `
            <tr>
                <td scope="row">${inscripcion.idUsuario.docUsuario}</td>
                <td>${inscripcion.idUsuario.nombreUsuario}</td>
                <td>${inscripcion.idUsuario.emailUsuario}</td>
                <td>${inscripcion.idUsuario.telUsuario}</td>
            </tr>
            `;
        });
        return listaInscritos
    })

    return promesa
});
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inscripcionSchema = new Schema({
    idUsuario: {
        type: Schema.ObjectId,
        ref: 'usuarios',
    },
    idCurso: {
        type: Schema.ObjectId,
        ref: 'cursos'
    }
});

const Inscripcion = mongoose.model("Inscripcion", inscripcionSchema);

module.exports = Inscripcion;
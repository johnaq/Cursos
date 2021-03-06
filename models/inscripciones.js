const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inscripcionSchema = new Schema({
    idUsuario: {
        type: Schema.ObjectId,
        ref: 'Usuario',
    },
    idCurso: {
        type: Schema.ObjectId,
        ref: 'Curso'
    }
});

const Inscripcion = mongoose.model("Inscripcion", inscripcionSchema);

module.exports = Inscripcion;
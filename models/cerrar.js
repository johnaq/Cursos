const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cerrarSchema = new Schema({
    idCurso: {
        type: Schema.ObjectId,
        ref: 'Curso',
    },
    idDocente: {
        type: Schema.ObjectId,
        ref: 'Usuario'
    }
});

const Cerrar = mongoose.model("Cerrar", cerrarSchema);

module.exports = Cerrar;
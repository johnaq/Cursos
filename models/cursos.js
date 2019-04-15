const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cursoSchema = new Schema({
    idCurso: {
        type: Number,
        require: true,
        unique: true
    },
    nombreCurso: {
        type: String,
        require: true
    },
    descripcion: {
        type: String,
        require: true
    },
    valor: {
        type: Number
    },
    modalidad: {
        type: String
    },
    intensidad: {
        type: Number
    },
    estado: {
        type: Number
    }
});

const Curso = mongoose.model("Curso", cursoSchema);

module.exports = Curso;
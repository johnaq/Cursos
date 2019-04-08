const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    docUsuario: {
        type: Number,
        require: true,
        unique: true
    },
    nombreUsuario: {
        type: String,
        require: true
    },
    emailUsuario: {
        type: String
    },
    telUsuario: {
        type: String
    },
    pswUsuario: {
        type: String,
        require: true
    },
    rolUsuario: {
        type: String,
        require: true
    }
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

module.exports = Usuario;
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');

const usuarioSchema = new mongoose.Schema({

    nombre: {
        type: String,
        required: true
    },
    usuario: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    tipoUsuario: {
        type: String,
        required: true
    },
    sucursales: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sucursales',
        required: true 
    },
    fechaRegistro: {
        type: Date,
        default: dayjs().format("YYYY-MM-DD")
    },
    estado: {
        type: Boolean,
        default: true
    }
});

const Usuario = mongoose.model('usuarios', usuarioSchema);

module.exports = Usuario;
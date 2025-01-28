const mongoose = require('mongoose');
const dayjs = require('dayjs');

const clienteShema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    telefono: {
        type: String,
    },
    direccion: {
        type: String,
    },
    sucursales: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sucursales',
        required: true,
    },
    fechaRegistro: {
        type: Date,
        default: dayjs().format('YYYY-MM-DD'),
    },
    estado: {
        type: Boolean,
        default: true,
    },
})

const Cliente = mongoose.model('cliente', clienteShema);

module.exports = Cliente;

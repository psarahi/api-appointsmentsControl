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
    sucursales: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sucursales',
        required: true,
    },
    fechaRegistro: {
        type: Date,
        default: dayjs().format('YYYY-MM-DD'),
    }
})

export const Cliente = mongoose.model('cliente', clienteShema);

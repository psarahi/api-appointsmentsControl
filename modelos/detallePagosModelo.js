const mongoose = require('mongoose');

const detallePagos = new mongoose.Schema({
    detalleVenta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'detalleVenta',
        required: true,
    },
    fecha: {
        type: Date,
        default: Date.now,
    },
    monto: {
        type: Number,
        required: true,
    },
    formaPago: {
        type: String,
        required: true,
    },
});

const DetallePagos = mongoose.model('detallePagos', detallePagos);

module.exports = DetallePagos;
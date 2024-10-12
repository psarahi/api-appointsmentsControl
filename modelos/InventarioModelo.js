const mongoose = require('mongoose');

const inventarioShema = new  mongoose.Schema({

    descripcion: {
        type: String,
        required: true
    },
    linea: {
        type: String,
    },
    precioVenta: {
        type: Number,
        required: true
    },
    precioCompra: {
        type: Number,
        required: true
    },
    existencia: {
        type: Number,
        required: true
    },
    categoria: {
        type: String,
    },
    proveedor: {
        type: String,
    },
    telefono: {
        type: String,
    },
    moda: {
        type: String,
    },
    diseno: {
        type: String,
    },
    color: {
        type: String,
    }
});

const Inventario = mongoose.model('inventario', inventarioShema);

module.exports = Inventario;
const mongoose = require('mongoose');

const sucursalesShema = new  mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    }
});

const Sucursales = mongoose.model('sucursales', sucursalesShema);

module.exports = Sucursales;
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
    },
    celular: {
        type: String,
    },
    email: {
        type: String,
    },
    cai: {
        type: String,
    },
    paginaDigital: {
        type: String,
    },
    rtn: {
        type: String,
    },
    
});

const Sucursales = mongoose.model('sucursales', sucursalesShema);

module.exports = Sucursales;
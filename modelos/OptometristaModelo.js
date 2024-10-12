const mongoose = require('mongoose');

const optometrista = new mongoose.Schema({ 
    nombre: {
        type: String,
        required: true
    },
    sucursales: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sucursales',
        required: true,
    },
});

const Optometrista = mongoose.model('optometrista', optometrista);

module.exports = Optometrista;
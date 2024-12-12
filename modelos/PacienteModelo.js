const mongoose = require("mongoose");
const dayjs = require("dayjs");

const pacienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  edad: {
    type: Number,
  },
  genero: {
    type: String,
  },
  telefono: {
    type: String,
  },
  email: {
    type: String,
  },
  direccion: {
    type: String,
  },
  fechaRegistro: {
    type: Date,
    default: dayjs().format("YYYY-MM-DD"),
  },
  ultimaCita: {
    type: Date,
    default: dayjs().format("YYYY-MM-DD"),
  },
  sucursales: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "sucursales",
    required: true,
  },
  citaProxima: {
    type: Date,
    default: dayjs().format("YYYY-MM-DD"),
  },
  estado: {
    type: Boolean,
    default: true,
  },
});

const Paciente = mongoose.model("paciente", pacienteSchema);

module.exports = Paciente;

// nombre   edad   genero
// telefono    email     direccion
// antecedentes    enfermedadBase    observaciones
// optometrista    sucursales    citaProxima

// {
//     "nombre": "Lesly Sarahi Peña Guerra",
//     "edad": "26",
//     "genero": "Femenino",
//     "antecedentes": "N/A",
//     "telefono": "97852842",
//     "email": "pleslysarahi@gmail.com",
//     "direccion": "Barrio Guamilito, 5 calle entre 2 y 3 avenida",
//     "fechaRegistro": "2024-08-30 00:00:00",
//     "ultimaCita": "2024-09-27 00:00:00",
//     "observaciones": "Se observa ojo reseco",
//     "optometrista": "66f5edfcfb89adc2adb08fbc",
//     "enfermedadBase": "Ninguna",
//     "sucursales": "66f4a1e440a1f9b0b8600d50",
//     "recetaOjoDerecho": [{
//      "fecha": "2023-09-27 00:00:00"
// "esfera": "+0.25"
// "cilindro": "+0.25"
// "eje": ""
// "AgudezaVisual": "",
// "distanciaPupilar": "",
// "adicion": "",
// "defRefraccion": "",
//}],
//     "recetaOjoIzquierdo": [{
//      "fecha": "2023-09-27 00:00:00"
// "esfera": "+0.75"
// "cilindro": "+0.75"
// "eje": ""
// "AgudezaVisual": "",
// "distanciaPupilar": "",
// "adicion": "",
// "defRefraccion": "",
//}],
//     "pruebasValoraciones": "Todo se observa normal solo se necesitan lubricante ocultar"
// }

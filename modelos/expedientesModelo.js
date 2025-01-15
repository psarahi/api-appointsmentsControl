const mongoose = require("mongoose");
const dayjs = require("dayjs");

const expedientesShema = mongoose.Schema({
  paciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "paciente",
    required: true,
  },
  tipoLente: {
    type: String,
  },
  proteccion: {
    type: [String],
  },
  optometrista: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "optometrista",
    required: true,
  },
  fecha: {
    type: Date,
    default: dayjs().format("YYYY-MM-DD"),
  },
  antecedentes: {
    type: String,
    default: "N/A",
  },
  enfermedadBase: {
    type: String,
    default: "Ninguna",
  },
  observaciones: {
    type: String,
    default: "N/A",
  },
  pruebasValoraciones: {
    type: String,
    default: "N/A",
  },
  usuarios: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "usuarios",
    required: true,
  },
  recetaOjoDerecho: {
    esfera: {
      type: String,
    },
    cilindro: {
      type: String,
    },
    eje: {
      type: String,
    },
    agudezaVisual: {
      type: String,
    },
    distanciaPupilar: {
      type: String,
    },
    adicion: {
      type: String,
    },
    defRefraccion: {
      type: String,
    },
  },
  recetaOjoIzquierdo: {
    esfera: {
      type: String,
    },
    cilindro: {
      type: String,
    },
    eje: {
      type: String,
    },
    agudezaVisual: {
      type: String,
    },
    distanciaPupilar: {
      type: String,
    },
    adicion: {
      type: String,
    },
    defRefraccion: {
      type: String,
    },
  },
});

const Expediente = mongoose.model("expediente", expedientesShema);

module.exports = Expediente;

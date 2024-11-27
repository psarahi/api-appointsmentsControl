const mongoose = require("mongoose");

const inventarioShema = new mongoose.Schema({
  descripcion: {
    type: String,
    required: true,
  },
  esfera: {
    type: String,
  },
  cilindro: {
    type: String,
  },
  adicion: {
    type: String,
  },
  linea: {
    type: String,
  },
  precioVenta: {
    type: Number,
    required: true,
  },
  precioCompra: {
    type: Number,
    required: true,
  },
  importe: {
    type: String,
  },
  valorGravado: {
    type: String,
  },
  existencia: {
    type: Number,
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
  material: {
    type: String,
  },
  diseno: {
    type: String,
  },
  color: {
    type: String,
  },
  estado: {
    type: Boolean,
    default: true,
  },
  sucursales: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "sucursales",
    required: true,
  },
});

const Inventario = mongoose.model("inventario", inventarioShema);

module.exports = Inventario;

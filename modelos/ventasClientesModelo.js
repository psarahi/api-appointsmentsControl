const mongoose = require("mongoose");
const dayjs = require("dayjs");

const clienteShema = new mongoose.Schema({
  rtn: {
    type: String,
  },
  nombreRtn: {
    type: String,
  },
  sucursales: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "sucursales",
    required: true,
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cliente",
    required: true,
  },
  detalleInventario: [
    {
      inventario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "inventario",
      },
      cantidad: {
        type: Number,
        required: true,
      },
    },
  ],
  fecha: {
    type: Date,
    default: dayjs().format("YYYY-MM-DD"),
  },
  estado: {
    type: Boolean,
    default: true,
  }
});

export const VentaCliente = mongoose.model("ventaClientes", clienteShema);

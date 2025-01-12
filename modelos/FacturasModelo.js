const mongoose = require("mongoose");
const dayjs = require("dayjs");

const facturasShema = new mongoose.Schema({
  desde: {
    type: String,
    required: true,
  },
  hasta: {
    type: String,
    required: true,
  },
  fechaLimiteEmision: {
    type: Date,
    default: dayjs().format("YYYY-MM-DD"),
  },
  sucursales: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "sucursales",
    required: true,
  },
  ultimaUtilizada: {
    type: String,
  },
  estado: {
    type: Boolean,
    default: true,
  }
});

const Facturas = mongoose.model("facturas", facturasShema);

module.exports = Facturas;

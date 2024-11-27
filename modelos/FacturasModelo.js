const mongoose = require("mongoose");
const moment = require("moment");

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
    default: moment().subtract(6, "hour").format("YYYY-MM-DD HH:mm:ss"),
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
  },
});

const Facturas = mongoose.model("facturas", facturasShema);

module.exports = Facturas;

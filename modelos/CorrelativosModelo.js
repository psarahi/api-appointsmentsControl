const mongoose = require("mongoose");

const correlativoShema = new mongoose.Schema({
  numCorrelativo: {
    type: String,
    required: true,
  },
  sucursales: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "sucursales",
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
});

const Correlativo = mongoose.model("correlativos", correlativoShema);

module.exports = Correlativo;

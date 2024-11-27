const mongoose = require("mongoose");

const correlativoShema = new mongoose.Schema({
  numRecibo: {
    type: String,
    required: true,
  },
  sucursales: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "sucursales",
    required: true,
  },
});

const Correlativo = mongoose.model("correlativos", correlativoShema);

module.exports = Correlativo;

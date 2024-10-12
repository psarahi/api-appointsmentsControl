const mongoose = require("mongoose");
const moment = require("moment");
moment.locale("es");

const detalleVenta = new mongoose.Schema({
  tipoVenta: {
    type: String,
    required: true,
  },
  tipoLente: {
    type: String,
  },
  proteccion: {
    type: String,
  },
  material: {
    type: String,
  },
  modaArmazon: {
    type: String,
  },
  pacientes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "pacientes",
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
      precioVendido: {
        type: Number,
        required: true,
      },
      descuento: {
        type: Number,
        default: 0,
      },
    },
  ],

  fecha: {
    type: Date,
    default: moment().subtract(6, "hour").format("YYYY-MM-DD HH:mm:ss"),
  },
  fechaEntrega: {
    type: Date,
    default: moment().subtract(6, "hour").format("YYYY-MM-DD HH:mm:ss"),
  },
  detallePagos: [{
    fecha: {
      type: Date,
      default: moment().subtract(6, "hour").format("YYYY-MM-DD HH:mm:ss"),
    },
    formaPago: {
      type: String,
      required: true,
    },
    monto: {
      type: Number,
      required: true,
    },
  }],
  descuentoTotal: {
    type: Number,
    default: 0,
  },
  cantPagos: {
    type: Number,
    default: 0,
  },
  montoPagos: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
  acuenta: {
    type: Number,
    default: 0,
  },
});

const DetalleVenta = mongoose.model("detalleVenta", detalleVenta);

module.exports = DetalleVenta;

// {
//   "tipoVenta": "Cambio de lente",
//   "tipoLente": "Monofocal",
//   "proteccion": "Antireflejo",
//   "material": ""
//   "modaArmazon": ""
//   "pacientes": "66f6e24487cdeeb996c2555e",
//   "detalleInventario": [{
//     "inventario": "66f5ba1598c7e92fa0be45c8",
//     "descripcion": "Lentes",
//     "precioVenta": "700",
//     "cant": "1",
//     "descuento": "100"
//   },
//   {
//     "inventario": "66f5ba5798c7e92fa0be45cc",
//     "descripcion": "Aros",
//     "precioVenta": "1200",
//     "cant": "1",
//     "descuento": "300"
//   }
// ],
//   "fecha": "2024-08-30 00:00:00",
//   "fechaEntrega": "2024-09-01 14:00:00",
//   "detallePagos" : [{
//      "fecha": "2024-09-01 14:00:00",
//      "monto": "950",
//      "formaPago": "Efectivo"
//    }, {
//      "fecha": "2024-10-01 14:00:00",
//      "monto": "950",
//      "formaPago": "Efectivo"
//  }],
//   "descuentoTotal": "300",
//   "cantPagos": "2",
//   "montoPagos": "950",
//   "total": "1900",
//   "acuenta": "950"
// }

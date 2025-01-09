const { io } = require("../index");
const express = require("express");
const Facturas = require("../modelos/FacturasModelo");
const Sucursal = require("../modelos/SucursalesModelo");
const { formatearNumero, textValidator } = require("../helpers/formato");
const dayjs = require("dayjs");
const conversor = require("conversor-numero-a-letras-es-ar");
let ClaseConversor = conversor.conversorNumerosALetras;
let miConversor = new ClaseConversor();
const router = express.Router();

let printerClients = []; // Almacena clientes conectados

// Endpoint para imprimir
router.post("/imprimirFactura", async (req, res) => {
  console.log(req.body);

  const fac = await Facturas.find({
    $and: [
      {
        sucursales: {
          $eq: req.body.sucursales,
        },
        estado: true,
      },
    ],
  }).populate("sucursales");

  let valorExento = 0.0;
  let valorGravado15 = 0.0;
  let isv15 = 0.0;

  const cai = fac[0].sucursales.cai;
  const rango = `${fac[0].desde} - ${fac[0].hasta}`;
  const rtn = fac[0].sucursales.rtn;
  const tel = fac[0].sucursales.telefono;
  const cel = fac[0].sucursales.celular;
  const direccion = fac[0].sucursales.direccion.toLocaleUpperCase();
  const email = fac[0].sucursales.email.toLocaleUpperCase();
  const mensaje = fac[0].mensaje.toLocaleUpperCase();
  const fechaEmision = fac[0].fechaLimiteEmision;
  const cliente = !textValidator(req.body.rtn)
    ? req.body.cliente
    : req.body.nombreRtn;
  const rtnCliente = !textValidator(req.body.rtn) ? "" : req.body.rtn;
  const total = req.body.total;
  const descuento = req.body.totalDescuento;
  const formaPago = req.body.formaPago.toLocaleUpperCase();
  const articulos = req.body.inventario;

  let desxArt = formatearNumero(descuento / articulos.length);

  articulos.forEach((articulo) => {
    if (articulo.importe === "Exento") {
      valorExento += articulo.precioVenta - desxArt;
    } else if (articulo.valorGravado === "15%") {
      valorGravado15 += articulo.precioVenta - desxArt;
      isv15 += (articulo.precioVenta - desxArt) * 0.15;
    }
  });

  const totales = [
    {
      label: "DESCUENTOS Y REBAJAS",
      value: `L ${formatearNumero(descuento)}`,
    },
    {
      label: "SUB TOTAL",
      value: `L ${formatearNumero(total - isv15)}`,
    },
    {
      label: "IMPORTE EXENTO",
      value: `L ${formatearNumero(valorExento)}`,
    },
    {
      label: "IMPORTE EXONERADO",
      value: `L 0.00`,
    },
    {
      label: "IMPORTE GRAVADO 15%",
      value: `L ${formatearNumero(valorGravado15 - isv15)}`,
    },
    {
      label: "IMPORTE GRAVADO 18%",
      value: `L 0.00`,
    },
    {
      label: "I.S.V. 15%",
      value: `L ${formatearNumero(isv15)}`,
    },
    {
      label: "I.S.V. 18%",
      value: `L 0.00`,
    },
    {
      label: "TOTAL A PAGAR",
      value: `L  ${formatearNumero(total)}`,
    },
  ];

  let labelsTotales = [];
  const lineWidth = 32; // Ancho de caracteres por línea (depende de tu impresora)

  totales.forEach((t) => {
    const spacesBetween = Math.max(
      0,
      lineWidth - t.label.length - t.value.length
    );
    const alignedText = `${t.label}${" ".repeat(spacesBetween)}${t.value}`;

    labelsTotales.push(alignedText);
  });

  const datosImprimir = {
    rtnSucursal: rtn,
    nombreSucursal: "",
    tel: tel,
    cel: cel,
    direccion: direccion,
    email: email,
    numFacRec: req.body.numFacRec,
    cliente: cliente,
    rtnCliente: rtnCliente,
    vendedor: req.body.vendedor.toLocaleUpperCase(),
    articulos: articulos,
    labelsTotales: labelsTotales,
    monto: req.body.monto,
    formaPago: formaPago,
    fecha: "",
    fechaEmision: fechaEmision,
    total: total,
    totalLetras: miConversor.convertToText(total).toLocaleUpperCase(),
    acuenta: req.body.acuenta,
    cai: cai,
    rango: rango,
    paginaDigital: "",
    sucursales: req.body.sucursales,
    mensaje: mensaje,
  };

  if (printerClients.length === 0) {
    return res
      .status(500)
      .send({ error: "No hay impresoras locales conectadas." });
  }

  // Enviar el contenido a los clientes conectados
  printerClients.forEach((socket) => {
    socket.emit("printFactura", { datosImprimir });
  });

  res.send({
    success: true,
    message: "Solicitud de impresión enviada a las impresoras locales.",
  });
});

// Endpoint para imprimir recibos
router.post("/imprimirRecibo", async (req, res) => {
  const sucursal = await Sucursal.find({
    _id: req.body.sucursales,
  });

  const cel = sucursal[0].celular;
  const tel = sucursal[0].telefono;
  const nombreSucursal = sucursal[0].nombre;
  const direccion = sucursal[0].direccion;
  const paginaDigital = sucursal[0].paginaDigital;
  const email = sucursal[0].email;
  const fecha = dayjs(req.body.fecha).add(6, "hour").format("YYYY-MM-DD");
  const articulos = req.body.inventario;

  const datosImprimir = {
    rtnSucursal: "",
    nombreSucursal: nombreSucursal,
    tel: tel,
    cel: cel,
    direccion: direccion,
    email: email,
    numFacRec: req.body.numFacRec,
    cliente: req.body.cliente,
    rtnCliente: "",
    vendedor: req.body.vendedor,
    articulos: articulos,
    labelsTotales: [],
    monto: req.body.monto,
    formaPago: req.body.formaPago,
    fecha: fecha,
    fechaEmision: "",
    total: req.body.total,
    totalLetras: miConversor.convertToText(req.body.total).toLocaleUpperCase(),
    acuenta: req.body.acuenta,
    cai: "",
    rango: "",
    paginaDigital: paginaDigital,
    sucursales: req.body.sucursales,
    mensaje: "",
  };

  if (printerClients.length === 0) {
    return res
      .status(500)
      .send({ error: "No hay impresoras locales conectadas." });
  }

  // Enviar el contenido a los clientes conectados
  printerClients.forEach((socket) => {
    socket.emit("printRecibo", { datosImprimir });
  });

  res.send({
    success: true,
    message: "Solicitud de impresión enviada a las impresoras locales.",
  });
});
// Manejar conexión de clientes locales
io.on("connection", (socket) => {
  console.log("Cliente local conectado");
  printerClients.push(socket);

  socket.on("disconnect", () => {
    console.log("Cliente local desconectado");
    printerClients = printerClients.filter((client) => client !== socket);
  });
});

module.exports = io;
module.exports = router;

const { io } = require("./index");
const express = require("express");
const Facturas = require("./modelos/FacturasModelo");
const Correlativo = require("./modelos/CorrelativosModelo");
const Sucursal = require("./modelos/SucursalesModelo");
const { formatearNumero, textValidator } = require("./helpers/formato");
const escpos = require("escpos");
escpos.USB = require("escpos-usb");
const htmlToText = require("html-to-text");
const sharp = require("sharp");
const path = require("path");
const dayjs = require("dayjs");
const fs = require("fs");
const conversor = require("conversor-numero-a-letras-es-ar");
const router = express.Router();

let printerClients = []; // Almacena clientes conectados

// Endpoint para imprimir
router.post("/print", (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res
      .status(400)
      .send({ error: "El contenido a imprimir es obligatorio." });
  }

  if (printerClients.length === 0) {
    return res
      .status(500)
      .send({ error: "No hay impresoras locales conectadas." });
  }

  // Enviar el contenido a los clientes conectados
  printerClients.forEach((socket) => {
    socket.emit("print", { content });
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

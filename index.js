const mongoose = require("mongoose");
const express = require("express");
// const { Server } = require('socket.io');
const socketIO = require("socket.io");
const http = require("http");
const app = express();

let server = http.createServer(app);
module.exports.io = socketIO(server);
// const io = new Server(server);

require("./routers/thermalPrinter");
app.use(express.json());

const inicio = require("./routers/inicio");
const sucursal = require("./routers/sucursales");
const usuario = require("./routers/usuario");
const paciente = require("./routers/paciente");
const expedientes = require("./routers/expedientes");
const inventario = require("./routers/inventario");
const optometrista = require("./routers/optometrista");
const detalleVentas = require("./routers/detalleVenta");
const facturas = require("./routers/facturas");
const correlativos = require("./routers/correlativos");
const thermalPrinter = require("./routers/thermalPrinter");
const cliente = require("./routers/cliente");

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use("", inicio);
app.use("/api/sucursal", sucursal);
app.use("/api/usuario", usuario);
app.use("/api/paciente", paciente);
app.use("/api/expediente", expedientes);
app.use("/api/inventario", inventario);
app.use("/api/optometrista", optometrista);
app.use("/api/detalleVentas", detalleVentas);
app.use("/api/facturas", facturas);
app.use("/api/correlativo", correlativos);
app.use("/api/thermalPrinter", thermalPrinter);
app.use("/api/cliente", cliente);

const port = process.env.API_PORT || 3003;

// docker run --env-file=./.env -p 3002:3002  apicontrolteatro:latest

server.listen(port, () => console.log("Escuchando Puerto: " + port));

mongoose
  .connect(
    // `mongodb+srv://lesly:${process.env.MONGOPASS_ATLAS}@cluster0.g3yej.mongodb.net/appointmentsControl?retryWrites=true&w=majority&appName=Cluster0`
    `${process.env.STRING_CONNECT}://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.CLUSTER_NAME}:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}?authSource=admin`
  )
  .then(() => console.log("Conectado a MongoDb"))
  .catch((error) => console.log(error));

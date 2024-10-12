//require('dotenv').config();
const mongoose = require('mongoose');

const express = require('express');
const http = require('http');
const app = express();

let server = http.createServer(app);

const inicio = require('./routers/inicio');
const sucursal = require('./routers/sucursales');
const usuario = require('./routers/usuario');
const paciente = require('./routers/paciente');
const expedientes = require('./routers/expedientes');
const inventario = require('./routers/inventario');
const optometrista = require('./routers/optometrista');
const detalleVentas = require('./routers/detalleVenta');

app.use(express.json());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use('', inicio);
app.use('/api/sucursal', sucursal);
app.use('/api/usuario', usuario);
app.use('/api/paciente', paciente);
app.use('/api/expediente', expedientes);
app.use('/api/inventario', inventario);
app.use('/api/optometrista', optometrista);
app.use('/api/detalleVentas', detalleVentas);

const port = process.env.PORT || 3003;

server.listen(port, () => console.log('Escuchando Puerto: ' + port));

mongoose.connect(
        `mongodb+srv://lesly:${process.env.MONGOPASS}@cluster0.g3yej.mongodb.net/appointmentsControl?retryWrites=true&w=majority&appName=Cluster0`    )
    .then(() => console.log('Conectado a MongoDb'))
    .catch(error =>

        console.log(error));
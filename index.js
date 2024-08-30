//require('dotenv').config();
const mongoose = require('mongoose');

const express = require('express');
const http = require('http');
const app = express();

let server = http.createServer(app);

const inicio = require('./routers/inicio');
const perfil = require('./routers/perfil');
const usuario = require('./routers/usuario');
const cliente = require('./routers/cliente');

app.use(express.json());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use('', inicio);
app.use('/api/perfil', perfil);
app.use('/api/usuario', usuario);
app.use('/api/cliente', cliente);

const port = process.env.PORT || 3003;

server.listen(port, () => console.log('Escuchando Puerto: ' + port));

mongoose.connect(
        `mongodb+srv://lesly:${process.env.MONGOPASS}@cluster0.g3yej.mongodb.net/appointmentsControl?retryWrites=true&w=majority&appName=Cluster0`    )
    .then(() => console.log('Conectado a MongoDb'))
    .catch(error =>

        console.log(error));
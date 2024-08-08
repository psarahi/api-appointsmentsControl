const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../modelos/UsuariosModelo');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Funcion get todos
router.get('/', async(req, res) => {
    try {
        const usuarios = await Usuario.find()
            .populate('perfiles', 'nombre')
            .sort({ fechaRegistro: -1 });
        res.send(usuarios);
    } catch (error) {
        console.log(error);
        res.status(404).send('No se encontro ningun documento');

    }
});

// Funcion get documentos activos
router.get('/activo', async(req, res) => {
    try {
        const usuarios = await Usuario.find({ estado: true })
            .populate('perfiles', 'nombre')
            .sort({ fechaRegistro: -1 });
        res.send(usuarios);
    } catch (error) {
        console.log(error);
        res.status(404).send('No se encontro ningun documento');

    }
});

// Funcion get por _id unico
router.get('/:_id', async(req, res) => {
    try {
        const usuario = await Usuario.findById(req.params._id)
            .populate('perfiles', 'nombre');
        res.send(usuario);
    } catch (error) {
        console.log(error);
        res.status(404).send('No se encontro ningun documento');

    }
});

// Funcion POST
router.post('/', async(req, res) => {
    try {
        let usuario = await Usuario.findOne({
            $or: [
                { usuario: req.body.usuario },
                { correo: req.body.correo }
            ]
        });
        if (usuario) return res.status(400).send('Usurio ya existe');

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        const usuarioSave = new Usuario({
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            correo: req.body.correo,
            usuario: req.body.usuario,
            password: hashPassword,
            empresa: req.body.empresa,
            lugar: req.body.lugar,
            perfiles: req.body.perfiles,
            estado: req.body.estado
        });

        const saveRegistro = await usuarioSave.save();

        const resultSave = await Usuario.findById(saveRegistro.id)
            .populate('perfiles', 'nombre');

        const jwtToken = resultSave.generarJWT();

        res.status(201).header('authorization', jwtToken).send(resultSave);
    } catch (error) {
        console.log(error);
        res.status(404).send('No se pudo registrar el documento');

    }
});

// Funcion PUT
router.put('/:_id', async(req, res) => {
    try {
        // let usuario = await Usuario.findOne({
        //     $or: [
        //         { usuario: req.body.usuario },
        //         { correo: req.body.correo }
        //     ]
        // });
        // if (usuario) return res.status(400).send('Usurio ya existe');

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        const usuario = await Usuario.findByIdAndUpdate(req.params._id, {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            correo: req.body.correo,
            usuario: req.body.usuario,
            password: hashPassword,
            empresa: req.body.empresa,
            lugar: req.body.lugar,
            perfiles: req.body.perfiles,
            estado: req.body.estado
        }, {
            new: true
        });
        res.status(204).send();
    } catch (error) {
        console.log(error);
        res.status(404).send('No se encontro ningun documento');

    }
});

// Funcion DELETE
router.delete('/:_id', async(req, res) => {
    try {
        const usuario = await Usuario.findByIdAndDelete(req.params._id);
        res.status(200).send('usuario borrada');

    } catch (error) {
        console.log(error);
        res.status(404).send('No se encontro ningun documento');

    }

});


//////////////////////////// Rutas transacciones //////////////////////////


module.exports = router;
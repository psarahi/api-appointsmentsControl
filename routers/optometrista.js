const express = require('express');
const Optometrista = require('../modelos/OptometristaModelo');
const router = express.Router();

// Funcion get todos
router.get('/', async(req, res) => {
    try {
        const optometristas = await Optometrista.find()
        .populate('sucursales');

        res.send(optometristas);
    } catch (error) {
        console.log(error);
        res.status(500).send('No se encontro ningun documento');
    }
});

// Funcion get todos
router.get('/bySucursal/:sucursal', async(req, res) => {
  try {
      const optometristas = await Optometrista.find({
        sucursales: req.params.sucursal
      })
      .populate('sucursales');

      res.send(optometristas);
  } catch (error) {
      console.log(error);
      res.status(500).send('No se encontro ningun documento');
  }
});

// Funcion para agregar
router.post('/', async (req, res) => {
    try {
      const optometrista = new Optometrista(req.body);
      const result = (await optometrista.save());

      const optometristaSave = await Optometrista.findById(result._id).populate(
        "sucursales"
      );
      res.status(201).send(optometristaSave);
    } catch (error) {
      console.log(error);
      res.status(500).send('No se pudo registrar el documento');
    }
  });

  // Funcion PUT
router.put('/:_id', async (req, res) => {
    try {
      const optometrista = await Optometrista.findByIdAndUpdate(req.params._id, req.body, {
        new: true,
      }).populate('sucursales');
      res.status(202).send(optometrista);
    } catch (error) {
      console.log(error);
      res.status(500).send('No se encontro ningun documento');
    }
  });

  // Funcion DELETE
router.delete('/:_id', async (req, res) => {
    try {
      if (req.params._id.length != 24) {
        return res
          .status(404)
          .send('El id no contiene el numero correcto de digitos');
      }
      const optometrista = await Optometrista.findById(req.params._id);
  
      if (!optometrista) {
        return res
          .status(404)
          .send('No se encontro ningun documento para borrar');
      }
      await Optometrista.findByIdAndDelete(req.params._id);
  
      res.status(200).send('Registro borrado');
    } catch (error) {
      console.log(error);
      res.status(500).send('No se encontro ningun documento');
    }
  });
  
  module.exports = router;
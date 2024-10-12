const express = require('express');
const DetalleVenta = require('../modelos/detalleVentaModelo');
const router = express.Router();

// Funcion get todos
router.get('/', async(req, res) => {
    try {
        const detalles = await DetalleVenta.find()
        .populate("pacientes");

        res.send(detalles);
    } catch (error) {
        console.log(error);
        res.status(404).send('No se encontro ningun documento');
    }
});

// Funcion para agregar
router.post("/", async (req, res) => {
    try {
      const detalle = new DetalleVenta(req.body);
      const result = await detalle.save();
      res.status(201).send(result);
    } catch (error) {
      console.log(error);
      res.status(404).send("No se pudo registrar el documento");
    }
  });

  // Funcion PUT
router.put("/:_id", async (req, res) => {
    try {
      //66cce95ffe40b42d2b69260e
      const detalle = await DetalleVenta.findByIdAndUpdate(req.params._id, req.body, {
        new: true,
      });
      res.status(202).send(detalle);
    } catch (error) {
      console.log(error);
      res.status(404).send("No se encontro ningun documento");
    }
  });

  // Funcion DELETE
router.delete("/:_id", async (req, res) => {
    try {
      if (req.params._id.length != 24) {
        return res
          .status(404)
          .send("El id no contiene el numero correcto de digitos");
      }
      const detalle = await DetalleVenta.findById(req.params._id);
  
      if (!detalle) {
        return res
          .status(404)
          .send("No se encontro ningun documento para borrar");
      }
      await DetalleVenta.findByIdAndDelete(req.params._id);
  
      res.status(200).send("Registro borrado");
    } catch (error) {
      console.log(error);
      res.status(404).send("No se encontro ningun documento");
    }
  });
  
  module.exports = router;
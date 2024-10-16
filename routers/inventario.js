const express = require('express');
const Inventario = require('../modelos/InventarioModelo');
const router = express.Router();

// Funcion get todos
router.get('/', async(req, res) => {
    try {
        const inventario = await Inventario.find();
        res.send(inventario);
    } catch (error) {
        console.log(error);
        res.status(404).send('No se encontro ningun documento');
    }
});

// Funcion get por _id unico
router.get("/:_id", async (req, res) => {
    try {
      const inventario = await Inventario.findById(req.params._id)
  
      res.send(inventario);
    } catch (error) {
      console.log(error);
      res.status(404).send("No se encontro ningun documento");
    }
  });

// Funcion para agregar
router.post("/", async (req, res) => {
    try {
      const inventario = new Inventario(req.body);
      const result = await inventario.save();
      res.status(201).send(result);
    } catch (error) {
      console.log(error);
      res.status(404).send("No se pudo registrar el documento");
    }
  });

   // Funcion PUT
router.put("/:_id", async (req, res) => {
    try {
      const inventario = await Inventario.findByIdAndUpdate(req.params._id, req.body, {
        new: true,
      });
      res.status(202).send(inventario);
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
      const inventario = await Inventario.findById(req.params._id);
  
      if (!inventario) {
        return res
          .status(404)
          .send("No se encontro ningun documento para borrar");
      }
      await Inventario.findByIdAndDelete(req.params._id);
  
      res.status(200).send("Registro borrado");
    } catch (error) {
      console.log(error);
      res.status(404).send("No se encontro ningun documento");
    }
  });
  
  module.exports = router;
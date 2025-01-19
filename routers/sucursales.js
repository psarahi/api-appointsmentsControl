const express = require("express");
const Sucursal = require("../modelos/SucursalesModelo");
const Usuario = require("../modelos/UsuariosModelo");
const router = express.Router();

// Funcion get todos
router.get("/", async (req, res) => {
  try {
    const sucursales = await Sucursal.find();
    res.send(sucursales);
  } catch (error) {
    console.log(error);
    res.status(500).send("No se encontro ningun documento");
  }
});

// Get sucursales y usuarios
router.get("/sucusalesUsuarios", async (req, res) => {
  try {
    const sucursales = await Sucursal.find();
    const usuarios = await Usuario.find();
    const result = { sucursales: sucursales, usuarios: usuarios };
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("No se encontro ningun documento");
  }
});

// Funcion para agregar
router.post("/", async (req, res) => {
  try {
    const sucursal = new Sucursal(req.body);
    const result = await sucursal.save();
    res.status(201).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("No se pudo registrar el documento");
  }
});

// Funcion PUT
router.put("/:_id", async (req, res) => {
  try {
    //66cce95ffe40b42d2b69260e
    const sucursal = await Sucursal.findByIdAndUpdate(
      req.params._id,
      req.body,
      {
        new: true,
      }
    );
    res.status(202).send(sucursal);
  } catch (error) {
    console.log(error);
    res.status(500).send("No se encontro ningun documento");
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
    const sucursal = await Sucursal.findById(req.params._id);

    if (!sucursal) {
      return res
        .status(404)
        .send("No se encontro ningun documento para borrar");
    }
    await Sucursal.findByIdAndDelete(req.params._id);

    res.status(200).send("Registro borrado");
  } catch (error) {
    console.log(error);
    res.status(500).send("No se encontro ningun documento");
  }
});

module.exports = router;

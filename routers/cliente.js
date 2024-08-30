const express = require("express");
const Cliente = require("../modelos/ClientesModelo");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.send(clientes);
  } catch (error) {
    console.log(error);
    res.status(404).send("No se encontraron clientes");
  }
});
// Funcion get por _id unico
router.get("/:_id", async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params._id);
    res.send(cliente);
  } catch (error) {
    console.log(error);
    res.status(404).send("No se encontro ningun documento");
  }
});

// Funcion POST
router.post("/", async (req, res) => {
  try {
    const cliente = new Cliente(req.body);
    const result = await cliente.save();
    res.status(201).send(result);
  } catch (error) {
    console.log(error);
    res.status(404).send("No se pudo registrar el documento");
  }
});

// Funcion PUT
router.put("/:_id", async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(req.params._id, req.body, {
      new: true,
    });
    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(404).send("No se encontro ningun documento");
  }
});

// Funcion DELETE
router.delete("/:_id", async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params._id);
    res.status(404).send("No se encontro ningun documento para borrar");
    res.status(200).send("Cliente borrado");
  } catch (error) {
    console.log(error);
    res.status(404).send("No se encontro ningun documento");
  }
});

module.exports = router;

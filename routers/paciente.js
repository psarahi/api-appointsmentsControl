const express = require("express");
const Paciente = require("../modelos/PacienteModelo");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pacientes = await Paciente.find()
    .populate("sucursales")
    .sort({fechaRegistro: 'desc'});

    res.send(pacientes);
  } catch (error) {
    console.log(error);
    res.status(404).send("No se encontraron pacientes");
  }
});
// Funcion get por _id unico
router.get("/:_id", async (req, res) => {
  try {
    const paciente = await Paciente.findById(req.params._id)
    .populate("sucursales")

    res.send(paciente);
  } catch (error) {
    console.log(error);
    res.status(404).send("No se encontro ningun documento");
  }
});

// Funcion POST
router.post("/", async (req, res) => {
  try {
    const paciente = new Paciente(req.body);
    const result = await paciente.save();

    const pacienteSave = await Paciente.findById(result._id)
    .populate("sucursales");
    res.status(201).send(pacienteSave);
  } catch (error) {
    console.log(error);
    res.status(404).send("No se pudo registrar el documento");
  }
});

// Funcion PUT
router.put("/:_id", async (req, res) => {
  try {
    const paciente = await Paciente.findByIdAndUpdate(req.params._id, req.body, {
      new: true,
    })
    .populate("sucursales");


    res.status(202).send(paciente);
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
        .send("El id del paciente no contiene el numero correcto de digitos");
    }
    const paciente = await Paciente.findById(req.params._id);

    if (!paciente) {
      return res
        .status(404)
        .send("No se encontro ningun documento para borrar");
    }
    await Paciente.findByIdAndDelete(req.params._id);

    res.status(200).send("Paciente borrado");
  } catch (error) {
    console.log(error);
    res.status(404).send("No se encontro ningun documento");
  }
});

module.exports = router;

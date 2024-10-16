const express = require("express");
const Expediente = require("../modelos/expedientesModelo");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const expedientes = await Expediente.find()
    .populate("paciente")
    .populate("optometrista")
    .sort({fechaRegistro: 'desc'});

    res.send(expedientes);
  } catch (error) {
    console.log(error);
    res.status(404).send("No se encontraron expedientes");
  }
});
// Funcion get por _id unico
router.get("/:_id", async (req, res) => {
  try {
    const expediente = await Expediente(req.params._id)
    .populate("paciente")
    .populate("optometrista")

    res.send(expediente);
  } catch (error) {
    console.log(error);
    res.status(404).send("No se encontro ningun documento");
  }
});

// Funcion get por paciente
router.get("/paciente/:_id", async (req, res) => {
  try {
    const expediente = await Expediente.find({
        paciente: req.params._id,
    })
    .populate("paciente")
    .populate("optometrista")

    res.send(expediente);
  } catch (error) {
    console.log(error);
    res.status(404).send("No se encontro ningun documento");
  }
});

// Funcion POST
router.post("/", async (req, res) => {
  try {
    const expediente = new Expediente(req.body);
    const result = await expediente.save();

    const pacienteSave = await Expediente.findById(result._id)
    .populate("paciente")
    .populate("optometrista")

    res.status(201).send(pacienteSave);
  } catch (error) {
    console.log(error);
    res.status(404).send("No se pudo registrar el documento");
  }
});

// Funcion PUT
router.put("/:_id", async (req, res) => {
  try {
    const expediente = await Expediente.findByIdAndUpdate(req.params._id, req.body, {
      new: true,
    })
    .populate("paciente")
    .populate("optometrista");

    res.status(202).send(expediente);
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
        .send("El id del expediente no contiene el numero correcto de digitos");
    }
    const expediente = await Expediente.findById(req.params._id);

    if (!expediente) {
      return res
        .status(404)
        .send("No se encontro ningun documento para borrar");
    }
    await Expediente.findByIdAndDelete(req.params._id);

    res.status(200).send("Paciente borrado");
  } catch (error) {
    console.log(error);
    res.status(404).send("No se encontro ningun documento");
  }
});

module.exports = router;

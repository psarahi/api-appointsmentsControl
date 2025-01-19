const express = require("express");
const Inventario = require("../modelos/InventarioModelo");
const router = express.Router();

// Funcion get todos
router.get("/", async (req, res) => {
  try {
    const inventario = await Inventario.find();
    console.log(inventario);

    res.send(inventario);
  } catch (error) {
    console.log(error);
    res.status(500).send("No se encontro ningun documento");
  }
});

// Funcion get by sucursal
router.get("/bySucursal/:sucursal", async (req, res) => {
  try {
    const inventario = await Inventario.find({
      sucursales: {
        $eq: req.params.sucursal,
      }
    });
    res.send(inventario);
  } catch (error) {
    console.log(error);
    res.status(500).send("No se encontro ningun documento");
  }
});

// Funcion get by sucursal
router.get("/activos/:sucursal", async (req, res) => {
  try {
    const inventario = await Inventario.find({
      $and: [
        {
          sucursales: {
            $eq: req.params.sucursal,
          },
          estado: true,
        },
      ],
    });
    res.send(inventario);
  } catch (error) {
    console.log(error);
    res.status(500).send("No se encontro ningun documento");
  }
});

// Funcion get todos
router.get("/inventarioExistente", async (req, res) => {
  try {
    const inventario = await Inventario.find({
      existencia: { $gt: 0 },
    });
    res.send(inventario);
  } catch (error) {
    console.log(error);
    res.status(500).send("No se encontro ningun documento");
  }
});

// Funcion get por _id unico
router.get("/:_id", async (req, res) => {
  try {
    const inventario = await Inventario.findById(req.params._id);

    res.send(inventario);
  } catch (error) {
    console.log(error);
    res.status(500).send("No se encontro ningun documento");
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
    res.status(500).send("No se pudo registrar el documento");
  }
});

// Funcion PUT
router.put("/actualizarInventario", async (req, res) => {
  try {
    req.body.detalleInventario.forEach(async (element) => {
      const inventario = await Inventario.findById(element.inventario);
      const inv = await Inventario.findByIdAndUpdate(
        element.inventario,
        {
          existencia: inventario.existencia - element.cantidad,
        },
        { new: true }
      );
    });

    res.status(202).send("Inventario actualizado");
  } catch (error) {
    console.log(error);
    res.status(500).send("No se encontro ningun documento");
  }
});
// Funcion PUT
router.put("/:_id", async (req, res) => {
  try {
    const inventario = await Inventario.findByIdAndUpdate(
      req.params._id,
      req.body,
      { new: true }
    );
    res.status(202).send(inventario);
  } catch (error) {
    console.log(error);
    res.status(500).send("No se encontro ningun documento");
  }
});

// Funcion DELETE
router.put("/cambiarEstado/:_id", async (req, res) => {
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
    const invSave = await Inventario.findByIdAndUpdate(
      req.params._id,
      {
        estado: req.body.estado,
      },
      { new: true }
    );
    res.status(200).send(invSave);
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
    res.status(500).send("No se encontro ningun documento");
  }
});

module.exports = router;

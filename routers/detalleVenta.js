const express = require("express");
const DetalleVenta = require("../modelos/detalleVentaModelo");

const router = express.Router();

// Funcion get todos
router.get("/", async (req, res) => {
  try {
    const detalles = await DetalleVenta.find().populate([
      {
        path: "detalleInventario.inventario",
        select: "descripcion precioVenta precioCompra moda",
      },
      {
        path: "paciente",
        select: "nombre",
      },
      {
        path: "sucursales",
        select: "nombre",
      },
    ]);

    res.status(200).send(detalles);
  } catch (error) {
    console.log(error);
    res.status(404).send("No se encontro ningun documento");
  }
});

// Funcion get por paciente
router.get("/pacientes", async (req, res) => {
  try {
    const detalles = await DetalleVenta.find()
      .select("paciente")
      .populate([
        {
          path: "paciente",
          select: "nombre id",
        },
      ]);

    const pacientes = detalles.filter(
      (value, index, self) =>
        index ===
        self.findIndex((t) => {
          return t.paciente.id === value.paciente.id;
        })
    );

    // const pacientes = detalles.map((p) => p.paciente.nombre);
    // const uniquesPacientes = [...new Set(pacientes)];

    res.status(200).send(pacientes);
  } catch (error) {
    console.log(error);
    res.status(404).send("No se encontro ningun documento");
  }
});

// Funcion get por id
router.get("/idPaciente/:idPaciente", async (req, res) => {
  try {
    const detalles = await DetalleVenta.find({
      paciente: req.params.idPaciente,
    }).populate([
      {
        path: "detalleInventario.inventario",
        select: "descripcion precioVenta precioCompra moda",
      },
      {
        path: "paciente",
        select: "nombre",
      },
      {
        path: "sucursales",
        select: "nombre",
      },
    ]);

    res.status(200).send(detalles);
  } catch (error) {
    console.log(error);
    res.status(404).send("No se encontro ningun documento");
  }
});

// Funcion get por id
router.get("/:id", async (req, res) => {
  try {
    const detalles = await DetalleVenta.findById(req.params.id).populate([
      {
        path: "detalleInventario.inventario",
        select: "descripcion precioVenta precioCompra moda",
      },
      {
        path: "paciente",
        select: "nombre",
      },
      {
        path: "sucursales",
        select: "nombre",
      },
    ]);

    res.status(200).send(detalles);
  } catch (error) {
    console.log(error);
    res.status(404).send("No se encontro ningun documento");
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
    const detalle = await DetalleVenta.findByIdAndUpdate(
      req.params._id,
      req.body,
      {
        new: true,
      }
    );
    res.status(202).send(detalle);
  } catch (error) {
    console.log(error);
    res.status(404).send("No se encontro ningun documento");
  }
});

// Funcion PUT por detalle de pago
router.put("/detallePago/:_id", async (req, res) => {
  try {
    const detalle = await DetalleVenta.findById(req.params._id);
    const detalleSave = await DetalleVenta.findByIdAndUpdate(
      req.params._id,
      {
        $push: {
          detallePagos: req.body.detallePago,
        },
        $inc:{
          acuenta: req.body.detallePago.monto
        }
      },
      {
        new: true,
      }
    );
    res.status(202).send(detalleSave);
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

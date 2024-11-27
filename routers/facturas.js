const express = require("express");
const Facturas = require("../modelos/FacturasModelo");
const Correlativo = require("../modelos/CorrelativosModelo");

const router = express.Router();

// Funcion get todos
router.get("/", async (req, res) => {
  try {
    const factura = await Facturas.find()
      .populate("sucursales")
      .sort({ fechaLimiteEmision: -1 });
    res.send(factura);
  } catch (error) {
    console.log(error);
    res.status(404).send("No se encontro ningun documento");
  }
});

// Funcion get by sucursal
router.get("/bySucursal/:sucursal", async (req, res) => {
  try {
    const factura = await Facturas.find({
      sucursales: {
        $eq: req.params.sucursal,
      },
    }).sort({ fechaLimiteEmision: -1 });
    res.send(factura);
  } catch (error) {
    console.log(error);
    res.status(404).send("No se encontro ningun documento");
  }
});

// Funcion get factura / Recibo
router.get("/facturaRecibo/:sucursal", async (req, res) => {
  try {
    let factura = await Facturas.find({
      $and: [
        {
          sucursales: {
            $eq: req.params.sucursal,
          },
          estado: true,
        },
      ],
    });
    let correlativo = await Correlativo.find({
      sucursales: {
        $eq: req.params.sucursal,
      },
    });

    let numReciboFactura = {
      factura: [...factura],
      correlativo: [...correlativo],
    };
    res.send(numReciboFactura);
  } catch (error) {
    console.log(error);
    res.status(404).send("No se encontro ningun documento");
  }
});

// Funcion get by sucursal
router.get("/rangoActivo/:sucursal", async (req, res) => {
  try {
    const factura = await Facturas.find({
      $and: [
        {
          sucursales: {
            $eq: req.params.sucursal,
          },
          estado: true,
        },
      ],
    }).sort({ fechaLimiteEmision: -1 });
    res.send(factura);
  } catch (error) {
    console.log(error);
    res.status(404).send("No se encontro ningun documento");
  }
});

// Funcion get por _id unico
router.get("/:_id", async (req, res) => {
  try {
    const factura = await Facturas.findById(req.params._id).populate(
      "sucursales"
    );

    res.send(factura);
  } catch (error) {
    console.log(error);
    res.status(404).send("No se encontro ningun documento");
  }
});

// Funcion para agregar
router.post("/", async (req, res) => {
  try {
    const factura = new Facturas(req.body);
    const result = await factura.save();
    res.status(201).send(result);
  } catch (error) {
    console.log(error);
    res.status(404).send("No se pudo registrar el documento");
  }
});

// Funcion PUT
router.put("/actualizarInventario", async (req, res) => {
  try {
    req.body.detalleInventario.forEach(async (element) => {
      const factura = await Facturas.findById(element.factura);
      const inv = await Facturas.findByIdAndUpdate(
        element.factura,
        {
          existencia: factura.existencia - element.cantidad,
        },
        { new: true }
      );
    });

    res.status(202).send("Inventario actualizado");
  } catch (error) {
    console.log(error);
    res.status(404).send("No se encontro ningun documento");
  }
});
// Funcion PUT
router.put("/:_id", async (req, res) => {
  try {
    const factura = await Facturas.findByIdAndUpdate(req.params._id, req.body, {
      new: true,
    }).populate("sucursales");
    res.status(202).send(factura);
  } catch (error) {
    console.log(error);
    res.status(404).send("No se encontro ningun documento");
  }
});

// Funcion change status
router.put("/cambiarEstado/:_id", async (req, res) => {
  try {
    if (req.params._id.length != 24) {
      return res
        .status(404)
        .send("El id no contiene el numero correcto de digitos");
    }
    const factura = await Facturas.findById(req.params._id);

    if (!factura) {
      return res
        .status(404)
        .send("No se encontro ningun documento para borrar");
    }
    const facturaSave = await Facturas.findByIdAndUpdate(
      req.params._id,
      {
        estado: req.body.estado,
      },
      { new: true }
    ).populate("sucursales");
    res.status(200).send(facturaSave);
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
    const factura = await Facturas.findById(req.params._id);

    if (!factura) {
      return res
        .status(404)
        .send("No se encontro ningun documento para borrar");
    }
    await Facturas.findByIdAndDelete(req.params._id);

    res.status(200).send("Registro borrado");
  } catch (error) {
    console.log(error);
    res.status(404).send("No se encontro ningun documento");
  }
});

module.exports = router;

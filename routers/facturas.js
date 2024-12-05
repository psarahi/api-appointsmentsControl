const express = require("express");
const Facturas = require("../modelos/FacturasModelo");
const Correlativo = require("../modelos/CorrelativosModelo");

const escpos = require("escpos");
escpos.USB = require("escpos-usb");
const htmlToText = require("html-to-text");
const sharp = require("sharp");
const path = require("path");
const dayjs = require("dayjs");
const fs = require("fs");
const conversor = require("conversor-numero-a-letras-es-ar");
let ClaseConversor = conversor.conversorNumerosALetras;
let miConversor = new ClaseConversor();

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

// Funcion para imprimir
router.put("/imprimirFactura", async (req, res) => {
  try {
    console.log(req.body);

    // const device = new escpos.USB();

    // const printer = new escpos.Printer(device);
    // const resizeImage = async (inputPath, outputPath) => {
    //   await sharp(inputPath)
    //     .resize({ width: 300 }) // Match printer width
    //     .toFile(outputPath);
    // };

    const fac = await Facturas.find({
      $and: [
        {
          sucursales: {
            $eq: req.body.sucursales,
          },
          estado: true,
        },
      ],
    }).populate("sucursales");

    console.log(fac);

    const cai = fac[0].sucursales.cai;
    const rango = `${fac[0].desde} - ${fac[0].hasta}`;
    const rtn = fac[0].sucursales.rtn;
    const tel = fac[0].sucursales.telefono;
    const cel = fac[0].sucursales.celular;
    const direccion = fac[0].sucursales.direccion;
    const email = fac[0].sucursales.email;
    const factura = req.body.numFacRec;
    const mensaje = fac[0].mensaje;
    const fechaEmision = fac[0].fechaLimiteEmision;
    const cliente = req.body.rtn === "" ? req.body.cliente : req.body.nombreRtn;
    const rtnCliente = req.body.rtn === "" ? "" : req.body.rtn;
    const total = req.body.total;
    const descuento = req.body.totalDescuento;

    const articulos = req.body.inventario;

    const table = `
    <!doctype html>
        <html>
            <head>
                <meta charset='utf-8'>
                <link href='styles/style.css' rel='stylesheet' type='text/css' />        
            </head>   
            <body>
                <div class='invoice-box'>
                    <table style='width:100%' class='receipt-table' border='0'>
                        <thead>
                            <tr class='heading'>
                                <th>Cantidad</th>
                                <th>Descripcion</th>
                                <th>Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${articulos.map(
                              (item) =>
                                `
                                    <tr>
                                        <td>${item.cantidad}</td>
                                        <td>${item.descripcion}</td>
                                        <td>${item.precioVenta.toFixed(2)}</td>
                                    </tr>
                                `
                            )}
                        </tbody>
                </table>
                </div>            
            </body>     
        </html>
    `;

    const textHtml = htmlToText.convert(table, {
      wordwrap: false,
      tables: [".receipt-box", ".receipt-table"],
    });

    // device.open(function (error) {
    //   if (error) {
    //     console.error("Error al abrir el dispositivo:", error);
    //     return;
    //   }

    //   resizeImage("logoOptica.png", "output.png").then(() => {
    //     device.open(() => {
    //       if (error) {
    //         console.error("Error al abrir el dispositivo:", error);
    //         return;
    //       }
    //       escpos.Image.load(path.resolve("output.png"), (image) => {
    //         printer
    //           .align("ct")
    //           .raster(image)
    //           .font("a")
    //           //.align("ct")
    //           //.style('bu')
    //           .encode("utf8")
    //           .size(0, 0)
    //           .text("Con vision de servicio")
    //           .text(`RTN ${rtn}`)
    //           .text(`Tel: ${tel} / Cel: ${cel}`)
    //           .text(`Direccion ${direccion}`)
    //           .text(`Email ${email}`)
    //           .text("")
    //           .align("LT")
    //           .text(`#Factura: ${factura}`)
    //           .text(`Fecha: ${dayjs().format("YYYY-MM-DD hh:mm a")}`)
    //           .text(`Cliente: ${cliente}`)
    //           .text(`RTN: ${rtnCliente}`)
    //           .text(`Vendedor: General`)
    //           .text(`Terminos: Contado`)
    //           .text(`Estado: Pagado`)
    //           .text("")
    //           .drawLine()
    //           .text(textHtml)
    //           .drawLine()
    //           .align("RT")
    //           .text(`Descuento y rebajas L ${descuento}`)
    //           .text(`Sub Total L 1,568.00`)
    //           .text(`Importe Exento L 0.00`)
    //           .text(`Importe Exonerado L 1,568.00`)
    //           .text(`Importe Gravado 15% L 0.00`)
    //           .text(`Importe Gravado 18% L 1,568.00`)
    //           .text(`15% I.S.V. L 235.00`)
    //           .text(`18% I.S.V. L 235.00`)
    //           .text(`Total a pagar L 1,803.00`)
    //           .text("")
    //           .text(`${req.body.formaPago} L ${total}`)
    //           .text("")
    //           .align("ct")
    //           .text(miConversor.convertToText(total).toLocaleUpperCase())
    //           .align("lt")
    //           .text(`CAI: ${cai}`)
    //           .text(`Rango autorizado: ${rango}`)
    //           .text(
    //             `Fecha limite emision : ${dayjs(fechaEmision)
    //               .add(6, "hour")
    //               .format("YYYY-MM-DD")}`
    //           )
    //           .text("")
    //           .align("ct")
    //           .text("La factura es beneficio de todos, exijala")
    //           .text(mensaje)
    //           .text("")
    //           .text("")
    //           .beep(1, 100)
    //           .cut()
    //           .close();
    //       });
    //     });
    //   });
    // });

    res.send("print");
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
      $and: [
        {
          sucursales: {
            $eq: req.params.sucursal,
          },
        },
        {
          nombre: "Recibo",
        },
      ],
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

const express = require("express");
const Facturas = require("../modelos/FacturasModelo");
const Correlativo = require("../modelos/CorrelativosModelo");
const Sucursal = require("../modelos/SucursalesModelo");
const { formatearNumero, textValidator } = require("../helpers/formato");
const escpos = require("escpos");
escpos.USB = require("escpos-usb");
const htmlToText = require("html-to-text");
const sharp = require("sharp");
const path = require("path");
const dayjs = require("dayjs");
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
    res.status(500).send("No se encontro ningun documento");
  }
});

// Funcion para imprimir FACTURA
router.put("/imprimirFactura", async (req, res) => {
  try {
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

    let valorExento = 0.0;
    let valorGravado15 = 0.0;
    let isv15 = 0.0;

    const cai = fac[0].sucursales.cai;
    const rango = `${fac[0].desde} - ${fac[0].hasta}`;
    const rtn = fac[0].sucursales.rtn;
    const tel = fac[0].sucursales.telefono;
    const cel = fac[0].sucursales.celular;
    const vendedor = req.body.vendedor.toLocaleUpperCase();
    const direccion = fac[0].sucursales.direccion.toLocaleUpperCase();
    const email = fac[0].sucursales.email.toLocaleUpperCase();
    const factura = req.body.numFacRec;
    const mensajeFactura = fac[0].sucursales.mensajeFactura.toLocaleUpperCase();
    const fechaEmision = fac[0].fechaLimiteEmision;
    const cliente = !textValidator(req.body.rtn)
      ? req.body.cliente
      : req.body.nombreRtn;
    const rtnCliente = !textValidator(req.body.rtn) ? "" : req.body.rtn;
    const total = req.body.total;
    const descuento = req.body.totalDescuento;
    const formaPago = req.body.formaPago.toLocaleUpperCase();
    const articulos = req.body.inventario;

    let desxArt = formatearNumero(descuento / articulos.length);

    articulos.forEach((articulo) => {
      if (articulo.importe === "Exento") {
        valorExento += articulo.precioVenta - desxArt;
      } else if (articulo.valorGravado === "15%") {
        valorGravado15 += articulo.precioVenta - desxArt;
        isv15 += (articulo.precioVenta - desxArt) * 0.15;
      }
    });

    const totales = [
      {
        label: "DESCUENTOS Y REBAJAS",
        value: `L ${formatearNumero(descuento)}`,
      },
      {
        label: "SUB TOTAL",
        value: `L ${formatearNumero(total - isv15)}`,
      },
      {
        label: "IMPORTE EXENTO",
        value: `L ${formatearNumero(valorExento)}`,
      },
      {
        label: "IMPORTE EXONERADO",
        value: `L 0.00`,
      },
      {
        label: "IMPORTE GRAVADO 15%",
        value: `L ${formatearNumero(valorGravado15 - isv15)}`,
      },
      {
        label: "IMPORTE GRAVADO 18%",
        value: `L 0.00`,
      },
      {
        label: "I.S.V. 15%",
        value: `L ${formatearNumero(isv15)}`,
      },
      {
        label: "I.S.V. 18%",
        value: `L 0.00`,
      },
      {
        label: "TOTAL A PAGAR",
        value: `L  ${formatearNumero(total)}`,
      },
    ];

    let labelsTotales = [];
    const lineWidth = 32; // Ancho de caracteres por línea (depende de tu impresora)

    totales.forEach((t) => {
      const spacesBetween = Math.max(
        0,
        lineWidth - t.label.length - t.value.length
      );
      const alignedText = `${t.label}${" ".repeat(spacesBetween)}${t.value}`;

      labelsTotales.push(alignedText);
    });

    const datosImprimir = {
      rtn: rtn,
      tel: tel,
      cel: cel,
      direccion: direccion,
      email: email,
      numFacRec: factura,
      cliente: cliente,
      rtnCliente: rtnCliente,
      vendedor: vendedor,
      articulos: articulos,
      labelTotales: labelsTotales,
      monto: req.body.monto,
      formaPago: formaPago,
      fecha: "",
      fechaEmision: fechaEmision,
      total: total,
      totalLetras: miConversor.convertToText(total).toLocaleUpperCase(),
      acuenta: req.body.acuenta,
      cai: cai,
      rango: rango,
      paginaDigital: "",
      sucursales: req.body.sucursales,
      mensajeFactura: mensajeFactura
    };

    const device = new escpos.USB();
    const printer = new escpos.Printer(device);
    const resizeImage = async (inputPath, outputPath) => {
      await sharp(inputPath)
        .resize({ width: 400 }) // Match printer width
        .toFile(outputPath);
    };

    const table = `
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
                    <td>${item.descripcion.toLocaleUpperCase()}</td>
                    <td>${formatearNumero(item.precioVenta)}</td>
                   </tr>
                  `
            )}
          </tbody>
      </table>
    `;

    const textHtml = htmlToText.convert(table, {
      wordwrap: false,
      tables: [".receipt-box", ".receipt-table"],
    });

    device.open(function (error) {
      if (error) {
        console.error("Error al abrir el dispositivo:", error);
        return;
      }

      resizeImage("logoOptica.png", "output.png").then(() => {
        device.open(() => {
          if (error) {
            console.error("Error al abrir el dispositivo:", error);
            return;
          }

          escpos.Image.load(path.resolve("output.png"), (image) => {
            printer
              .align("ct")
              .raster(image)
              .font("a")
              .align("ct")
              .encode("utf8")
              .size(0, 0)
              .text("CON VISION DE SERVICIO")
              .text(`RTN ${rtn}`)
              .text(`TEL: ${tel} / CEL: ${cel}`)
              .text(`DIRECCION ${direccion}`)
              .text(`EMAIL ${email}`)
              .text("")
              .align("LT")
              .text(`#FACTURA: ${factura}`)
              .text(`FECHA: ${dayjs().format("YYYY-MM-DD hh:mm a")}`)
              .text(`CLIENTE: ${cliente}`)
              .text(`RTN: ${rtnCliente}`)
              .text(`VENDEDOR: ${vendedor}`)
              .text("")
              .align("RT")
              .drawLine()
              .text(textHtml)
              .drawLine()
              .text(labelsTotales[0])
              .text(labelsTotales[1])
              .text(labelsTotales[2])
              .text(labelsTotales[3])
              .text(labelsTotales[4])
              .text(labelsTotales[5])
              .text(labelsTotales[6])
              .text(labelsTotales[7])
              .text(labelsTotales[8])
              .text("")
              .text(`${formaPago} L ${formatearNumero(total)}`)
              .text("")
              .align("ct")
              .text(miConversor.convertToText(total).toLocaleUpperCase())
              .text("No ORDEN DE COMPRA EXENTA:")
              .text("No CONST. REGISTRO EXONERADO:")
              .text("No REGISTRO SAG:")
              .align("lt")
              .text(`CAI: ${cai}`)
              .text(`RANGO AUTORIZADO: ${rango}`)
              .text(
                `FECHA LIMITE DE EMISION : ${dayjs(fechaEmision)
                  .add(6, "hour")
                  .format("YYYY-MM-DD")}`
              )
              .text("")
              .align("ct")
              .text("LA FACTURA ES BENEFICIO DE TODOS, EXIJALA")
              .text(mensajeFactura.toLocaleUpperCase())
              .feed(3)
              .beep(1, 100)
              .cut()
              .close();
          });
        });
      });
    });

    res.send("print");
  } catch (error) {
    console.log(error);
    res.status(500).send("No se encontro ningun documento");
  }
});

// Funcion para imprimir RECIBO
router.put("/imprimirRecibo", async (req, res) => {
  try {
    const sucursal = await Sucursal.find({
      _id: req.body.sucursales,
    });

    const cel = sucursal[0].celular;
    const tel = sucursal[0].telefono;
    const nombreSucursal = sucursal[0].nombre;
    const vendedor = req.body.vendedor;
    const direccion = sucursal[0].direccion;
    const paginaDigital = sucursal[0].paginaDigital;
    const email = sucursal[0].email;
    const numTicket = req.body.numFacRec;
    const cliente = req.body.cliente;
    const total = req.body.total;
    const formaPago = req.body.formaPago;
    const monto = req.body.monto;
    const fecha = dayjs(req.body.fecha).add(6, "hour").format("YYYY-MM-DD");
    const articulos = req.body.inventario;
    const acuenta = req.body.acuenta;

    const table = `
      <table style='width:100%' class='receipt-table' border='0'>
        <thead>
          <tr class='heading'>
            <th>Descripcion</th>
          </tr>
        </thead>
          <tbody>
            ${articulos.map(
              (item) =>
                `
                  <tr>
                    <td>${item.descripcion.toLocaleUpperCase()}</td>
                   </tr>
                  `
            )}
          </tbody>
      </table>
    `;

    const textHtml = htmlToText.convert(table, {
      wordwrap: false,
      tables: [".receipt-box", ".receipt-table"],
    });

    const device = new escpos.USB();
    const printer = new escpos.Printer(device);

    device.open(function (error) {
      if (error) {
        console.error("Error al abrir el dispositivo:", error);
        return;
      }
      printer
        .font("a")
        .align("LT")
        .encode("utf8")
        .size(0.5, 0.5)
        .text(nombreSucursal)
        .size(0, 0)
        .text("Comprobante")
        .text(`Ticket # ${numTicket}`)
        .text(`FECHA: ${dayjs().format("YYYY-MM-DD hh:mm a")}`)
        .text(`Vendedor: ${vendedor}`)
        .text("")
        .text(`Cliente: ${cliente}`)
        .text(textHtml)
        .text("")
        .text(`Total: ${formatearNumero(total)}`)
        .text(`Acuenta: ${formatearNumero(acuenta)}`)
        .text(`Resta : ${formatearNumero(total - acuenta)}`)
        .text("")
        .text("Pago agregado")
        .text(`Cantidad L ${formatearNumero(monto)}`)
        .text(`Fecha ${fecha}`)
        .text(`Forma de pago ${formaPago}`)
        .feed(3)
        .drawLine()
        .text(cliente.toLocaleUpperCase())
        .text("Firma de autorizacion")
        .text("")
        .text("Recuerda que tu ticket es tu GARANTIA, consevalo.")
        .text("Nuestros datos de contacto:")
        .text(direccion)
        .text(`TEL: ${tel} / CEL: ${cel}`)
        .text(email)
        .text(paginaDigital)
        .feed(3)
        .beep(1, 100)
        .cut()
        .close();
    });

    res.send("print");
  } catch (error) {
    console.log(error);
    res.status(500).send("No se pudo imprimir");
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
    res.status(500).send("No se encontro ningun documento");
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

    let numCorrelativo = {
      factura: [...factura],
      correlativo: [...correlativo],
    };
    res.send(numCorrelativo);
  } catch (error) {
    console.log(error);
    res.status(500).send("No se encontro ningun documento");
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
    res.status(500).send("No se encontro ningun documento");
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
    res.status(500).send("No se encontro ningun documento");
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
    res.status(500).send("No se pudo registrar el documento");
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
    res.status(500).send("No se encontro ningun documento");
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
    res.status(500).send("No se encontro ningun documento");
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
    res.status(500).send("No se encontro ningun documento");
  }
});

module.exports = router;

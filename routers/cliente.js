const express = require('express');
const Cliente = require('../modelos/ClienteModelo');
const router = express.Router();

// Funcion get todos
router.get('/', async(req, res) => {
    try {
        const clientes = await Cliente.find()
        .populate('sucursales');

        res.send(clientes);
    } catch (error) {
        console.log(error);
        res.status(500).send('No se encontro ningun documento');
    }
});

// Funcion get todos
router.get('/bySucursal/:sucursal', async(req, res) => {
  try {
      const clientes = await Cliente.find({
        sucursales: req.params.sucursal
      })
      .populate('sucursales');

      res.send(clientes);
  } catch (error) {
      console.log(error);
      res.status(500).send('No se encontro ningun documento');
  }
});

// Funcion para agregar
router.post('/', async (req, res) => {
    try {
      const cliente = new Cliente(req.body);
      const result = (await cliente.save());

      const clienteSave = await Cliente.findById(result._id).populate(
        "sucursales"
      );
      res.status(201).send(clienteSave);
    } catch (error) {
      console.log(error);
      res.status(500).send('No se pudo registrar el documento');
    }
  });

  // Funcion PUT
router.put('/:_id', async (req, res) => {
    try {
      const clientes = await Cliente.findByIdAndUpdate(req.params._id, req.body, {
        new: true,
      }).populate('sucursales');
      res.status(202).send(clientes);
    } catch (error) {
      console.log(error);
      res.status(500).send('No se encontro ningun documento');
    }
  });


// Funcion PUT para cambiar estado
router.put("/cambiarEstado/:_id", async (req, res) => {
    try {        
      if (req.params._id.length != 24) {
        return res
          .status(404)
          .send("El id del usuario no contiene el numero correcto de digitos");
      }
  
      const cliente = await Cliente.findById(req.params._id);
  
      if (!cliente) {
        return res
          .status(404)
          .send("No se encontro ningun documento para borrar");
      }
  
      const clienteUpdate = await Cliente.findByIdAndUpdate(
        req.params._id,
        { estado: req.body.estado },
        {
          new: true,
        }
      );
  
      res.status(202).send(clienteUpdate);
    } catch (error) {
      console.log(error);
      res.status(500).send("No se encontro ningun documento");
    }
  });

  // Funcion DELETE
router.delete('/:_id', async (req, res) => {
    try {
      if (req.params._id.length != 24) {
        return res
          .status(404)
          .send('El id no contiene el numero correcto de digitos');
      }
      const clientes = await Cliente.findById(req.params._id);
  
      if (!clientes) {
        return res
          .status(404)
          .send('No se encontro ningun documento para borrar');
      }
      await Cliente.findByIdAndDelete(req.params._id);
  
      res.status(200).send('Registro borrado');
    } catch (error) {
      console.log(error);
      res.status(500).send('No se encontro ningun documento');
    }
  });
  
  module.exports = router;
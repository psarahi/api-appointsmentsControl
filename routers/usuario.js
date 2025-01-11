const express = require("express");
const bcrypt = require("bcrypt");
const Usuario = require("../modelos/UsuariosModelo");
const router = express.Router();
const { generarJWT } = require("../helpers/jwt");
const jwt = require("jsonwebtoken");

// Funcion get todos
router.get("/", async (req, res) => {
  try {
    const usuarios = await Usuario.find()
      .populate("sucursales")
      .sort({ fechaRegistro: -1 });
    res.send(usuarios);
  } catch (error) {
    console.log(error);
    res.status(404).send("No se encontro ningun documento");
  }
});

// Funcion get documentos activos
router.get("/activo", async (req, res) => {
  try {
    const usuarios = await Usuario.find({ estado: true })
      .populate("sucursales")
      .sort({ fechaRegistro: -1 });
    res.send(usuarios);
  } catch (error) {
    console.log(error);
    res.status(404).send("No se encontro ningun documento");
  }
});

// Funcion get por _id unico
router.get("/:_id", async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params._id).populate(
      "sucursales"
    );

    res.send(usuario);
  } catch (error) {
    console.log(error);
    res.status(404).send("No se encontro ningun documento");
  }
});

// Funcion POST
router.post("/", async (req, res) => {
  try {
    let usuarioFind = await Usuario.find({
      usuario: {
        $eq: req.body.usuario,
      },
    });
    if (usuarioFind.length > 0) return res.status(400).send("Usurio ya existe");

    const salt = bcrypt.genSaltSync();
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const usuarioSave = new Usuario(req.body);
    usuarioSave.password = hashPassword;

    const result = await usuarioSave.save();
    const jwtToken = await generarJWT(usuarioSave.id, usuarioSave.nombre);

    const usuarioResult = await Usuario.findById(result._id).populate(
      "sucursales"
    );

    res.status(201).header("authorization", jwtToken).send(usuarioResult);
  } catch (error) {
    console.log(error);
    res.status(404).send("No se pudo registrar el documento");
  }
});

// Login de usuario
router.post("/login", async (req, res) => {
  const { usuario, password } = req.body;

  try {
    const usuarioFind = await Usuario.findOne({
      $and: [
        {
          estado: true,
          usuario: {
            $eq: usuario,
          },
          // sucursales: {
          //   $eq: req.body.sucursales,
          // },
        },
      ],
    });

    if (!usuarioFind) {
      return res.status(404).send("No existe el usuario");
    }

    // Confirmar los passwords
    const validPassword = bcrypt.compareSync(password, usuarioFind.password);

    if (!validPassword) {
      return res.status(404).send("La contraseña es incorrecta");
    }

    // Generar JWT
    const token = await generarJWT(usuarioFind.id, usuarioFind.name);
    let payload = jwt.verify(token, process.env.SECRET_JWT);
    payload.token = token;
    payload.nombre = usuarioFind.nombre;

    res.status(201).header("authorization", token).send(payload);
    // res.status(201).send('');
  } catch (error) {
    console.log(error);
    res
      .status(501)
      .send("Error en el sevidor, Favor comuniquese con el administrador");
  }
});

// Funcion PUT
router.put("/:_id", async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(req.params._id, req.body, {
      new: true,
    }).populate("sucursales");

    res.status(202).send(usuario);
  } catch (error) {
    console.log(error);
    res.status(404).send("No se encontro ningun documento");
  }
});

// Funcion PUT de contraseña
router.put("/changePass/:_id", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const usuario = await Usuario.findByIdAndUpdate(
      req.params._id,
      { ...req.body, password: hashPassword },
      {
        new: true,
      }
    ).populate("sucursales");

    res.status(202).send(usuario);
  } catch (error) {
    console.log(error);
    res.status(404).send("No se encontro ningun documento");
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

    const usuario = await Usuario.findById(req.params._id);

    if (!usuario) {
      return res
        .status(404)
        .send("No se encontro ningun documento para borrar");
    }

    const usuarioUpdate = await Usuario.findByIdAndUpdate(
      req.params._id,
      { estado: req.body.estado },
      {
        new: true,
      }
    );

    res.status(202).send(usuarioUpdate);
  } catch (error) {
    console.log(error);
    res.status(404).send("No se encontro ningun documento");
  }
});

// Funcion DELETE
router.delete("/:_id", async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params._id);
    res.status(200).send("usuario borrada");
  } catch (error) {
    console.log(error);
    res.status(404).send("No se encontro ningun documento");
  }
});

module.exports = router;

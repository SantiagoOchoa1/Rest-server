const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/user.db");

const userGet = async (req = request, res = response) => {
  // Ejemplo de solicitud de parametros en la request
  // const { nombre, apellido, edad } = req.query;

  const { limit = 5, start = 0 } = req.query;
  const soloActivos = { estate: true };

  // const usuarios = await Usuario.find(soloActivos)
  //   .skip(Number(start))
  //   .limit(Number(limit));

  // const total = await Usuario.countDocuments(soloActivos);

  const answer = await Promise.all([
    Usuario.find(soloActivos).skip(Number(start)).limit(Number(limit)),
    Usuario.countDocuments(soloActivos),
  ]);

  res.json({
    answer,
    // total,
    // usuarios,
  });
};

const userPut = async (req, res = response) => {
  const { id } = req.params;
  const { password, google, correo, ...resto } = req.body;
  if (password) {
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);
  res.json(usuario);
};

const userPost = async (req, res = response) => {
  const { name, correo, password, role } = req.body;
  const usuario = new Usuario({ name, correo, password, role });

  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  // Guardar en base de datos
  await usuario.save();

  res.json(usuario);
};

const userDelete = async (req, res = response) => {
  const { id } = req.params;
  //const userAuth = req.user;
  const usuario = await Usuario.findByIdAndUpdate(id, { estate: false });
  res.json(usuario);
};

module.exports = { userGet, userPut, userPost, userDelete };

const { request, response } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/user.db");
const { generarJWT } = require("../helpers/generar-jwt");

const authPost = async (req = request, res = response) => {
  const { correo, password } = req.body;

  try {
    // Verificar si el correo existe en la DB
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "El correo o contreña son incorrectos - Correo",
      });
    }
    // El usuario tiene estado activo?
    if (!usuario.estate) {
      return res.status(400).json({
        msg: "El correo o contraseña son incorrectos - Estate: false",
      });
    }
    // Verificar la contraseña
    const checkPassword = bcryptjs.compareSync(password, usuario.password);
    if (!checkPassword) {
      return res.status(400).json({
        msg: "El correo o contraseña son incorrectos - password incorrecto",
      });
    }
    // Generar el JWT

    const token = await generarJWT(usuario.id);
    res.json({
      msg: "login OK",
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Comuniquese con el administrador",
    });
  }
};

module.exports = { authPost };

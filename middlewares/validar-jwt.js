const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/user.db");

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({
      msg: "La peticion no cuenta con token de verificacion",
    });
  }
  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // Validar uid en la DB de usuarios
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(401).json({
        msg: "Token no valido - usuario no está en DB",
      });
    }

    // Verificar si el usuario cuenta con estado en true
    if (!usuario.estate) {
      return res.status(401).json({
        msg: "Token no valido - estado: false",
      });
    }

    req.user = usuario;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      msg: "token no valida",
    });
  }
};

module.exports = { validarJWT };

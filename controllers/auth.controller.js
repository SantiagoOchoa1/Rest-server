const { request, response } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/user.db");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

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

const googleSignIn = async (req = request, res = response) => {
  const { id_token } = req.body;
  try {
    const { name, correo, img } = await googleVerify(id_token); // Info del usuario verificado de google

    // Crear usuario en la DB
    let usuario = await Usuario.findOne({ correo });

    // Si el usuario no está la DB hay que crearlo
    if (!usuario) {
      const data = {
        name,
        correo,
        password: ":P",
        img,
        google: true,
        role: "USER_ROLE",
      };
      usuario = new Usuario(data);
      await usuario.save();
    }

    // El usuario puede existir, entonces se verifica si el estado es False
    if (!usuario.estate) {
      return res.status(401).json({
        msg: "Comuniquese con el administrador - Usuario de google en estado FALSE",
      });
    }

    // Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "token no valido",
    });
  }
};

module.exports = { authPost, googleSignIn };

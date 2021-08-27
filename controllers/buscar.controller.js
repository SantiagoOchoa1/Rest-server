const { request, response } = require("express");
const { ObjectId } = require("mongoose").Types;

const { Usuario, Producto, Categoria } = require("../models");

const coleccionesDisponibles = ["usuarios", "categorias", "productos"];

const buscarUsuario = async (termino = "", res = response) => {
  const isMongoId = ObjectId.isValid(termino);
  if (isMongoId) {
    const usuario = await Usuario.findById(termino);
    return res.json({
      results: usuario ? [usuario] : [],
    });
  }

  const regex = new RegExp(termino, "i");
  const usuarios = await Usuario.find({
    $or: [{ name: regex }, { correo: regex }],
    $and: [{ estate: true }],
  });
  res.json({
    results: usuarios,
  });
};

const buscarCategoria = async (termino = "", res = response) => {
  const isMongoId = ObjectId.isValid(termino);
  if (isMongoId) {
    const categoria = await Categoria.findById(termino);
    return res.json({
      results: categoria ? [categoria] : [],
    });
  }

  const regex = new RegExp(termino, "i");
  const categorias = await Categoria.find({ nombre: regex });
  res.json({
    results: categorias,
  });
};

const buscarProducto = async (termino = "", res = response) => {
  const isMongoId = ObjectId.isValid(termino);
  if (isMongoId) {
    const producto = await Producto.findById(termino);
    return res.json({
      results: producto ? [producto] : [],
    });
  }

  const regex = new RegExp(termino, "i");
  const productos = await Producto.find({ nombre: regex });
  res.json({
    results: productos,
  });
};

const buscar = (req = request, res = response) => {
  const { coleccion, termino } = req.params;

  if (!coleccionesDisponibles.includes(coleccion)) {
    res.status(400).json({
      msg: `La coleccion ${coleccion} no está entre las categorias disponibles: ${coleccionesDisponibles}`,
    });
  }

  switch (coleccion) {
    case "usuarios":
      buscarUsuario(termino, res);
      break;
    case "categorias":
      buscarCategoria(termino, res);
      break;
    case "productos":
      buscarProducto(termino, res);
      break;
    default:
      res.status(500).json({
        msg: `No se manejó el caso de ${coleccion}`,
      });
      break;
  }
};

module.exports = { buscar };

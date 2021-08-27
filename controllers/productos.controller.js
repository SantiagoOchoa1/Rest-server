const { request, response } = require("express");

const { Producto } = require("../models");

const obtenerProductos = async (req = request, res = response) => {
  try {
    const { limit = 5, start = 0 } = req.query;
    const soloActivos = { estado: true };

    const answer = await Promise.all([
      Producto.find(soloActivos)
        .skip(Number(start))
        .limit(Number(limit))
        .populate("usuario", ["name", "correo"])
        .populate("categoria", "nombre"),
      Producto.countDocuments(soloActivos),
    ]);
    res.json({
      answer,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error al solicitar productos",
    });
  }
};

// Obtener 1 producto
const obtenerProducto = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const producto = await Producto.findById(id)
      .populate("usuario", ["name", "correo"])
      .populate("categoria", "nombre");

    res.json({
      producto,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error en la solicitud del producto en la DB",
    });
  }
};
// Crear 1 producto
const crearProducto = async (req = request, res = response) => {
  try {
    const userId = req.user._id;
    const { estado, usuario, ...body } = req.body;
    const productoDB = await Producto.findOne({ nombre: body.nombre });
    if (productoDB) {
      return res.status(400).json({
        msg: `El producto con nombre ${productoDB.nombre}`,
      });
    }
    const data = {
      nombre: req.body.nombre.toUpperCase(),
      usuario: userId,
      ...body,
    };
    const producto = new Producto(data);
    await producto.save();
    res.status(201).json({
      producto,
    });
  } catch (error) {
    console.log(error);
  }
};

// Actualizar 1 producto
const actualizarProducto = async (req = request, res = response) => {
  const { usuario, ...data } = req.body;
  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase();
  }
  data.usuario = req.user._id;
  const { id } = req.params;
  try {
    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });
    res.json({
      producto,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error al actualizar el producto",
    });
  }
};

// Borrar un producto
const borrarProducto = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const producto = await Producto.findOneAndUpdate(
      id,
      { estado: false },
      { new: true }
    );
    res.json({
      producto,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error al borrar el producto",
    });
  }
};

module.exports = {
  obtenerProductos,
  crearProducto,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
};

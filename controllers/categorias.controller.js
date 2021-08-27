const { request, response } = require("express");
const { Categoria } = require("../models");

// OBtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req = request, res = response) => {
  try {
    const { limit = 5, start = 0 } = req.query;
    const soloActivos = { estado: true };

    const answer = await Promise.all([
      Categoria.find(soloActivos)
        .skip(Number(start))
        .limit(Number(limit))
        .populate("usuario", ["name", "correo"]),
      Categoria.countDocuments(soloActivos),
    ]);

    res.json({
      answer,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error en la solicitud de las categorias en la DB",
    });
  }
};

// obtenerCategoria - populate

const obtenerCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const categoria = await Categoria.findById(id).populate("usuario", [
      "name",
      "correo",
    ]);

    res.json({
      categoria,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error en la solicitud de la categoria en la DB",
    });
  }
};

// Crear Categoria
const crearCategoria = async (req = request, res = response) => {
  try {
    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
      return res.status(400).json({
        msg: `La categoria ${categoriaDB.nombre} ya existe en la DB`,
      });
    }

    //Crear la categoria en la DB
    const data = { nombre, usuario: req.user._id };

    const categoria = new Categoria(data);
    await categoria.save();

    res.json({
      categoria,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Comuniquese con el administrador",
    });
  }
};

// actualizarCategoria
const actualizarCategoria = async (req = request, res = response) => {
  const nombre = req.body.nombre.toUpperCase();
  const { id } = req.params;
  const idUsuario = req.user._id;
  data = { nombre, usuario: idUsuario };
  try {
    const categoria = await Categoria.findByIdAndUpdate(id, data, {
      new: true,
    });
    res.json({
      categoria,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Comuniquese con el administrador",
    });
  }
};

// borrarCategoria - estado: false

const borrarCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const categoria = await Categoria.findByIdAndUpdate(
      id,
      { estado: false },
      { new: true }
    );
    res.json({
      categoria,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Comuniquese con el administrador",
    });
  }
};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria,
};

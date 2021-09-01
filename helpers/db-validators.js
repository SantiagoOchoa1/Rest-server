const { Role, Producto, Usuario, Categoria } = require("../models");

// Validar si el rol está entre los roles permitidos
const validarRole = async (role = "") => {
  const existeRole = await Role.findOne({ role });
  if (!existeRole) {
    throw new Error(`El rol ${role} no se encuentra en la base de datos`);
  }
};

// Verificar si el correo ya existe
const validarCorreoExiste = async (correo = "") => {
  const correoExiste = await Usuario.findOne({ correo });
  if (correoExiste) {
    throw new Error(`El correo ${correo} ya existe`);
  }
};

// Verificar si existe usuario por ID dado
const validarUsuarioPorId = async (id) => {
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`El usuario con id ${id} no existe`);
  }
};

// Verificar si existe categoria por ID dado
const validarCategoriaPorId = async (id) => {
  const existeCategoria = await Categoria.findById(id);
  if (!existeCategoria) {
    throw new Error(`La categoria con id ${id} no existe`);
  }
};

const validarProductoPorId = async (id) => {
  const existeProducto = await Producto.findById(id);
  if (!existeProducto) {
    throw new Error(`El producto con id ${id} no existe`);
  }
};

const coleccionesPermitidas = (coleccion = "", colecciones = []) => {
  const incluida = colecciones.includes(coleccion);
  if (!incluida) {
    throw new Error(
      `La coleccion ${coleccion} no esta entre las permitidas. - ${colecciones}`
    );
  }
  return true;
};

module.exports = {
  validarRole,
  validarCorreoExiste,
  validarUsuarioPorId,
  validarCategoriaPorId,
  validarProductoPorId,
  coleccionesPermitidas,
};

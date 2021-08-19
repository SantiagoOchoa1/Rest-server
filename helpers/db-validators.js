const Role = require("../models/role.db");
const Usuario = require("../models/user.db");

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

module.exports = { validarRole, validarCorreoExiste, validarUsuarioPorId };

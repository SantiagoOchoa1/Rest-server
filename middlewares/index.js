const validarCampos = require("../middlewares/validar-campos");
const validarJWT = require("../middlewares/validar-jwt");
const validarRoles = require("../middlewares/validar-roles");
const verificarArchivo = require("./verificar-archivo");

module.exports = {
  ...validarCampos,
  ...validarJWT,
  ...validarRoles,
  ...verificarArchivo,
};

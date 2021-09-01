const crearArchivo = require("./crear-archivo");
const dbValidators = require("./db-validators");
const generarJWT = require("./generar-jwt");
const googleVerify = require("./google-verify");

module.exports = {
  ...crearArchivo,
  ...dbValidators,
  ...generarJWT,
  ...googleVerify,
};

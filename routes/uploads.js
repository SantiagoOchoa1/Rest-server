const { Router } = require("express");
const { check } = require("express-validator");

const {
  cargarArchivo,
  actualizarArchivo,
  getImagen,
  actualizarArchivoCloudinary,
} = require("../controllers/uploads.controller");
const { coleccionesPermitidas } = require("../helpers");
const { validarCampos, validarArchivoCargar } = require("../middlewares");

const router = Router();

router.post("/", validarArchivoCargar, cargarArchivo);

router.put(
  "/:coleccion/:id",
  [
    validarArchivoCargar,
    check("id", "El id debe ser un id válido").isMongoId(),
    check("coleccion", "La coleccion no es permitida").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validarCampos,
  ],
  // actualizarArchivo
  actualizarArchivoCloudinary
);

router.get(
  "/:coleccion/:id",
  [
    check("id", "El id debe ser un id válido").isMongoId(),
    check("coleccion", "La coleccion no es permitida").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validarCampos,
  ],
  getImagen
);

module.exports = router;

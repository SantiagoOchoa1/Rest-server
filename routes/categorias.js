const { Router } = require("express");
const { check } = require("express-validator");

const {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria,
} = require("../controllers/categorias.controller");
const { validarCategoriaPorId } = require("../helpers/db-validators");
const {
  validarJWT,
  validarCampos,
  validarAdminRole,
} = require("../middlewares");

const router = Router();

// Obtener todas las categorias - Publico
router.get("/", obtenerCategorias);

// Obtener una categoria por id - publico
router.get(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(validarCategoriaPorId),
    validarCampos,
  ],
  obtenerCategoria
);

// Crear una categoria - privado
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);

// Actualizar una categoria por id - privado (token valido)
router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre no es obligatorio").not().isEmpty(),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(validarCategoriaPorId),
    validarCampos,
  ],
  actualizarCategoria
);

// Borrar una categoria por id - Solo el Admin (marcar el estado en false)
router.delete(
  "/:id",
  [
    validarJWT,
    validarAdminRole,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(validarCategoriaPorId),
    validarCampos,
  ],
  borrarCategoria
);
module.exports = router;

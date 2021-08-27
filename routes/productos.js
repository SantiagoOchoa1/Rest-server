const { Router } = require("express");
const { check } = require("express-validator");

const {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
} = require("../controllers/productos.controller");
const { validarProductoPorId } = require("../helpers/db-validators");

const {
  validarJWT,
  validarCampos,
  validarAdminRole,
  validarCategoriaPorNombre,
} = require("../middlewares");

const router = Router();

// Obtener todas las categorias - Publico
router.get("/", obtenerProductos);

// Obtener una categoria por id - publico
router.get(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(validarProductoPorId),
    validarCampos,
  ],
  obtenerProducto
);

// Crear una categoria - privado
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("categoria", "La categoria del producto es obligatorio")
      .not()
      .isEmpty(),
    check(
      "categoria",
      "El id de la categoria debe ser un id válido"
    ).isMongoId(),
    validarCampos,
  ],
  crearProducto
);

// Actualizar una categoria por id - privado (token valido)
router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(validarProductoPorId),
    validarCampos,
  ],
  actualizarProducto
);

// Borrar una categoria por id - Solo el Admin (marcar el estado en false)
router.delete(
  "/:id",
  [
    validarJWT,
    validarAdminRole,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(validarProductoPorId),
    validarCampos,
  ],
  borrarProducto
);
module.exports = router;

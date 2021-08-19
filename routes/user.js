const { Router } = require("express");
const { check } = require("express-validator");

const {
  userGet,
  userPut,
  userPost,
  userDelete,
} = require("../controllers/user.controller");
const {
  validarRole,
  validarCorreoExiste,
  validarUsuarioPorId,
} = require("../helpers/db-validators");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.get("/", userGet);

router.put(
  "/:id",
  [
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(validarUsuarioPorId),
    check("role")
      .if((value, { req }) => req.body.role)
      .custom(validarRole),
  ],
  userPut
);

router.post(
  "/",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("correo", "El correo no es valido").isEmail(),
    check("correo").custom(validarCorreoExiste),
    check("password", "La contraseña debe ser mayor a 5 caracteres").isLength({
      min: 6,
    }),
    // check("role", "El rol no es valido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    check("role").custom(validarRole),
    validarCampos,
  ],
  userPost
);

router.delete(
  "/:id",
  [
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(validarUsuarioPorId),
    validarCampos,
  ],
  userDelete
);

module.exports = router;

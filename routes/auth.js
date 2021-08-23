const { Router } = require("express");
const { check } = require("express-validator");

const { authPost } = require("../controllers/auth.controller");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.post(
  "/login",
  [
    check("correo", "el correo es obligatorio").isEmail(),
    check("password", "La constraseña es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  authPost
);

module.exports = router;

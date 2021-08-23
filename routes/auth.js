const { Router } = require("express");
const { check } = require("express-validator");

const { authPost, googleSignIn } = require("../controllers/auth.controller");
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

router.post(
  "/google",
  [check("id_token", "el token es obligatorio").not().isEmpty(), validarCampos],
  googleSignIn
);

module.exports = router;

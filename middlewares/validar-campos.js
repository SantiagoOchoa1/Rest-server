const { validationResult } = require("express-validator");

const validarCampos = (req, res, next) => {
  // revisar si hay errores en el middleware de validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }

  next();
};

module.exports = { validarCampos };

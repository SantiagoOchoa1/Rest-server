const { request, response } = require("express");

const validarAdminRole = (req = request, res = response, next) => {
  if (!req.user) {
    return res.status(500).json({
      msg: "No es posible verificar el usuario en la request",
    });
  }
  const { role, name } = req.user;
  if (role !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${name} no cuenta con permisos de administrador`,
    });
  }
  next();
};

const tieneRole = (...roles) => {
  return (req = request, res = response, next) => {
    if (!req.user) {
      return res.status(500).json({
        msg: "No es posible verificar el usuario en la request",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        msg: `el servicio requiere tener algunos de estos roles ${roles}`,
      });
    }
    next();
  };
};

module.exports = { validarAdminRole, tieneRole };

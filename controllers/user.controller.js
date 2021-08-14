const { response, request } = require("express");

const userGet = (req = request, res = response) => {
  const { nombre, apellido, edad } = req.query;
  res.json({
    msg: "get API - controller",
    nombre,
    apellido,
    edad,
  });
};

const userPut = (req, res = response) => {
  const { id } = req.params;
  res.json({
    msg: "put API - controller",
    id,
  });
};

const userPost = (req, res = response) => {
  const body = req.body;
  res.json({
    msg: "post API - controller",
    body,
  });
};

const userDelete = (req, res = response) => {
  res.json({
    msg: "delete API - controller",
  });
};

module.exports = { userGet, userPut, userPost, userDelete };

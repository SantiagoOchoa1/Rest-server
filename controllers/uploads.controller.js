const { request, response } = require("express");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

cloudinary.config(process.env.CLOUDINARY_URL);

const { CrearArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");

const cargarArchivo = async (req = request, res = response) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(400).json({ msg: "No files were uploaded." });
    return;
  }

  try {
    //txt y md
    const name = await CrearArchivo(req.files, undefined, "imgs");

    res.json({
      path: name,
    });
  } catch (msg) {
    res.status(400).json({
      msg,
    });
  }
};

const actualizarArchivo = async (req = request, res = response) => {
  const { coleccion, id } = req.params;

  let modelo;
  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe usuario con el id ${id}`,
        });
      }
      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe producto con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({
        msg: "Esta opcion no fue manejada",
      });
  }

  // Verificar si ya hay una imagen para ese usuario/producto
  if (modelo.img) {
    pathBorrar = path.join(__dirname, "../uploads", coleccion, modelo.img);

    try {
      if (fs.existsSync(pathBorrar)) {
        fs.unlinkSync(pathBorrar);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: "Error al borrar la imagen de la carpeta",
      });
    }
  }

  const name = await CrearArchivo(req.files, undefined, coleccion);
  modelo.img = name;
  await modelo.save();

  res.json({
    modelo,
  });
};

const actualizarArchivoCloudinary = async (req = request, res = response) => {
  const { coleccion, id } = req.params;

  let modelo;
  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe usuario con el id ${id}`,
        });
      }
      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe producto con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({
        msg: "Esta opcion no fue manejada",
      });
  }

  // Verificar si ya hay una imagen para ese usuario/producto
  if (modelo.img) {
    try {
      const pathArr = modelo.img.split("/");
      const [public_id] = pathArr[pathArr.length - 1].split(".");
      cloudinary.uploader.destroy(public_id);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: "Error al borrar la imagen de cloudinary",
      });
    }
  }
  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

  // const name = await CrearArchivo(req.files, undefined, coleccion);
  modelo.img = secure_url;
  await modelo.save();

  res.json({
    modelo,
  });
};

const getImagen = async (req, res = response) => {
  const { coleccion, id } = req.params;

  let modelo;
  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe usuario con el id ${id}`,
        });
      }
      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe producto con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({
        msg: "Esta opcion no fue manejada",
      });
  }

  // Verificar si ya hay una imagen para ese usuario/producto
  if (modelo.img) {
    pathImg = path.join(__dirname, "../uploads", coleccion, modelo.img);

    try {
      if (fs.existsSync(pathImg)) {
        return res.sendFile(pathImg);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: "Error al enviar la imagen de la carpeta",
      });
    }
  }

  // No hubo imagen en la DB
  pathNoImg = path.join(__dirname, "../assets/no-image.jpg");
  if (fs.existsSync(pathNoImg)) {
    res.sendFile(pathNoImg);
  }
};

module.exports = {
  cargarArchivo,
  actualizarArchivo,
  getImagen,
  actualizarArchivoCloudinary,
};

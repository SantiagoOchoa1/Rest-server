const path = require("path");
const { v4: uuidv4 } = require("uuid");

const extImg = ["jpg", "jpeg", "png", "gif"];

const CrearArchivo = (files, extAllow = extImg, carpeta = "") => {
  return new Promise((resolve, reject) => {
    const { archivo } = files;

    const nameSeparate = archivo.name.split(".");
    const ext = nameSeparate[nameSeparate.length - 1];
    if (!extAllow.includes(ext)) {
      return reject(
        `La extension ${ext} no pertenece a las extensiones permitidas ${extAllow}`
      );
    }

    const nameTemp = uuidv4() + "." + ext;

    const uploadPath = path.join(__dirname, "../uploads/", carpeta, nameTemp);

    archivo.mv(uploadPath, function (err) {
      if (err) {
        reject(err);
      }

      resolve(nameTemp);
    });
  });
};

module.exports = { CrearArchivo };

const express = require("express");
const cors = require("cors");
const { dbConnnection } = require("../database/config.db");
const fileUpload = require("express-fileupload");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    //conectar a base de datos
    this.connectDB();
    this.routePath = {
      auth: "/api/auth",
      buscar: "/api/buscar",
      categorias: "/api/categorias",
      productos: "/api/productos",
      users: "/api/users",
      uploads: "/api/uploads",
    };

    //middlewares
    this.middlewares();
    this.routes();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());

    // directorio público
    this.app.use(express.static("public"));

    // carga de archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  async connectDB() {
    await dbConnnection();
  }

  routes() {
    this.app.use(this.routePath.auth, require("../routes/auth"));
    this.app.use(this.routePath.buscar, require("../routes/buscar"));
    this.app.use(this.routePath.categorias, require("../routes/categorias"));
    this.app.use(this.routePath.productos, require("../routes/productos"));
    this.app.use(this.routePath.users, require("../routes/user"));
    this.app.use(this.routePath.uploads, require("../routes/uploads"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en la ruta http://localhost:", this.port);
    });
  }
}

module.exports = Server;

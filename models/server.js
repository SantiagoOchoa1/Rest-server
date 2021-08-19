const express = require("express");
const cors = require("cors");
const { dbConnnection } = require("../database/config.db");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    //conectar a base de datos
    this.connectDB();

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
  }

  async connectDB() {
    await dbConnnection();
  }

  routes() {
    this.app.use("/api/users", require("../routes/user"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en la ruta http://localhost:", this.port);
    });
  }
}

module.exports = Server;

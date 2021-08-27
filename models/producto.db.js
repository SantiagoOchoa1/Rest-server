const { Schema, model } = require("mongoose");

const productoSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es requerido"],
    unique: true,
  },
  estado: {
    type: Boolean,
    default: true,
    required: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  precio: {
    type: Number,
    default: 0,
  },
  categoria: {
    type: Schema.Types.ObjectId,
    ref: "Categoria",
    required: [true, "La categoria a la que pertenece es obligatoria"],
  },
  descripcion: { type: String },
  disponible: { type: Boolean, default: true },
});

productoSchema.methods.toJSON = function () {
  const { __v, ...data } = this.toObject();
  return data;
};

module.exports = model("Producto", productoSchema);

const { Schema, model } = require("mongoose");

const roleSchema = Schema({
  role: {
    type: String,
    required: [true, "El rol es requerido"],
  },
});

module.exports = model("Role", roleSchema);
